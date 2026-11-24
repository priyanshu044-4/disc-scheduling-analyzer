#ifndef UTILS_H
#define UTILS_H

#include "disk_scheduler.h"

/* Workload generation */
void generate_random_uniform(int *requests, int count, int max_cylinders);
void generate_clustered_workload(int *requests, int count, int max_cylinders);
void generate_oscillating_workload(int *requests, int count, int max_cylinders);
void generate_sequential_workload(int *requests, int count, int max_cylinders, int start_cyl);

/* Preset configurations */
int load_preset_textbook(int *requests, DiskConfig *config);
int load_preset_clustered(int *requests, DiskConfig *config);
int load_preset_oscillating(int *requests, DiskConfig *config);
int load_preset_sequential(int *requests, DiskConfig *config);

/* File I/O */
bool load_workload_from_file(const char *filepath, int *requests, int *num_requests, DiskConfig *config);
bool export_report_to_file(const char *filepath, const ScheduleResult results[], int count, 
                           const DiskConfig *config, const int *requests, int num_requests);
bool export_csv_to_file(const char *filepath, const ScheduleResult results[], int count);

/* Validation */
bool is_valid_cylinder(int cylinder, int max_cylinders);
bool validate_request_array(const int *requests, int count, int max_cylinders);

/* String trimming helper */
char *trim_whitespace(char *str);

/* Helper to sort an array with standard qsort */
void sort_array_ascending(int *arr, int n);

#endif /* UTILS_H */
