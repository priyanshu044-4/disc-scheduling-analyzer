#ifndef DISK_SCHEDULER_H
#define DISK_SCHEDULER_H

#include <stdbool.h>
#include <stddef.h>

#define MAX_REQUESTS        2048
#define MAX_ALGORITHMS      7
#define DEFAULT_CYLINDERS   200
#define DEFAULT_INITIAL_HEAD 53
#define DEFAULT_RPM         7200.0
#define DEFAULT_SEEK_PER_CYL 0.05   /* ms per cylinder seek */
#define DEFAULT_BASE_OVERHEAD 1.0   /* ms mechanical acceleration/settling */
#define DEFAULT_TRANSFER_MBPS 150.0 /* MB/s */
#define DEFAULT_SECTOR_BYTES  512

#define DIR_DOWN 0  /* Towards lower cylinders (e.g., towards 0) */
#define DIR_UP   1  /* Towards higher cylinders (e.g., towards max-1) */

/* Configuration of physical disk and workload */
typedef struct {
    int total_cylinders;          /* Total cylinder count (0 to total_cylinders - 1) */
    int initial_head;             /* Current starting head position */
    int direction;                /* Initial moving direction: DIR_UP or DIR_DOWN */
    double rpm;                   /* Rotational speed in RPM */
    double seek_time_per_cylinder;/* Milliseconds per track seek */
    double base_seek_overhead;    /* Fixed mechanical overhead (ms) */
    double transfer_rate_mbps;    /* Data transfer rate in MB/s */
    int sector_size_bytes;        /* Sector size in bytes */
} DiskConfig;

/* Step in head travel sequence */
typedef struct {
    int from_cylinder;
    int to_cylinder;
    int seek_distance;
    bool is_service;              /* True if servicing an I/O request, false if boundary swing */
    int request_id;               /* Original request queue index, or -1 if dummy boundary */
} ScheduleStep;

/* Detailed performance and analytical results of an algorithm run */
typedef struct {
    char name[32];
    int sequence[MAX_REQUESTS * 2 + 10];
    int sequence_count;
    ScheduleStep steps[MAX_REQUESTS * 2 + 10];
    int step_count;
    int total_head_movement;
    int requests_serviced;
    double avg_seek_distance;
    double est_seek_time_ms;
    double avg_rotational_latency_ms;
    double est_transfer_time_ms;
    double total_service_time_ms;
    double variance_seek;
    double std_dev_seek;
    double coefficient_of_variation;
    char starvation_risk[16];     /* "Low", "Moderate", "High" */
    int rank;
} ScheduleResult;

/* Function to set standard defaults */
void init_default_config(DiskConfig *config);

#endif /* DISK_SCHEDULER_H */
