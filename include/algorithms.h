#ifndef ALGORITHMS_H
#define ALGORITHMS_H

#include "disk_scheduler.h"

/* Disk Scheduling Algorithms */
void schedule_fcfs(const int *requests, int num_requests, const DiskConfig *config, ScheduleResult *result);
void schedule_sstf(const int *requests, int num_requests, const DiskConfig *config, ScheduleResult *result);
void schedule_scan(const int *requests, int num_requests, const DiskConfig *config, ScheduleResult *result);
void schedule_cscan(const int *requests, int num_requests, const DiskConfig *config, ScheduleResult *result);
void schedule_look(const int *requests, int num_requests, const DiskConfig *config, ScheduleResult *result);
void schedule_clook(const int *requests, int num_requests, const DiskConfig *config, ScheduleResult *result);
void schedule_fscan(const int *requests, int num_requests, const DiskConfig *config, ScheduleResult *result);

/* Run all algorithms on the given workload and populate results */
void run_all_algorithms(const int *requests, int num_requests, const DiskConfig *config, 
                        ScheduleResult results[], int *count);

#endif /* ALGORITHMS_H */
