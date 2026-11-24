#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <ctype.h>
#include "../include/utils.h"

void init_default_config(DiskConfig *config) {
    config->total_cylinders = DEFAULT_CYLINDERS;
    config->initial_head = DEFAULT_INITIAL_HEAD;
    config->direction = DIR_UP;
    config->rpm = DEFAULT_RPM;
    config->seek_time_per_cylinder = DEFAULT_SEEK_PER_CYL;
    config->base_seek_overhead = DEFAULT_BASE_OVERHEAD;
    config->transfer_rate_mbps = DEFAULT_TRANSFER_MBPS;
    config->sector_size_bytes = DEFAULT_SECTOR_BYTES;
}

static int compare_ints(const void *a, const void *b) {
    return (*(const int *)a - *(const int *)b);
}

void sort_array_ascending(int *arr, int n) {
    if (n > 1) {
        qsort(arr, n, sizeof(int), compare_ints);
    }
}

bool is_valid_cylinder(int cylinder, int max_cylinders) {
    return (cylinder >= 0 && cylinder < max_cylinders);
}

bool validate_request_array(const int *requests, int count, int max_cylinders) {
    if (count <= 0 || count > MAX_REQUESTS) return false;
    for (int i = 0; i < count; i++) {
        if (!is_valid_cylinder(requests[i], max_cylinders)) {
            return false;
        }
    }
    return true;
}

void generate_random_uniform(int *requests, int count, int max_cylinders) {
    static bool seeded = false;
    if (!seeded) {
        srand((unsigned int)time(NULL));
        seeded = true;
    }
    for (int i = 0; i < count; i++) {
        requests[i] = rand() % max_cylinders;
    }
}

void generate_clustered_workload(int *requests, int count, int max_cylinders) {
    static bool seeded = false;
    if (!seeded) {
        srand((unsigned int)time(NULL));
        seeded = true;
    }
    int cluster1 = max_cylinders / 5;
    int cluster2 = (max_cylinders * 4) / 5;
    int spread = max_cylinders / 20;
    if (spread < 5) spread = 5;

    for (int i = 0; i < count; i++) {
        int center = (rand() % 2 == 0) ? cluster1 : cluster2;
        int offset = (rand() % (2 * spread + 1)) - spread;
        int val = center + offset;
        if (val < 0) val = 0;
        if (val >= max_cylinders) val = max_cylinders - 1;
        requests[i] = val;
    }
}

void generate_oscillating_workload(int *requests, int count, int max_cylinders) {
    for (int i = 0; i < count; i++) {
        if (i % 2 == 0) {
            requests[i] = (i * 3) % (max_cylinders / 4);
        } else {
            requests[i] = (max_cylinders - 1) - ((i * 3) % (max_cylinders / 4));
        }
    }
}

void generate_sequential_workload(int *requests, int count, int max_cylinders, int start_cyl) {
    int cur = start_cyl;
    for (int i = 0; i < count; i++) {
        requests[i] = cur;
        cur = (cur + 1 + (rand() % 3)) % max_cylinders;
    }
}

/* Preset 1: Textbook Silberschatz OS */
int load_preset_textbook(int *requests, DiskConfig *config) {
    init_default_config(config);
    config->total_cylinders = 200;
    config->initial_head = 53;
    config->direction = DIR_UP;

    int default_queue[] = {98, 183, 37, 122, 14, 124, 65, 67};
    int n = sizeof(default_queue) / sizeof(default_queue[0]);
    for (int i = 0; i < n; i++) {
        requests[i] = default_queue[i];
    }
    return n;
}

/* Preset 2: Clustered Database Hotspots */
int load_preset_clustered(int *requests, DiskConfig *config) {
    init_default_config(config);
    config->total_cylinders = 1000;
    config->initial_head = 150;
    config->direction = DIR_UP;

    int queue[] = {120, 125, 118, 130, 850, 860, 845, 870, 140, 855, 122, 880};
    int n = sizeof(queue) / sizeof(queue[0]);
    for (int i = 0; i < n; i++) {
        requests[i] = queue[i];
    }
    return n;
}

/* Preset 3: Oscillating / Ping-Pong Stress Workload */
int load_preset_oscillating(int *requests, DiskConfig *config) {
    init_default_config(config);
    config->total_cylinders = 500;
    config->initial_head = 250;
    config->direction = DIR_UP;

    int queue[] = {15, 485, 25, 475, 30, 460, 40, 450, 10, 490};
    int n = sizeof(queue) / sizeof(queue[0]);
    for (int i = 0; i < n; i++) {
        requests[i] = queue[i];
    }
    return n;
}

/* Preset 4: Sequential Access (Streaming / Log Append) */
int load_preset_sequential(int *requests, DiskConfig *config) {
    init_default_config(config);
    config->total_cylinders = 500;
    config->initial_head = 100;
    config->direction = DIR_UP;

    int queue[] = {105, 108, 112, 115, 120, 128, 135, 142, 150, 160};
    int n = sizeof(queue) / sizeof(queue[0]);
    for (int i = 0; i < n; i++) {
        requests[i] = queue[i];
    }
    return n;
}

/* Helper to trim leading/trailing whitespace */
char *trim_whitespace(char *str) {
    while (isspace((unsigned char)*str)) str++;
    if (*str == 0) return str;
    char *end = str + strlen(str) - 1;
    while (end > str && isspace((unsigned char)*end)) end--;
    end[1] = '\0';
    return str;
}

/* Load workload from file */
bool load_workload_from_file(const char *filepath, int *requests, int *num_requests, DiskConfig *config) {
    FILE *fp = fopen(filepath, "r");
    if (!fp) {
        return false;
    }

    init_default_config(config);
    *num_requests = 0;

    char line[1024];
    bool structured_format = false;

    while (fgets(line, sizeof(line), fp)) {
        char *trimmed = trim_whitespace(line);
        if (trimmed[0] == '#' || trimmed[0] == '\0') {
            continue; /* Skip comments and blank lines */
        }

        if (strncasecmp(trimmed, "cylinders", 9) == 0) {
            char *eq = strchr(trimmed, '=');
            if (eq) config->total_cylinders = atoi(eq + 1);
            structured_format = true;
        } else if (strncasecmp(trimmed, "head", 4) == 0) {
            char *eq = strchr(trimmed, '=');
            if (eq) config->initial_head = atoi(eq + 1);
            structured_format = true;
        } else if (strncasecmp(trimmed, "direction", 9) == 0) {
            char *eq = strchr(trimmed, '=');
            if (eq) {
                char *val = trim_whitespace(eq + 1);
                if (strncasecmp(val, "down", 4) == 0 || strncasecmp(val, "left", 4) == 0) {
                    config->direction = DIR_DOWN;
                } else {
                    config->direction = DIR_UP;
                }
            }
            structured_format = true;
        } else if (strncasecmp(trimmed, "rpm", 3) == 0) {
            char *eq = strchr(trimmed, '=');
            if (eq) config->rpm = atof(eq + 1);
            structured_format = true;
        } else if (strncasecmp(trimmed, "requests", 8) == 0) {
            char *eq = strchr(trimmed, '=');
            char *ptr = eq ? (eq + 1) : trimmed;
            char *token = strtok(ptr, ", \t\r\n");
            while (token && *num_requests < MAX_REQUESTS) {
                requests[(*num_requests)++] = atoi(token);
                token = strtok(NULL, ", \t\r\n");
            }
            structured_format = true;
        } else if (!structured_format) {
            /* Fallback: parse raw numbers separated by commas or whitespace */
            char *token = strtok(trimmed, ", \t\r\n");
            while (token && *num_requests < MAX_REQUESTS) {
                requests[(*num_requests)++] = atoi(token);
                token = strtok(NULL, ", \t\r\n");
            }
        }
    }

    fclose(fp);
    return (*num_requests > 0);
}

/* Export human-readable report to text file */
bool export_report_to_file(const char *filepath, const ScheduleResult results[], int count, 
                           const DiskConfig *config, const int *requests, int num_requests) {
    FILE *fp = fopen(filepath, "w");
    if (!fp) return false;

    fprintf(fp, "========================================================================================\n");
    fprintf(fp, "                        DISC SCHEDULING ANALYZER - DETAILED REPORT                      \n");
    fprintf(fp, "========================================================================================\n\n");

    fprintf(fp, "DISK CONFIGURATION:\n");
    fprintf(fp, "  Total Cylinders          : %d (0 to %d)\n", config->total_cylinders, config->total_cylinders - 1);
    fprintf(fp, "  Initial Head Position    : %d\n", config->initial_head);
    fprintf(fp, "  Initial Direction        : %s\n", (config->direction == DIR_UP) ? "UP (Towards Max)" : "DOWN (Towards 0)");
    fprintf(fp, "  Spindle Speed            : %.0f RPM\n", config->rpm);
    fprintf(fp, "  Seek Per Cylinder        : %.3f ms\n", config->seek_time_per_cylinder);
    fprintf(fp, "  Base Overhead Delay      : %.3f ms\n", config->base_seek_overhead);
    fprintf(fp, "  Transfer Rate            : %.1f MB/s\n", config->transfer_rate_mbps);
    fprintf(fp, "  Sector Size              : %d bytes\n\n", config->sector_size_bytes);

    fprintf(fp, "REQUEST QUEUE (%d requests):\n  ", num_requests);
    for (int i = 0; i < num_requests; i++) {
        fprintf(fp, "%d%s", requests[i], (i == num_requests - 1) ? "" : ", ");
        if ((i + 1) % 15 == 0) fprintf(fp, "\n  ");
    }
    fprintf(fp, "\n\n");

    fprintf(fp, "========================================================================================================================\n");
    fprintf(fp, "                                      COMPREHENSIVE PERFORMANCE COMPARISON MATRIX                                       \n");
    fprintf(fp, "========================================================================================================================\n");
    fprintf(fp, "%-9s %-12s %-10s %-13s %-14s %-14s %-13s %-6s\n",
            "Algo", "Total Seek", "Avg Seek", "Seek Time(ms)", "Svc Time(ms)", "StdDev(Jitter)", "Starvation", "Rank");
    fprintf(fp, "------------------------------------------------------------------------------------------------------------------------\n");

    for (int i = 0; i < count; i++) {
        fprintf(fp, "%-9s %-12d %-10.2f %-13.2f %-14.2f %-14.2f %-13s #%-5d\n",
                results[i].name,
                results[i].total_head_movement,
                results[i].avg_seek_distance,
                results[i].est_seek_time_ms,
                results[i].total_service_time_ms,
                results[i].std_dev_seek,
                results[i].starvation_risk,
                results[i].rank);
    }
    fprintf(fp, "------------------------------------------------------------------------------------------------------------------------\n\n");

    /* Traversal paths for each algorithm */
    fprintf(fp, "DETAILED HEAD TRAVERSAL SEQUENCES:\n");
    for (int i = 0; i < count; i++) {
        fprintf(fp, "\n[%s] (Total Seek: %d cylinders, Rank: #%d):\n  ", 
                results[i].name, results[i].total_head_movement, results[i].rank);
        for (int j = 0; j < results[i].sequence_count; j++) {
            fprintf(fp, "%d%s", results[i].sequence[j], (j == results[i].sequence_count - 1) ? "" : " -> ");
            if ((j + 1) % 12 == 0) fprintf(fp, "\n  ");
        }
        fprintf(fp, "\n");
    }

    fclose(fp);
    return true;
}

/* Export tabular data to CSV */
bool export_csv_to_file(const char *filepath, const ScheduleResult results[], int count) {
    FILE *fp = fopen(filepath, "w");
    if (!fp) return false;

    fprintf(fp, "Algorithm,Total_Head_Movement,Avg_Seek_Distance,Est_Seek_Time_ms,Avg_Rotational_Latency_ms,Est_Transfer_Time_ms,Total_Service_Time_ms,Seek_Variance,Seek_StdDev,Starvation_Risk,Rank\n");

    for (int i = 0; i < count; i++) {
        fprintf(fp, "%s,%d,%.2f,%.3f,%.3f,%.4f,%.3f,%.2f,%.2f,%s,%d\n",
                results[i].name,
                results[i].total_head_movement,
                results[i].avg_seek_distance,
                results[i].est_seek_time_ms,
                results[i].avg_rotational_latency_ms,
                results[i].est_transfer_time_ms,
                results[i].total_service_time_ms,
                results[i].variance_seek,
                results[i].std_dev_seek,
                results[i].starvation_risk,
                results[i].rank);
    }

    fclose(fp);
    return true;
}
