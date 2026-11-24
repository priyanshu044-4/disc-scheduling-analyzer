#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>
#include "../include/visualizer.h"
#include "../include/metrics.h"
#include "../include/colors.h"

#define BAR_WIDTH 40

/* Display step-by-step head movement with ASCII track position indicator */
void visualize_step_by_step(const ScheduleResult *result, const DiskConfig *config) {
    printf("\n%s%s========================================================================================%s\n", 
           ANSI_BOLD, ANSI_DRACULA_PURPLE, ANSI_RESET);
    printf("%s   TRAVERSAL TRACE: %s%s%s (Initial Head: %d, Cylinders: 0-%d)\n", 
           ANSI_BOLD, ANSI_DRACULA_PINK, result->name, ANSI_RESET, config->initial_head, config->total_cylinders - 1);
    printf("%s========================================================================================%s\n", 
           ANSI_DRACULA_PURPLE, ANSI_RESET);

    printf("%s%-6s %-8s %-8s %-10s %-14s %-45s%s\n", 
           ANSI_BOLD, "Step", "From", "To", "Seek", "Action", "Disk Platter Map [0 ... Max-1]", ANSI_RESET);
    printf("----------------------------------------------------------------------------------------\n");

    for (int i = 0; i < result->step_count; i++) {
        ScheduleStep step = result->steps[i];
        char track_map[BAR_WIDTH + 3];
        memset(track_map, ' ', BAR_WIDTH);
        track_map[BAR_WIDTH] = '\0';

        /* Scale cylinder to bar width */
        int pos = (int)((double)step.to_cylinder / (config->total_cylinders - 1) * (BAR_WIDTH - 1));
        if (pos < 0) pos = 0;
        if (pos >= BAR_WIDTH) pos = BAR_WIDTH - 1;

        int from_pos = (int)((double)step.from_cylinder / (config->total_cylinders - 1) * (BAR_WIDTH - 1));
        if (from_pos < 0) from_pos = 0;
        if (from_pos >= BAR_WIDTH) from_pos = BAR_WIDTH - 1;

        /* Draw motion trail */
        int start = (from_pos < pos) ? from_pos : pos;
        int end = (from_pos < pos) ? pos : from_pos;
        for (int p = start; p <= end; p++) {
            track_map[p] = '-';
        }
        track_map[pos] = (step.to_cylinder > step.from_cylinder) ? '>' : '<';
        if (step.is_service) {
            track_map[pos] = '*'; /* Star denotes serviced request */
        }

        const char *action_str = step.is_service ? "Service Req" : "Boundary Swing";
        const char *color_code = step.is_service ? ANSI_DRACULA_GREEN : ANSI_DRACULA_PINK;

        printf("%s[%3d]%s  %-8d %-8d %-10d %s%-14s%s [%s]\n",
               ANSI_DRACULA_CYAN, i + 1, ANSI_RESET,
               step.from_cylinder, step.to_cylinder, step.seek_distance,
               color_code, action_str, ANSI_RESET, track_map);
    }
    printf("----------------------------------------------------------------------------------------\n");
    printf("%sTotal Head Movement:%s %s%d cylinders%s | %sAvg Seek:%s %.2f cylinders\n",
           ANSI_BOLD, ANSI_RESET, ANSI_DRACULA_PURPLE, result->total_head_movement, ANSI_RESET,
           ANSI_BOLD, ANSI_RESET, result->avg_seek_distance);
}

/* Render an ASCII 2D timeline graph of cylinder position vs. step */
void visualize_timeline_graph(const ScheduleResult *result, const DiskConfig *config) {
    printf("\n%s%s========================================================================================%s\n", 
           ANSI_BOLD, ANSI_DRACULA_PURPLE, ANSI_RESET);
    printf("%s   CYLINDER TRAJECTORY TIMELINE: %s%s%s\n", ANSI_BOLD, ANSI_DRACULA_PINK, result->name, ANSI_RESET);
    printf("%s========================================================================================%s\n", 
           ANSI_DRACULA_PURPLE, ANSI_RESET);

    int graph_width = 50;
    printf("  Step | Cyl  | 0%*d\n", graph_width - 1, config->total_cylinders - 1);
    printf("  -----+------+-%s", "+");
    for (int i = 0; i < graph_width; i++) printf("-");
    printf("+\n");

    for (int i = 0; i < result->sequence_count; i++) {
        int cyl = result->sequence[i];
        int pos = (int)((double)cyl / (config->total_cylinders - 1) * (graph_width - 1));
        if (pos < 0) pos = 0;
        if (pos >= graph_width) pos = graph_width - 1;

        char line[graph_width + 1];
        memset(line, ' ', graph_width);
        line[graph_width] = '\0';
        line[pos] = (i == 0) ? 'H' : 'o'; /* H for initial head, o for steps */

        printf("  %4d | %4d | |%s|\n", i, cyl, line);
    }
    printf("  -----+------+-%s", "+");
    for (int i = 0; i < graph_width; i++) printf("-");
    printf("+\n");
    printf("  Legend: %sH%s = Starting Head, %so%s = Cylinder Visited\n", 
           ANSI_DRACULA_CYAN, ANSI_RESET, ANSI_DRACULA_GREEN, ANSI_RESET);
}

/* Render comparative ASCII bar chart of total head movement across all algorithms */
void visualize_comparison_bar_chart(const ScheduleResult results[], int count) {
    if (count <= 0) return;

    printf("\n%s%s========================================================================================%s\n", 
           ANSI_BOLD, ANSI_DRACULA_PURPLE, ANSI_RESET);
    printf("%s   ALGORITHM EFFICIENCY COMPARISON (TOTAL SEEK DISTANCE)%s\n", ANSI_BOLD, ANSI_RESET);
    printf("%s========================================================================================%s\n", 
           ANSI_DRACULA_PURPLE, ANSI_RESET);

    int max_seek = 0;
    for (int i = 0; i < count; i++) {
        if (results[i].total_head_movement > max_seek) {
            max_seek = results[i].total_head_movement;
        }
    }
    if (max_seek == 0) max_seek = 1;

    int bar_max_len = 40;

    for (int i = 0; i < count; i++) {
        int len = (int)((double)results[i].total_head_movement / max_seek * bar_max_len);
        if (len < 1 && results[i].total_head_movement > 0) len = 1;

        char bar[bar_max_len + 1];
        for (int b = 0; b < len; b++) bar[b] = '=';
        bar[len] = '\0';

        double pct = ((double)results[i].total_head_movement / max_seek) * 100.0;

        const char *badge = "";
        const char *color = ANSI_DRACULA_SLATE;
        if (results[i].rank == 1) {
            badge = " [OPT/BEST]";
            color = ANSI_DRACULA_GREEN;
        } else if (results[i].rank == 2) {
            badge = " [2nd]";
            color = ANSI_DRACULA_CYAN;
        }

        printf("  %-8s | %5d cyl | %s[%-*s]%s %5.1f%%%s\n",
               results[i].name,
               results[i].total_head_movement,
               color, bar_max_len, bar, ANSI_RESET,
               pct, badge);
    }
    printf("----------------------------------------------------------------------------------------\n");
}

/* Render comprehensive comparison table with all metrics */
void visualize_comparison_table(const ScheduleResult results[], int count, const DiskConfig *config) {
    (void)config;
    if (count <= 0) return;

    printf("\n%s%s========================================================================================================================%s\n", 
           ANSI_BOLD, ANSI_DRACULA_PURPLE, ANSI_RESET);
    printf("%s                                      COMPREHENSIVE PERFORMANCE ANALYSIS MATRIX                                        %s\n", 
           ANSI_BOLD, ANSI_RESET);
    printf("%s========================================================================================================================%s\n", 
           ANSI_DRACULA_PURPLE, ANSI_RESET);

    printf("%s%-9s %-12s %-10s %-13s %-14s %-11s %-13s %-6s%s\n",
           ANSI_BOLD, "Algo", "Total Seek", "Avg Seek", "Seek Time(ms)", "Svc Time(ms)", "StdDev(Jitter)", "Starvation", "Rank", ANSI_RESET);
    printf("------------------------------------------------------------------------------------------------------------------------\n");

    int best_idx = 0;
    for (int i = 0; i < count; i++) {
        if (results[i].rank == 1) {
            best_idx = i;
        }
        const char *rank_color = ANSI_DRACULA_SLATE;
        if (results[i].rank == 1) rank_color = ANSI_DRACULA_GREEN;
        else if (results[i].rank == 2) rank_color = ANSI_DRACULA_CYAN;

        const char *starv_color = ANSI_DRACULA_ALABASTER;
        if (strcmp(results[i].starvation_risk, "High") == 0) starv_color = ANSI_DRACULA_PINK;
        else if (strcmp(results[i].starvation_risk, "Moderate") == 0) starv_color = ANSI_DRACULA_YELLOW;
        else starv_color = ANSI_DRACULA_GREEN;

        printf("%s%-9s%s %-12d %-10.2f %-13.2f %-14.2f %-14.2f %s%-13s%s %s#%-5d%s\n",
               rank_color, results[i].name, ANSI_RESET,
               results[i].total_head_movement,
               results[i].avg_seek_distance,
               results[i].est_seek_time_ms,
               results[i].total_service_time_ms,
               results[i].std_dev_seek,
               starv_color, results[i].starvation_risk, ANSI_RESET,
               rank_color, results[i].rank, ANSI_RESET);
    }
    printf("------------------------------------------------------------------------------------------------------------------------\n");
    printf("%s* Mechanical Model Grounding:%s Seek Overhead = %.1f ms | Track Traversal = %.2f ms/cyl | Rotational Latency = %.2f ms (%.0f RPM)\n",
           ANSI_DIM, ANSI_RESET, config->base_seek_overhead, config->seek_time_per_cylinder, 
           results[0].avg_rotational_latency_ms, config->rpm);
    printf("%sRecommendation:%s Algorithm %s%s%s achieves optimal seek efficiency with %s%d cylinders%s moved.\n",
           ANSI_BOLD, ANSI_RESET, ANSI_DRACULA_GREEN, results[best_idx].name, ANSI_RESET,
           ANSI_DRACULA_PURPLE, results[best_idx].total_head_movement, ANSI_RESET);
}

/* Print a detailed summary report for a single algorithm */
void visualize_single_summary(const ScheduleResult *result, const DiskConfig *config) {
    (void)config;
    printf("\n%s--- Detailed Analytics for %s ---%s\n", ANSI_BOLD, result->name, ANSI_RESET);
    printf("  Total Head Movement       : %d cylinders\n", result->total_head_movement);
    printf("  Requests Serviced         : %d\n", result->requests_serviced);
    printf("  Average Seek Distance     : %.2f cylinders/request\n", result->avg_seek_distance);
    printf("  Estimated Seek Time       : %.3f ms\n", result->est_seek_time_ms);
    printf("  Avg Rotational Latency    : %.3f ms\n", result->avg_rotational_latency_ms);
    printf("  Estimated Transfer Time   : %.4f ms\n", result->est_transfer_time_ms);
    printf("  Total Service Time        : %.3f ms\n", result->total_service_time_ms);
    printf("  Seek Distance Variance    : %.2f\n", result->variance_seek);
    printf("  Seek Distance Std Dev (σ) : %.2f\n", result->std_dev_seek);
    printf("  Coefficient of Variation  : %.3f\n", result->coefficient_of_variation);
    printf("  Starvation Risk Level     : %s\n", result->starvation_risk);
    printf("  Operating System Note     : %s\n", assess_fairness_and_starvation(result));
}
