#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>
#include "../include/metrics.h"

void compute_metrics(ScheduleResult *result, const DiskConfig *config) {
    if (result->requests_serviced > 0) {
        result->avg_seek_distance = (double)result->total_head_movement / (double)result->requests_serviced;
    } else {
        result->avg_seek_distance = 0.0;
    }

    /* Estimated Seek Time (ms):
     * Each mechanical seek incurs a base overhead (acceleration + settling) plus per-cylinder traversal time.
     */
    double total_seek_time = 0.0;
    for (int i = 0; i < result->step_count; i++) {
        if (result->steps[i].seek_distance > 0) {
            total_seek_time += config->base_seek_overhead + 
                               (result->steps[i].seek_distance * config->seek_time_per_cylinder);
        }
    }
    result->est_seek_time_ms = total_seek_time;

    /* Rotational Latency (ms):
     * Time for half a revolution at specified RPM.
     * Full revolution = (60 * 1000) / RPM
     */
    double full_rev_ms = (60.0 * 1000.0) / (config->rpm > 0.0 ? config->rpm : 7200.0);
    result->avg_rotational_latency_ms = 0.5 * full_rev_ms;

    /* Transfer Time (ms):
     * Transfer rate in bytes/ms = (MB/s * 1024 * 1024) / 1000
     */
    double bytes_per_ms = (config->transfer_rate_mbps * 1048576.0) / 1000.0;
    double per_sector_transfer_ms = (double)config->sector_size_bytes / (bytes_per_ms > 0 ? bytes_per_ms : 157286.4);
    result->est_transfer_time_ms = result->requests_serviced * per_sector_transfer_ms;

    /* Total Service / Access Time:
     * Total Seek Time + (Requests * (Rotational Latency + Transfer Time))
     */
    result->total_service_time_ms = result->est_seek_time_ms + 
        (result->requests_serviced * (result->avg_rotational_latency_ms + per_sector_transfer_ms));

    /* Variance and Standard Deviation of Seek Distances */
    if (result->step_count > 1) {
        double sum_sq_diff = 0.0;
        double mean_seek = (double)result->total_head_movement / (double)result->step_count;
        for (int i = 0; i < result->step_count; i++) {
            double diff = (double)result->steps[i].seek_distance - mean_seek;
            sum_sq_diff += diff * diff;
        }
        result->variance_seek = sum_sq_diff / result->step_count;
        result->std_dev_seek = sqrt(result->variance_seek);
        result->coefficient_of_variation = (mean_seek > 0.001) ? (result->std_dev_seek / mean_seek) : 0.0;
    } else {
        result->variance_seek = 0.0;
        result->std_dev_seek = 0.0;
        result->coefficient_of_variation = 0.0;
    }

    /* Starvation Risk Assessment */
    if (strcmp(result->name, "SSTF") == 0) {
        strcpy(result->starvation_risk, "High");
    } else if (strcmp(result->name, "FCFS") == 0) {
        strcpy(result->starvation_risk, "None");
    } else if (strcmp(result->name, "SCAN") == 0 || strcmp(result->name, "LOOK") == 0) {
        strcpy(result->starvation_risk, "Moderate");
    } else if (strcmp(result->name, "C-SCAN") == 0 || strcmp(result->name, "C-LOOK") == 0) {
        strcpy(result->starvation_risk, "Low");
    } else if (strcmp(result->name, "F-SCAN") == 0) {
        strcpy(result->starvation_risk, "None");
    } else {
        strcpy(result->starvation_risk, "Moderate");
    }
}

void rank_results_by_performance(ScheduleResult results[], int count) {
    /* Determine rank based on lowest total head movement */
    for (int i = 0; i < count; i++) {
        int r = 1;
        for (int j = 0; j < count; j++) {
            if (results[j].total_head_movement < results[i].total_head_movement) {
                r++;
            }
        }
        results[i].rank = r;
    }
}

const char* assess_fairness_and_starvation(const ScheduleResult *result) {
    if (strcmp(result->name, "FCFS") == 0) {
        return "Guarantees 100% strict fairness (FIFO). Zero starvation risk, but suffers from high seek times and jitter.";
    } else if (strcmp(result->name, "SSTF") == 0) {
        return "Minimizes local seek times significantly, but heavily biases towards clustered requests. Outer cylinders suffer severe starvation under heavy load.";
    } else if (strcmp(result->name, "SCAN") == 0) {
        return "Good throughput and bounded wait times. Requests near boundaries wait longer when head sweeps in the opposite direction.";
    } else if (strcmp(result->name, "C-SCAN") == 0) {
        return "Provides uniform wait times across all tracks by sweeping strictly in one direction and resetting. Ideal for systems needing predictability.";
    } else if (strcmp(result->name, "LOOK") == 0) {
        return "Optimized elevator policy: eliminates wasteful travel to unused boundary cylinders while preserving SCAN throughput.";
    } else if (strcmp(result->name, "C-LOOK") == 0) {
        return "Combines circular uniformity with boundary avoidance. Highly efficient for general operating system I/O subsystems.";
    } else if (strcmp(result->name, "F-SCAN") == 0) {
        return "Advanced OS policy: freezes arriving requests into a secondary batch during current sweep. Fully eliminates starvation.";
    }
    return "Standard disk scheduling policy.";
}
