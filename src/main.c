#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#include "../include/disk_scheduler.h"
#include "../include/algorithms.h"
#include "../include/visualizer.h"
#include "../include/metrics.h"
#include "../include/utils.h"
#include "../include/colors.h"

static void print_banner(void) {
    printf("%s%s========================================================================================%s\n", 
           ANSI_BOLD, ANSI_BRIGHT_CYAN, ANSI_RESET);
    printf("%s                  DISC SCHEDULING ANALYZER & HARDWARE SIMULATOR                         %s\n", 
           ANSI_BOLD, ANSI_RESET);
    printf("%s             Advanced Operating Systems (AOS) - I/O Subsystem Modeling                %s\n", 
           ANSI_DIM, ANSI_RESET);
    printf("%s========================================================================================%s\n", 
           ANSI_BRIGHT_CYAN, ANSI_RESET);
}

static void print_status_bar(const DiskConfig *config, const int *requests, int count) {
    printf("\n%s[Current Configuration]%s\n", ANSI_BOLD, ANSI_RESET);
    printf("  Cylinders: %s0-%d%s | Head: %s%d%s | Direction: %s%s%s | RPM: %.0f | Requests: %s%d%s\n",
           ANSI_CYAN, config->total_cylinders - 1, ANSI_RESET,
           ANSI_YELLOW, config->initial_head, ANSI_RESET,
           ANSI_MAGENTA, (config->direction == DIR_UP ? "UP (Towards Max)" : "DOWN (Towards 0)"), ANSI_RESET,
           config->rpm,
           ANSI_GREEN, count, ANSI_RESET);

    printf("  Queue: [");
    int show_count = (count > 16) ? 16 : count;
    for (int i = 0; i < show_count; i++) {
        printf("%d%s", requests[i], (i == show_count - 1) ? "" : ", ");
    }
    if (count > 16) printf(" ... +%d more", count - 16);
    printf("]\n");
}

static void print_theory_guide(void) {
    printf("\n%s%s============================= DISC SCHEDULING THEORY & AOS CONCEPTS =============================%s\n",
           ANSI_BOLD, ANSI_BRIGHT_YELLOW, ANSI_RESET);
    printf("%s1. FCFS (First-Come, First-Served):%s\n", ANSI_BOLD, ANSI_RESET);
    printf("   - Simplest policy. Serves requests in exact order of arrival.\n");
    printf("   - Advantages : 100%% fair, zero starvation risk, easy to implement in software.\n");
    printf("   - Drawbacks  : Severe head thrashing (wild swinging), high average seek time, wild variance.\n\n");

    printf("%s2. SSTF (Shortest Seek Time First):%s\n", ANSI_BOLD, ANSI_RESET);
    printf("   - Greedily selects request with minimal seek distance from current head position.\n");
    printf("   - Advantages : Substantially reduces total head movement and increases throughput.\n");
    printf("   - Drawbacks  : High risk of STARVATION for requests located far from the current cluster.\n\n");

    printf("%s3. SCAN (Elevator Algorithm):%s\n", ANSI_BOLD, ANSI_RESET);
    printf("   - Moves head in one direction servicing requests until reaching the disk boundary (0 or Max-1),\n");
    printf("     then reverses direction and services requests on return sweep.\n");
    printf("   - Advantages : High throughput, eliminates starvation, provides upper bound on wait time.\n");
    printf("   - Drawbacks  : Requests that just missed the sweep wait for a full round-trip traversal.\n\n");

    printf("%s4. C-SCAN (Circular SCAN):%s\n", ANSI_BOLD, ANSI_RESET);
    printf("   - Sweeps in one direction to boundary, then immediately returns to the start boundary without\n");
    printf("     servicing requests on the return jump.\n");
    printf("   - Advantages : More uniform wait times than SCAN; inner and outer cylinders treated equally.\n");
    printf("   - Drawbacks  : Extra head movement during the unserviced return jump.\n\n");

    printf("%s5. LOOK & C-LOOK (Optimized Elevator Policies):%s\n", ANSI_BOLD, ANSI_RESET);
    printf("   - Look ahead: reverses or wraps immediately at the last actual request, avoiding wasteful trips\n");
    printf("     to disk boundaries (0 and Max-1).\n");
    printf("   - Advantages : Significantly lower seek distance than pure SCAN/C-SCAN while retaining fairness.\n\n");

    printf("%s6. F-SCAN (Freeze SCAN - Advanced AOS Policy):%s\n", ANSI_BOLD, ANSI_RESET);
    printf("   - Freezes the request queue into an active batch and a secondary incoming queue.\n");
    printf("   - Prevents starvation caused by new arrivals clustering directly ahead of the elevator head.\n");
    printf("%s=================================================================================================%s\n\n",
           ANSI_BRIGHT_YELLOW, ANSI_RESET);
}

static void wait_for_enter(void) {
    printf("\n%sPress ENTER to continue...%s", ANSI_DIM, ANSI_RESET);
    int c;
    while ((c = getchar()) != '\n' && c != EOF);
}

static void prompt_custom_workload(DiskConfig *config, int *requests, int *num_requests) {
    char input_buf[256];
    printf("\n%s--- ENTER CUSTOM WORKLOAD ---%s\n", ANSI_BOLD, ANSI_RESET);
    printf("Enter total cylinders [current: %d]: ", config->total_cylinders);
    if (fgets(input_buf, sizeof(input_buf), stdin) && input_buf[0] != '\n') {
        int c_val = atoi(input_buf);
        if (c_val > 1) config->total_cylinders = c_val;
    }

    printf("Enter initial head position (0 to %d) [current: %d]: ", 
           config->total_cylinders - 1, config->initial_head);
    if (fgets(input_buf, sizeof(input_buf), stdin) && input_buf[0] != '\n') {
        int h_val = atoi(input_buf);
        if (is_valid_cylinder(h_val, config->total_cylinders)) {
            config->initial_head = h_val;
        } else {
            printf("Out of bounds; keeping %d\n", config->initial_head);
        }
    }

    printf("Enter head direction (1 = UP / higher cylinders, 0 = DOWN / lower cylinders) [current: %d]: ", 
           config->direction);
    if (fgets(input_buf, sizeof(input_buf), stdin) && input_buf[0] != '\n') {
        int d_val = atoi(input_buf);
        config->direction = (d_val == 0) ? DIR_DOWN : DIR_UP;
    }

    printf("\nEnter cylinder request queue (space or comma-separated on one line):\n> ");
    char req_line[4096];
    if (fgets(req_line, sizeof(req_line), stdin)) {
        int temp_requests[MAX_REQUESTS];
        int temp_count = 0;
        char *tok = strtok(req_line, ", \t\r\n");
        bool all_valid = true;
        while (tok && temp_count < MAX_REQUESTS) {
            int r = atoi(tok);
            if (!is_valid_cylinder(r, config->total_cylinders)) {
                printf("%sError: Cylinder %d is outside range 0-%d%s\n", 
                       ANSI_RED, r, config->total_cylinders - 1, ANSI_RESET);
                all_valid = false;
                break;
            }
            temp_requests[temp_count++] = r;
            tok = strtok(NULL, ", \t\r\n");
        }
        if (all_valid && temp_count > 0) {
            *num_requests = temp_count;
            for (int i = 0; i < temp_count; i++) requests[i] = temp_requests[i];
            printf("%sUpdated %d requests successfully!%s\n", ANSI_GREEN, temp_count, ANSI_RESET);
        } else {
            printf("Update cancelled or invalid.\n");
        }
    }
}

static void prompt_preset_workload(DiskConfig *config, int *requests, int *num_requests) {
    char input_buf[256];
    printf("\n%sSelect Workload Preset:%s\n", ANSI_BOLD, ANSI_RESET);
    printf("  1. Silberschatz OS Textbook Example (Head: 53, Cylinders: 200, 8 requests)\n");
    printf("  2. Clustered Workload (Database index & transaction log hotspots)\n");
    printf("  3. Oscillating / Ping-Pong Stress Test (Severe head thrashing demo)\n");
    printf("  4. Sequential Access (Streaming / contiguous file block reads)\n");
    printf("Selection (1-4): ");
    if (fgets(input_buf, sizeof(input_buf), stdin)) {
        int p = atoi(input_buf);
        if (p == 1) *num_requests = load_preset_textbook(requests, config);
        else if (p == 2) *num_requests = load_preset_clustered(requests, config);
        else if (p == 3) *num_requests = load_preset_oscillating(requests, config);
        else if (p == 4) *num_requests = load_preset_sequential(requests, config);
        else printf("Invalid preset.\n");
        printf("%sLoaded preset successfully!%s\n", ANSI_GREEN, ANSI_RESET);
    }
}

static void run_algorithm_simulation(DiskConfig *config, int *requests, int *num_requests) {
    char input_buf[256];
    while (1) {
        printf("\n%s%s========================================================================================%s\n", 
               ANSI_BOLD, ANSI_CYAN, ANSI_RESET);
        printf("%s           CHOOSE DISC SCHEDULING ALGORITHM TO SIMULATE & ANALYZE               %s\n", 
               ANSI_BOLD, ANSI_RESET);
        printf("%s========================================================================================%s\n", 
               ANSI_CYAN, ANSI_RESET);
        print_status_bar(config, requests, *num_requests);

        printf("\n%sAlgorithm Selection:%s\n", ANSI_BOLD, ANSI_RESET);
        printf("  %s1.%s FCFS   - First-Come, First-Served\n", ANSI_CYAN, ANSI_RESET);
        printf("  %s2.%s SSTF   - Shortest Seek Time First\n", ANSI_CYAN, ANSI_RESET);
        printf("  %s3.%s SCAN   - Elevator Algorithm (Sweeps to Boundary)\n", ANSI_CYAN, ANSI_RESET);
        printf("  %s4.%s C-SCAN - Circular SCAN (Uniform Return Jump)\n", ANSI_CYAN, ANSI_RESET);
        printf("  %s5.%s LOOK   - Boundary-Optimized Elevator\n", ANSI_CYAN, ANSI_RESET);
        printf("  %s6.%s C-LOOK - Circular Boundary-Optimized Elevator\n", ANSI_CYAN, ANSI_RESET);
        printf("  %s7.%s F-SCAN - Two-Queue Frozen Batch Policy\n", ANSI_CYAN, ANSI_RESET);
        printf("  --------------------------------------------------------\n");
        printf("  %s8.%s Enter / Modify Custom Workload (Head, Cylinders, Requests)\n", ANSI_YELLOW, ANSI_RESET);
        printf("  %s9.%s Load Standard Preset Workload (Textbook, Database, etc.)\n", ANSI_YELLOW, ANSI_RESET);
        printf("  %s0.%s Return to Main Menu\n", ANSI_RED, ANSI_RESET);

        printf("\n%sSelect an option (0-9): %s", ANSI_BOLD, ANSI_RESET);
        if (!fgets(input_buf, sizeof(input_buf), stdin)) break;
        int a = atoi(input_buf);

        if (a == 0) {
            break;
        } else if (a == 8) {
            prompt_custom_workload(config, requests, num_requests);
            wait_for_enter();
            continue;
        } else if (a == 9) {
            prompt_preset_workload(config, requests, num_requests);
            wait_for_enter();
            continue;
        }

        ScheduleResult res;
        bool valid = true;
        switch (a) {
            case 1: schedule_fcfs(requests, *num_requests, config, &res); break;
            case 2: schedule_sstf(requests, *num_requests, config, &res); break;
            case 3: schedule_scan(requests, *num_requests, config, &res); break;
            case 4: schedule_cscan(requests, *num_requests, config, &res); break;
            case 5: schedule_look(requests, *num_requests, config, &res); break;
            case 6: schedule_clook(requests, *num_requests, config, &res); break;
            case 7: schedule_fscan(requests, *num_requests, config, &res); break;
            default:
                printf("Invalid selection.\n");
                valid = false;
                break;
        }

        if (valid) {
            visualize_step_by_step(&res, config);
            visualize_timeline_graph(&res, config);
            visualize_single_summary(&res, config);
            wait_for_enter();
        }
    }
}

/* Run interactive menu */
static void interactive_menu(DiskConfig *config, int *requests, int *num_requests) {
    char input_buf[256];

    while (1) {
        print_banner();
        print_status_bar(config, requests, *num_requests);

        printf("\n%sMAIN MENU:%s\n", ANSI_BOLD, ANSI_RESET);
        printf("  %s1.%s Simulate & Analyze Disk Scheduling Algorithm (Step-by-Step Platter Map & Trajectory Graph)\n", ANSI_CYAN, ANSI_RESET);
        printf("  %s0.%s Exit\n", ANSI_RED, ANSI_RESET);

        printf("\n%sSelect option (0-1): %s", ANSI_BOLD, ANSI_RESET);
        if (!fgets(input_buf, sizeof(input_buf), stdin)) break;

        int choice = atoi(input_buf);

        if (choice == 0) {
            printf("\n%sThank you for using Disc Scheduling Analyzer! Goodbye.%s\n\n", ANSI_GREEN, ANSI_RESET);
            break;
        } else if (choice == 1) {
            run_algorithm_simulation(config, requests, num_requests);
        } else {
            printf("Invalid selection.\n");
            wait_for_enter();
        }
    }
}

static void print_cli_help(const char *prog_name) {
    printf("Usage: %s [OPTIONS]\n\n", prog_name);
    printf("Options:\n");
    printf("  -h, --help                 Display this help message and exit\n");
    printf("  -p, --preset <name>        Load preset workload ('textbook', 'clustered', 'oscillating', 'sequential')\n");
    printf("  -f, --file <filepath>      Load workload from text configuration file\n");
    printf("  -r, --random <count>       Generate uniform random workload of N requests\n");
    printf("  -c, --cylinders <num>      Set total disk cylinders (default: 200)\n");
    printf("  --head <cylinder>          Set initial head position (default: 53)\n");
    printf("  --direction <up|down>      Set initial sweep direction (default: up)\n");
    printf("  --algo <name>              Run specific algorithm ('fcfs', 'sstf', 'scan', 'cscan', 'look', 'clook', 'fscan')\n");
    printf("  --all                      Run all algorithms and show comparison table & bar chart\n");
    printf("  --export <filepath>        Export analysis report to text file\n");
    printf("  --csv <filepath>           Export metrics to CSV file\n");
    printf("  --theory                   Display OS scheduling theory and complexity guide\n");
    printf("\nIf no arguments are provided, the interactive menu is launched.\n");
}

int main(int argc, char *argv[]) {
    init_terminal_colors();

    DiskConfig config;
    int requests[MAX_REQUESTS];
    int num_requests = load_preset_textbook(requests, &config);

    if (argc == 1) {
        interactive_menu(&config, requests, &num_requests);
        return 0;
    }

    /* CLI Flag Parsing */
    bool run_all_flag = false;
    char specific_algo[32] = "";
    char export_report_path[256] = "";
    char export_csv_path[256] = "";

    for (int i = 1; i < argc; i++) {
        if (strcmp(argv[i], "-h") == 0 || strcmp(argv[i], "--help") == 0) {
            print_cli_help(argv[0]);
            return 0;
        } else if (strcmp(argv[i], "--theory") == 0) {
            print_theory_guide();
            return 0;
        } else if (strcmp(argv[i], "-p") == 0 || strcmp(argv[i], "--preset") == 0) {
            if (i + 1 < argc) {
                const char *p = argv[++i];
                if (strcasecmp(p, "textbook") == 0) num_requests = load_preset_textbook(requests, &config);
                else if (strcasecmp(p, "clustered") == 0) num_requests = load_preset_clustered(requests, &config);
                else if (strcasecmp(p, "oscillating") == 0) num_requests = load_preset_oscillating(requests, &config);
                else if (strcasecmp(p, "sequential") == 0) num_requests = load_preset_sequential(requests, &config);
                else {
                    fprintf(stderr, "Unknown preset: %s\n", p);
                    return 1;
                }
            }
        } else if (strcmp(argv[i], "-f") == 0 || strcmp(argv[i], "--file") == 0) {
            if (i + 1 < argc) {
                const char *f = argv[++i];
                if (!load_workload_from_file(f, requests, &num_requests, &config)) {
                    fprintf(stderr, "Failed to load file: %s\n", f);
                    return 1;
                }
            }
        } else if (strcmp(argv[i], "-r") == 0 || strcmp(argv[i], "--random") == 0) {
            if (i + 1 < argc) {
                int count = atoi(argv[++i]);
                if (count > 0 && count <= MAX_REQUESTS) {
                    num_requests = count;
                    generate_random_uniform(requests, count, config.total_cylinders);
                }
            }
        } else if (strcmp(argv[i], "-c") == 0 || strcmp(argv[i], "--cylinders") == 0) {
            if (i + 1 < argc) {
                config.total_cylinders = atoi(argv[++i]);
            }
        } else if (strcmp(argv[i], "--head") == 0) {
            if (i + 1 < argc) {
                config.initial_head = atoi(argv[++i]);
            }
        } else if (strcmp(argv[i], "--direction") == 0) {
            if (i + 1 < argc) {
                const char *d = argv[++i];
                if (strcasecmp(d, "down") == 0 || strcasecmp(d, "0") == 0) {
                    config.direction = DIR_DOWN;
                } else {
                    config.direction = DIR_UP;
                }
            }
        } else if (strcmp(argv[i], "--algo") == 0) {
            if (i + 1 < argc) {
                strncpy(specific_algo, argv[++i], sizeof(specific_algo) - 1);
            }
        } else if (strcmp(argv[i], "--all") == 0) {
            run_all_flag = true;
        } else if (strcmp(argv[i], "--export") == 0) {
            if (i + 1 < argc) {
                strncpy(export_report_path, argv[++i], sizeof(export_report_path) - 1);
            }
        } else if (strcmp(argv[i], "--csv") == 0) {
            if (i + 1 < argc) {
                strncpy(export_csv_path, argv[++i], sizeof(export_csv_path) - 1);
            }
        }
    }

    /* Execute requested actions */
    print_banner();
    print_status_bar(&config, requests, num_requests);

    ScheduleResult results[MAX_ALGORITHMS];
    int count = 0;
    run_all_algorithms(requests, num_requests, &config, results, &count);

    if (strlen(specific_algo) > 0) {
        ScheduleResult single_res;
        bool found = false;
        if (strcasecmp(specific_algo, "fcfs") == 0) {
            schedule_fcfs(requests, num_requests, &config, &single_res);
            found = true;
        } else if (strcasecmp(specific_algo, "sstf") == 0) {
            schedule_sstf(requests, num_requests, &config, &single_res);
            found = true;
        } else if (strcasecmp(specific_algo, "scan") == 0) {
            schedule_scan(requests, num_requests, &config, &single_res);
            found = true;
        } else if (strcasecmp(specific_algo, "cscan") == 0 || strcasecmp(specific_algo, "c-scan") == 0) {
            schedule_cscan(requests, num_requests, &config, &single_res);
            found = true;
        } else if (strcasecmp(specific_algo, "look") == 0) {
            schedule_look(requests, num_requests, &config, &single_res);
            found = true;
        } else if (strcasecmp(specific_algo, "clook") == 0 || strcasecmp(specific_algo, "c-look") == 0) {
            schedule_clook(requests, num_requests, &config, &single_res);
            found = true;
        } else if (strcasecmp(specific_algo, "fscan") == 0 || strcasecmp(specific_algo, "f-scan") == 0) {
            schedule_fscan(requests, num_requests, &config, &single_res);
            found = true;
        }

        if (found) {
            visualize_step_by_step(&single_res, &config);
            visualize_timeline_graph(&single_res, &config);
            visualize_single_summary(&single_res, &config);
        } else {
            fprintf(stderr, "Unknown algorithm: %s\n", specific_algo);
        }
    }

    if (run_all_flag || strlen(specific_algo) == 0) {
        visualize_comparison_bar_chart(results, count);
        visualize_comparison_table(results, count, &config);
    }

    if (strlen(export_report_path) > 0) {
        if (export_report_to_file(export_report_path, results, count, &config, requests, num_requests)) {
            printf("\n%sExported report to: %s%s\n", ANSI_GREEN, export_report_path, ANSI_RESET);
        }
    }

    if (strlen(export_csv_path) > 0) {
        if (export_csv_to_file(export_csv_path, results, count)) {
            printf("%sExported CSV metrics to: %s%s\n", ANSI_GREEN, export_csv_path, ANSI_RESET);
        }
    }

    return 0;
}
