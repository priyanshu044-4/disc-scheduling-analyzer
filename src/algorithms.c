#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>
#include "../include/algorithms.h"
#include "../include/metrics.h"
#include "../include/utils.h"

/* Helper to initialize result structure */
static void init_result(ScheduleResult *res, const char *name, int initial_head) {
    memset(res, 0, sizeof(ScheduleResult));
    strncpy(res->name, name, sizeof(res->name) - 1);
    res->sequence[0] = initial_head;
    res->sequence_count = 1;
    res->step_count = 0;
    res->total_head_movement = 0;
    res->requests_serviced = 0;
}

/* Helper to record a head movement step */
static void record_step(ScheduleResult *res, int from_cyl, int to_cyl, bool is_service, int req_id) {
    int dist = abs(to_cyl - from_cyl);
    if (dist == 0 && !is_service) {
        return; /* Avoid redundant zero-distance boundary steps */
    }
    ScheduleStep *step = &res->steps[res->step_count++];
    step->from_cylinder = from_cyl;
    step->to_cylinder = to_cyl;
    step->seek_distance = dist;
    step->is_service = is_service;
    step->request_id = req_id;

    res->sequence[res->sequence_count++] = to_cyl;
    res->total_head_movement += dist;
    if (is_service) {
        res->requests_serviced++;
    }
}

/* 1. FCFS: First Come, First Served */
void schedule_fcfs(const int *requests, int num_requests, const DiskConfig *config, ScheduleResult *result) {
    init_result(result, "FCFS", config->initial_head);
    int current = config->initial_head;

    for (int i = 0; i < num_requests; i++) {
        record_step(result, current, requests[i], true, i);
        current = requests[i];
    }
    compute_metrics(result, config);
}

/* 2. SSTF: Shortest Seek Time First */
void schedule_sstf(const int *requests, int num_requests, const DiskConfig *config, ScheduleResult *result) {
    init_result(result, "SSTF", config->initial_head);
    bool *serviced = (bool *)calloc(num_requests, sizeof(bool));
    if (!serviced) return;

    int current = config->initial_head;
    int serviced_count = 0;

    while (serviced_count < num_requests) {
        int best_idx = -1;
        int min_seek = 1000000000;

        for (int i = 0; i < num_requests; i++) {
            if (!serviced[i]) {
                int dist = abs(current - requests[i]);
                if (dist < min_seek) {
                    min_seek = dist;
                    best_idx = i;
                } else if (dist == min_seek && best_idx != -1) {
                    /* Tie-breaker: prefer same direction of travel */
                    int curr_dir = (config->direction == DIR_UP) ? 1 : -1;
                    if ((requests[i] - current) * curr_dir > 0) {
                        best_idx = i;
                    }
                }
            }
        }

        if (best_idx != -1) {
            serviced[best_idx] = true;
            serviced_count++;
            record_step(result, current, requests[best_idx], true, best_idx);
            current = requests[best_idx];
        } else {
            break;
        }
    }

    free(serviced);
    compute_metrics(result, config);
}

/* 3. SCAN: Elevator Algorithm (visits boundary before reversing) */
void schedule_scan(const int *requests, int num_requests, const DiskConfig *config, ScheduleResult *result) {
    init_result(result, "SCAN", config->initial_head);

    int *left = (int *)malloc(num_requests * sizeof(int));
    int *right = (int *)malloc(num_requests * sizeof(int));
    int left_count = 0, right_count = 0;

    for (int i = 0; i < num_requests; i++) {
        if (requests[i] < config->initial_head) {
            left[left_count++] = requests[i];
        } else {
            right[right_count++] = requests[i];
        }
    }

    sort_array_ascending(left, left_count);
    sort_array_ascending(right, right_count);

    int current = config->initial_head;

    if (config->direction == DIR_UP) {
        /* Sweep towards higher cylinders */
        for (int i = 0; i < right_count; i++) {
            record_step(result, current, right[i], true, i);
            current = right[i];
        }
        /* If there are requests remaining on the left, proceed to upper boundary and reverse */
        if (left_count > 0) {
            int upper_boundary = config->total_cylinders - 1;
            if (current != upper_boundary) {
                record_step(result, current, upper_boundary, false, -1);
                current = upper_boundary;
            }
            /* Sweep back descending */
            for (int i = left_count - 1; i >= 0; i--) {
                record_step(result, current, left[i], true, i);
                current = left[i];
            }
        }
    } else {
        /* Sweep towards lower cylinders (towards 0) */
        for (int i = left_count - 1; i >= 0; i--) {
            record_step(result, current, left[i], true, i);
            current = left[i];
        }
        /* If requests remain on the right, proceed to lower boundary (0) and reverse */
        if (right_count > 0) {
            if (current != 0) {
                record_step(result, current, 0, false, -1);
                current = 0;
            }
            /* Sweep back ascending */
            for (int i = 0; i < right_count; i++) {
                record_step(result, current, right[i], true, i);
                current = right[i];
            }
        }
    }

    free(left);
    free(right);
    compute_metrics(result, config);
}

/* 4. C-SCAN: Circular SCAN (sweeps to boundary, wraps around to opposite boundary) */
void schedule_cscan(const int *requests, int num_requests, const DiskConfig *config, ScheduleResult *result) {
    init_result(result, "C-SCAN", config->initial_head);

    int *left = (int *)malloc(num_requests * sizeof(int));
    int *right = (int *)malloc(num_requests * sizeof(int));
    int left_count = 0, right_count = 0;

    for (int i = 0; i < num_requests; i++) {
        if (requests[i] < config->initial_head) {
            left[left_count++] = requests[i];
        } else {
            right[right_count++] = requests[i];
        }
    }

    sort_array_ascending(left, left_count);
    sort_array_ascending(right, right_count);

    int current = config->initial_head;

    if (config->direction == DIR_UP) {
        /* Move up serving right requests */
        for (int i = 0; i < right_count; i++) {
            record_step(result, current, right[i], true, i);
            current = right[i];
        }
        if (left_count > 0) {
            int upper_boundary = config->total_cylinders - 1;
            if (current != upper_boundary) {
                record_step(result, current, upper_boundary, false, -1);
                current = upper_boundary;
            }
            /* Wrap around to cylinder 0 */
            record_step(result, current, 0, false, -1);
            current = 0;

            /* Continue upward serving left requests */
            for (int i = 0; i < left_count; i++) {
                record_step(result, current, left[i], true, i);
                current = left[i];
            }
        }
    } else {
        /* Move down serving left requests */
        for (int i = left_count - 1; i >= 0; i--) {
            record_step(result, current, left[i], true, i);
            current = left[i];
        }
        if (right_count > 0) {
            if (current != 0) {
                record_step(result, current, 0, false, -1);
                current = 0;
            }
            /* Wrap around to cylinder max-1 */
            int upper_boundary = config->total_cylinders - 1;
            record_step(result, current, upper_boundary, false, -1);
            current = upper_boundary;

            /* Continue downward serving right requests */
            for (int i = right_count - 1; i >= 0; i--) {
                record_step(result, current, right[i], true, i);
                current = right[i];
            }
        }
    }

    free(left);
    free(right);
    compute_metrics(result, config);
}

/* 5. LOOK: Like SCAN, but reverses immediately at the last request in current direction */
void schedule_look(const int *requests, int num_requests, const DiskConfig *config, ScheduleResult *result) {
    init_result(result, "LOOK", config->initial_head);

    int *left = (int *)malloc(num_requests * sizeof(int));
    int *right = (int *)malloc(num_requests * sizeof(int));
    int left_count = 0, right_count = 0;

    for (int i = 0; i < num_requests; i++) {
        if (requests[i] < config->initial_head) {
            left[left_count++] = requests[i];
        } else {
            right[right_count++] = requests[i];
        }
    }

    sort_array_ascending(left, left_count);
    sort_array_ascending(right, right_count);

    int current = config->initial_head;

    if (config->direction == DIR_UP) {
        /* Service right requests up to the max requested */
        for (int i = 0; i < right_count; i++) {
            record_step(result, current, right[i], true, i);
            current = right[i];
        }
        /* Immediately reverse and service left requests down to min requested */
        for (int i = left_count - 1; i >= 0; i--) {
            record_step(result, current, left[i], true, i);
            current = left[i];
        }
    } else {
        /* Service left requests down to min requested */
        for (int i = left_count - 1; i >= 0; i--) {
            record_step(result, current, left[i], true, i);
            current = left[i];
        }
        /* Immediately reverse and service right requests up to max requested */
        for (int i = 0; i < right_count; i++) {
            record_step(result, current, right[i], true, i);
            current = right[i];
        }
    }

    free(left);
    free(right);
    compute_metrics(result, config);
}

/* 6. C-LOOK: Like C-SCAN, but only travels to highest/lowest requested cylinders */
void schedule_clook(const int *requests, int num_requests, const DiskConfig *config, ScheduleResult *result) {
    init_result(result, "C-LOOK", config->initial_head);

    int *left = (int *)malloc(num_requests * sizeof(int));
    int *right = (int *)malloc(num_requests * sizeof(int));
    int left_count = 0, right_count = 0;

    for (int i = 0; i < num_requests; i++) {
        if (requests[i] < config->initial_head) {
            left[left_count++] = requests[i];
        } else {
            right[right_count++] = requests[i];
        }
    }

    sort_array_ascending(left, left_count);
    sort_array_ascending(right, right_count);

    int current = config->initial_head;

    if (config->direction == DIR_UP) {
        /* Service right requests ascending */
        for (int i = 0; i < right_count; i++) {
            record_step(result, current, right[i], true, i);
            current = right[i];
        }
        /* Jump to the lowest requested cylinder on left */
        if (left_count > 0) {
            for (int i = 0; i < left_count; i++) {
                record_step(result, current, left[i], true, i);
                current = left[i];
            }
        }
    } else {
        /* Service left requests descending */
        for (int i = left_count - 1; i >= 0; i--) {
            record_step(result, current, left[i], true, i);
            current = left[i];
        }
        /* Jump to highest requested cylinder on right */
        if (right_count > 0) {
            for (int i = right_count - 1; i >= 0; i--) {
                record_step(result, current, right[i], true, i);
                current = right[i];
            }
        }
    }

    free(left);
    free(right);
    compute_metrics(result, config);
}

/* 7. F-SCAN: Freeze SCAN (splits queue into two subqueues to prevent starvation) */
void schedule_fscan(const int *requests, int num_requests, const DiskConfig *config, ScheduleResult *result) {
    init_result(result, "F-SCAN", config->initial_head);

    if (num_requests == 0) {
        compute_metrics(result, config);
        return;
    }

    /* Split requests into two batches: Active Batch and Frozen Batch */
    int mid = (num_requests + 1) / 2;
    int current = config->initial_head;
    DiskConfig active_cfg = *config;

    /* Batch 1: Run LOOK on the active segment */
    ScheduleResult batch1;
    active_cfg.initial_head = current;
    schedule_look(requests, mid, &active_cfg, &batch1);

    /* Copy steps from batch 1 (excluding initial head in sequence) */
    for (int i = 0; i < batch1.step_count; i++) {
        ScheduleStep s = batch1.steps[i];
        record_step(result, s.from_cylinder, s.to_cylinder, s.is_service, s.request_id);
    }
    if (batch1.step_count > 0) {
        current = batch1.steps[batch1.step_count - 1].to_cylinder;
    }

    /* Batch 2: Run LOOK on the frozen segment if exists */
    if (num_requests > mid) {
        ScheduleResult batch2;
        active_cfg.initial_head = current;
        schedule_look(requests + mid, num_requests - mid, &active_cfg, &batch2);

        for (int i = 0; i < batch2.step_count; i++) {
            ScheduleStep s = batch2.steps[i];
            record_step(result, s.from_cylinder, s.to_cylinder, s.is_service, s.request_id + mid);
        }
    }

    compute_metrics(result, config);
}

/* Run all algorithms and compute comparative rankings */
void run_all_algorithms(const int *requests, int num_requests, const DiskConfig *config, 
                        ScheduleResult results[], int *count) {
    *count = 0;

    schedule_fcfs(requests, num_requests, config, &results[(*count)++]);
    schedule_sstf(requests, num_requests, config, &results[(*count)++]);
    schedule_scan(requests, num_requests, config, &results[(*count)++]);
    schedule_cscan(requests, num_requests, config, &results[(*count)++]);
    schedule_look(requests, num_requests, config, &results[(*count)++]);
    schedule_clook(requests, num_requests, config, &results[(*count)++]);
    schedule_fscan(requests, num_requests, config, &results[(*count)++]);

    rank_results_by_performance(results, *count);
}
