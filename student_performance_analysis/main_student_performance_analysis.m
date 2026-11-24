%% =========================================================================
% MASTER SCRIPT: main_student_performance_analysis.m
% MINI PROJECT 1: STUDENT PERFORMANCE ANALYSIS USING MATLAB
%
% OBJECTIVE:
%   Analyze student marks and attendance using statistical techniques
%   and predict academic performance through regression.
%
% MATLAB CONCEPTS COVERED:
%   - Matrices and Matrix Manipulation (Unit 1)
%   - Statistical Calculations & Dispersion (Unit 3)
%   - 2D Plots, Scatter Plots, Histograms, Boxplots (Unit 3)
%   - Pearson Correlation Analysis (Unit 4)
%   - Ordinary Least Squares (OLS) Linear Regression (Unit 4)
%   - Hypothesis Testing via Two-Sample Independent Student's t-Test (Unit 4)
%
% SYLLABUS MAPPING:
%   - Unit 1: Matrices, Vectors, Indexing, Slicing, Matrix Arithmetic
%   - Unit 3: Descriptive Statistics (Mean, Median, Mode, Range, Variance, SD), Plotting
%   - Unit 4: Correlation, Regression Modeling, Hypothesis Testing (t-Test)
%
% IMPLEMENTATION WORKFLOW:
%   Step 1: Create a matrix containing student marks in different subjects.
%   Step 2: Calculate mean, median, mode, range, variance, and standard deviation.
%   Step 3: Calculate correlation between attendance and examination marks.
%   Step 4: Use linear regression to predict marks for benchmark attendance values.
%   Step 5: Apply a two-sample t-test to compare performance of two student groups.
%   Step 6: Generate graphical plots and an executive academic performance report.
% =========================================================================

clc;
clear;
close all;

% Set up paths
current_dir = fileparts(mfilename('fullpath'));
if isempty(current_dir)
    current_dir = pwd;
end
addpath(fullfile(current_dir, 'modules'));

fprintf('========================================================================================\n');
fprintf('            MINI PROJECT 1: STUDENT PERFORMANCE ANALYSIS USING MATLAB                   \n');
fprintf('========================================================================================\n\n');

%% =========================================================================
% STEP 1: CREATE A MATRIX CONTAINING STUDENT MARKS IN DIFFERENT SUBJECTS
% =========================================================================
csv_data_path = fullfile(current_dir, 'student_data.csv');
student_data = create_student_matrix(csv_data_path);

%% =========================================================================
% STEP 2: CALCULATE MEAN, MEDIAN, MODE, RANGE, VARIANCE, AND STANDARD DEVIATION
% =========================================================================
stats_res = calculate_statistics(student_data);

%% =========================================================================
% STEP 3: CALCULATE CORRELATION BETWEEN ATTENDANCE AND EXAMINATION MARKS
% =========================================================================
corr_res = calculate_correlation(student_data);

%% =========================================================================
% STEP 4: USE LINEAR REGRESSION TO PREDICT MARKS
% =========================================================================
benchmark_attendance = [60; 75; 85; 95];
reg_res = predict_marks_regression(student_data, benchmark_attendance);

%% =========================================================================
% STEP 5: APPLY A T-TEST TO COMPARE THE PERFORMANCE OF TWO STUDENT GROUPS
% =========================================================================
alpha_level = 0.05; % 95% Confidence Level
ttest_res = compare_groups_ttest(student_data, alpha_level);

%% =========================================================================
% STEP 6: GENERATE GRAPHS AND A PERFORMANCE REPORT
% =========================================================================
figures_dir = fullfile(current_dir, 'figures');
fig_handles = generate_plots(student_data, stats_res, corr_res, reg_res, ttest_res, figures_dir);

report_path = fullfile(current_dir, 'student_performance_report.txt');
report_text = generate_report(student_data, stats_res, corr_res, reg_res, ttest_res, report_path);

fprintf('========================================================================================\n');
fprintf('  MINI PROJECT 1 EXECUTION COMPLETE! All 6 steps executed successfully.                \n');
fprintf('  - Figures saved in : %s\n', figures_dir);
fprintf('  - Report saved in  : %s\n', report_path);
fprintf('========================================================================================\n');
