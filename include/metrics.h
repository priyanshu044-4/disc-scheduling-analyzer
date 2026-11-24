#ifndef METRICS_H
#define METRICS_H

#include "disk_scheduler.h"

/* Compute statistical and mechanical metrics for a scheduling result */
void compute_metrics(ScheduleResult *result, const DiskConfig *config);

/* Rank algorithm results from 1 (best / lowest total movement) to N */
void rank_results_by_performance(ScheduleResult results[], int count);

/* Returns an evaluation string explaining fairness and starvation behavior */
const char* assess_fairness_and_starvation(const ScheduleResult *result);

#endif /* METRICS_H */
