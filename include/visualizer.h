#ifndef VISUALIZER_H
#define VISUALIZER_H

#include "disk_scheduler.h"

/* Display step-by-step head movement with ASCII track location indicator */
void visualize_step_by_step(const ScheduleResult *result, const DiskConfig *config);

/* Render an ASCII 2D timeline graph of cylinder position vs. step */
void visualize_timeline_graph(const ScheduleResult *result, const DiskConfig *config);

/* Render comparative ASCII bar chart of total head movement across all algorithms */
void visualize_comparison_bar_chart(const ScheduleResult results[], int count);

/* Render comprehensive comparison table with all metrics */
void visualize_comparison_table(const ScheduleResult results[], int count, const DiskConfig *config);

/* Print a detailed summary report for a single algorithm */
void visualize_single_summary(const ScheduleResult *result, const DiskConfig *config);

#endif /* VISUALIZER_H */
