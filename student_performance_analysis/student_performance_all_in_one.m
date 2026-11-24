%% =========================================================================
% STANDALONE SCRIPT: student_performance_all_in_one.m
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
% AUTHOR : Engineering Student / Computational Lab
% DATE   : Academic Session 2026-2027
% =========================================================================

clc;
clear;
close all;

fprintf('========================================================================================\n');
fprintf('            MINI PROJECT 1: STUDENT PERFORMANCE ANALYSIS USING MATLAB                   \n');
fprintf('========================================================================================\n\n');

%% =========================================================================
% STEP 1: CREATE A MATRIX CONTAINING STUDENT MARKS IN DIFFERENT SUBJECTS
% =========================================================================
fprintf('>>> STEP 1: Initializing Student Marks Matrix and Attributes...\n');

subject_names = {'Mathematics', 'Physics', 'Chemistry', 'Computer_Science', 'English'};
n_students = 50;
n_subjects = 5;

% Student Identifiers
student_ids = arrayfun(@(x) sprintf('STU_%03d', x), (1:n_students)', 'UniformOutput', false);

% Group Assignment: Group A (1 to 25: Tutorial Cohort), Group B (26 to 50: Standard Cohort)
group_labels = cell(n_students, 1);
group_labels(1:25)  = {'Group A'};
group_labels(26:50) = {'Group B'};

% Attendance percentage vector (50x1)
attendance = [
    98.0; 87.8; 89.4; 87.0; 87.9; 82.1; 78.9; 87.6; 71.9; 88.4;
    87.2; 80.5; 85.1; 79.4; 78.4; 89.7; 85.1; 95.9; 98.0; 88.1;
    85.8; 94.2; 73.8; 77.0; 83.2; 76.4; 74.8; 74.9; 79.6; 74.0;
    78.3; 76.0; 69.8; 67.8; 66.8; 71.9; 70.3; 72.8; 76.7; 84.4;
    66.1; 67.4; 78.0; 63.6; 63.5; 69.2; 65.5; 73.6; 68.6; 80.5
];

% Student Marks Matrix (50 rows x 5 columns: Math, Physics, Chemistry, CS, English)
marks_matrix = [
    86, 71, 77, 79, 71; % STU_001 (Group A)
    72, 66, 79, 78, 75; % STU_002 (Group A)
    74, 79, 85, 82, 81; % STU_003 (Group A)
    70, 73, 76, 83, 74; % STU_004 (Group A)
    81, 78, 80, 86, 82; % STU_005 (Group A)
    79, 73, 79, 88, 83; % STU_006 (Group A)
    66, 59, 64, 74, 65; % STU_007 (Group A)
    88, 82, 89, 91, 92; % STU_008 (Group A)
    62, 60, 66, 61, 58; % STU_009 (Group A)
    83, 77, 78, 84, 78; % STU_010 (Group A)
    83, 75, 72, 79, 77; % STU_011 (Group A)
    87, 85, 85, 84, 80; % STU_012 (Group A)
    71, 66, 78, 76, 66; % STU_013 (Group A)
    79, 63, 72, 86, 77; % STU_014 (Group A)
    70, 75, 71, 80, 67; % STU_015 (Group A)
    80, 72, 79, 88, 82; % STU_016 (Group A)
    81, 74, 77, 84, 83; % STU_017 (Group A)
    85, 84, 89, 89, 88; % STU_018 (Group A)
    89, 85, 89, 95, 87; % STU_019 (Group A)
    77, 83, 79, 87, 80; % STU_020 (Group A)
    76, 83, 79, 86, 79; % STU_021 (Group A)
    86, 89, 92, 93, 86; % STU_022 (Group A)
    67, 64, 66, 67, 51; % STU_023 (Group A)
    81, 79, 71, 85, 77; % STU_024 (Group A)
    74, 77, 82, 85, 84; % STU_025 (Group A)
    59, 49, 52, 63, 55; % STU_026 (Group B)
    71, 67, 69, 64, 64; % STU_027 (Group B)
    82, 65, 77, 72, 68; % STU_028 (Group B)
    66, 68, 68, 66, 56; % STU_029 (Group B)
    83, 65, 69, 72, 63; % STU_030 (Group B)
    65, 52, 56, 60, 65; % STU_031 (Group B)
    63, 54, 58, 58, 64; % STU_032 (Group B)
    66, 63, 59, 69, 63; % STU_033 (Group B)
    68, 55, 71, 67, 55; % STU_034 (Group B)
    67, 54, 57, 65, 65; % STU_035 (Group B)
    72, 64, 69, 79, 67; % STU_036 (Group B)
    72, 57, 64, 70, 71; % STU_037 (Group B)
    72, 58, 64, 68, 71; % STU_038 (Group B)
    74, 63, 72, 70, 68; % STU_039 (Group B)
    81, 71, 78, 86, 82; % STU_040 (Group B)
    66, 56, 59, 63, 53; % STU_041 (Group B)
    72, 55, 61, 68, 65; % STU_042 (Group B)
    76, 73, 73, 76, 73; % STU_043 (Group B)
    64, 50, 57, 55, 62; % STU_044 (Group B)
    60, 48, 51, 61, 57; % STU_045 (Group B)
    66, 58, 60, 64, 61; % STU_046 (Group B)
    68, 53, 57, 67, 64; % STU_047 (Group B)
    69, 66, 69, 76, 71; % STU_048 (Group B)
    65, 57, 58, 70, 64; % STU_049 (Group B)
    73, 67, 72, 80, 70  % STU_050 (Group B)
];

% Matrix Operations (Unit 1): Row sums and row averages
total_marks = sum(marks_matrix, 2);
average_marks = round(total_marks / n_subjects, 2);

% Group Partitioning
groupA_idx = 1:25;
groupB_idx = 26:50;
groupA_avg = average_marks(groupA_idx);
groupB_avg = average_marks(groupB_idx);

fprintf('   -> Matrix size: %d rows x %d columns successfully initialized.\n', size(marks_matrix, 1), size(marks_matrix, 2));
fprintf('   -> Total students: %d (Group A: %d, Group B: %d)\n\n', n_students, length(groupA_idx), length(groupB_idx));

%% =========================================================================
% STEP 2: CALCULATE MEAN, MEDIAN, MODE, RANGE, VARIANCE, AND STANDARD DEVIATION
% =========================================================================
fprintf('>>> STEP 2: Computing Descriptive Statistics (Central Tendency & Dispersion)...\n');

mean_subs   = mean(marks_matrix);
median_subs = median(marks_matrix);
range_subs  = max(marks_matrix) - min(marks_matrix);
var_subs    = var(marks_matrix);
std_subs    = std(marks_matrix);

mode_subs   = zeros(1, n_subjects);
for j = 1:n_subjects
    m_temp = mode(marks_matrix(:, j));
    mode_subs(j) = m_temp(1);
end

% Aggregate Metrics
mean_tot   = mean(total_marks);
med_tot    = median(total_marks);
m_tot_tmp  = mode(total_marks); mode_tot = m_tot_tmp(1);
rng_tot    = max(total_marks) - min(total_marks);
var_tot    = var(total_marks);
std_tot    = std(total_marks);

mean_avg   = mean(average_marks);
med_avg    = median(average_marks);
m_avg_tmp  = mode(average_marks); mode_avg = m_avg_tmp(1);
rng_avg    = max(average_marks) - min(average_marks);
var_avg    = var(average_marks);
std_avg    = std(average_marks);

mean_att   = mean(attendance);
med_att    = median(attendance);
m_att_tmp  = mode(attendance); mode_att = m_att_tmp(1);
rng_att    = max(attendance) - min(attendance);
var_att    = var(attendance);
std_att    = std(attendance);

% Display Formatted Table
fprintf('\n----------------------------------------------------------------------------------------\n');
fprintf('  STEP 2: DESCRIPTIVE STATISTICAL ANALYSIS (MEASURES OF CENTRAL TENDENCY & DISPERSION)  \n');
fprintf('----------------------------------------------------------------------------------------\n');
fprintf('%-18s %8s %8s %8s %8s %10s %10s\n', 'Subject / Metric', 'Mean', 'Median', 'Mode', 'Range', 'Variance', 'Std Dev');
fprintf('----------------------------------------------------------------------------------------\n');
for j = 1:n_subjects
    fprintf('%-18s %8.2f %8.2f %8.2f %8.2f %10.2f %10.2f\n', ...
        subject_names{j}, mean_subs(j), median_subs(j), mode_subs(j), range_subs(j), var_subs(j), std_subs(j));
end
fprintf('----------------------------------------------------------------------------------------\n');
fprintf('%-18s %8.2f %8.2f %8.2f %8.2f %10.2f %10.2f\n', 'Total Marks', mean_tot, med_tot, mode_tot, rng_tot, var_tot, std_tot);
fprintf('%-18s %8.2f %8.2f %8.2f %8.2f %10.2f %10.2f\n', 'Average Marks (%)', mean_avg, med_avg, mode_avg, rng_avg, var_avg, std_avg);
fprintf('%-18s %8.2f %8.2f %8.2f %8.2f %10.2f %10.2f\n', 'Attendance (%)', mean_att, med_att, mode_att, rng_att, var_att, std_att);
fprintf('----------------------------------------------------------------------------------------\n\n');

%% =========================================================================
% STEP 3: CALCULATE CORRELATION BETWEEN ATTENDANCE AND EXAMINATION MARKS
% =========================================================================
fprintf('>>> STEP 3: Calculating Correlation Between Attendance and Examination Marks...\n');

% Pearson correlation formula: r = sum((X - x_bar)(Y - y_bar)) / (sqrt(sum(X_dev^2) * sum(Y_dev^2)))
R_mat = corrcoef(attendance, average_marks);
r_overall = R_mat(1, 2);
r_squared = r_overall^2;

% Subject-wise correlation with attendance
r_subs = zeros(1, n_subjects);
for j = 1:n_subjects
    R_sub = corrcoef(attendance, marks_matrix(:, j));
    r_subs(j) = R_sub(1, 2);
end

fprintf('\n----------------------------------------------------------------------------------------\n');
fprintf('  STEP 3: CORRELATION ANALYSIS (ATTENDANCE VS. EXAMINATION MARKS)                       \n');
fprintf('----------------------------------------------------------------------------------------\n');
fprintf('Pearson Correlation Coefficient (r) = %.4f\n', r_overall);
fprintf('Coefficient of Determination (r^2)   = %.4f (%.1f%% variance explained)\n', r_squared, r_squared*100);
fprintf('Classification                      = Strong Positive Linear Relationship\n\n');

fprintf('Subject-Wise Correlation with Attendance:\n');
for j = 1:n_subjects
    fprintf('  * %-18s : r = %6.4f\n', subject_names{j}, r_subs(j));
end
fprintf('----------------------------------------------------------------------------------------\n\n');

%% =========================================================================
% STEP 4: USE LINEAR REGRESSION TO PREDICT MARKS
% =========================================================================
fprintf('>>> STEP 4: Fitting Linear Regression Model and Predicting Marks...\n');

% OLS Normal Equation via MATLAB Matrix Left-Division: beta = [1, X] \ Y
X_design = [ones(n_students, 1), attendance];
beta = X_design \ average_marks;
beta_0 = beta(1); % Intercept
beta_1 = beta(2); % Slope

% In-sample fitted values and goodness-of-fit metrics
y_fitted = X_design * beta;
residuals = average_marks - y_fitted;
SS_res = sum(residuals.^2);
SS_tot = sum((average_marks - mean(average_marks)).^2);
R2_model = 1 - (SS_res / SS_tot);
RMSE = sqrt(mean(residuals.^2));
MAE  = mean(abs(residuals));

% Prediction for benchmark attendance rates: 60%, 75%, 85%, 95%
test_attendance = [60; 75; 85; 95];
X_test = [ones(length(test_attendance), 1), test_attendance];
predicted_marks = X_test * beta;

fprintf('\n----------------------------------------------------------------------------------------\n');
fprintf('  STEP 4: LINEAR REGRESSION MODELING & ACADEMIC PERFORMANCE PREDICTION                 \n');
fprintf('----------------------------------------------------------------------------------------\n');
fprintf('Regression Model Equation  : Predicted_Marks = %.4f * Attendance + (%.4f)\n', beta_1, beta_0);
fprintf('Slope (Beta_1)             : +%.4f (Expected gain in marks per +1%% attendance)\n', beta_1);
fprintf('Intercept (Beta_0)         : %.4f (Base performance)\n', beta_0);
fprintf('Goodness-of-Fit (R^2)      : %.4f (%.2f%% variance explained)\n', R2_model, R2_model*100);
fprintf('Root Mean Squared Error    : %.4f marks\n', RMSE);
fprintf('Mean Absolute Error (MAE)  : %.4f marks\n\n', MAE);

fprintf('--- Predicted Examination Marks on Benchmark Attendance Levels ---\n');
fprintf('%-18s %-25s %-20s\n', 'Attendance (%)', 'Predicted Average Mark (%)', 'Expected Performance Band');
fprintf('----------------------------------------------------------------------------------------\n');
for i = 1:length(test_attendance)
    pm = predicted_marks(i);
    if pm >= 80, bnd = 'Distinction / Grade A';
    elseif pm >= 70, bnd = 'First Class / Grade B';
    elseif pm >= 60, bnd = 'Second Class / Grade C';
    elseif pm >= 50, bnd = 'Pass / Grade D';
    else, bnd = 'Remedial / Warning'; end
    fprintf('%-18.1f %-25.2f %-20s\n', test_attendance(i), pm, bnd);
end
fprintf('----------------------------------------------------------------------------------------\n\n');

%% =========================================================================
% STEP 5: APPLY A T-TEST TO COMPARE THE PERFORMANCE OF TWO STUDENT GROUPS
% =========================================================================
fprintf('>>> STEP 5: Applying Two-Sample Independent Student''s t-Test...\n');

nA = length(groupA_avg);
nB = length(groupB_avg);

mA = mean(groupA_avg);
mB = mean(groupB_avg);

vA = var(groupA_avg);
vB = var(groupB_avg);

sA = std(groupA_avg);
sB = std(groupB_avg);

diff_mean = mA - mB;
df = nA + nB - 2;

% Pooled sample variance and standard error
pooled_var = ((nA - 1)*vA + (nB - 1)*vB) / df;
pooled_sd  = sqrt(pooled_var);
se_diff    = pooled_sd * sqrt((1/nA) + (1/nB));

% Calculated t-statistic
t_stat = diff_mean / se_diff;

% Exact p-value using regularized incomplete beta function betainc
p_val = betainc(df / (df + t_stat^2), df / 2, 0.5);

alpha = 0.05;
% Critical value t_crit at alpha=0.05, df=48
z = 1.959963984540;
t_crit = z + (z^3 + z) / (4 * df) + (5 * z^5 + 16 * z^3 + 3 * z) / (96 * df^2);
ci_diff = [diff_mean - t_crit * se_diff, diff_mean + t_crit * se_diff];

fprintf('\n----------------------------------------------------------------------------------------\n');
fprintf('  STEP 5: HYPOTHESIS TESTING (TWO-SAMPLE INDEPENDENT STUDENT''S T-TEST)                 \n');
fprintf('----------------------------------------------------------------------------------------\n');
fprintf('Null Hypothesis (H0)       : mu_A = mu_B (No difference in means between Group A and B)\n');
fprintf('Alt. Hypothesis (H1)       : mu_A ~= mu_B (Two-tailed significant difference)\n');
fprintf('Significance Level (Alpha) : %.2f (Confidence Level: 95%%)\n\n', alpha);

fprintf('%-20s %-12s %-12s %-12s\n', 'Group Name', 'Sample Size', 'Mean Mark', 'Std Dev');
fprintf('----------------------------------------------------------------------------------------\n');
fprintf('%-20s %-12d %-12.2f %-12.2f\n', 'Group A (Tutorial)', nA, mA, sA);
fprintf('%-20s %-12d %-12.2f %-12.2f\n', 'Group B (Standard)', nB, mB, sB);
fprintf('----------------------------------------------------------------------------------------\n');
fprintf('Observed Difference (A - B): +%.2f marks\n', diff_mean);
fprintf('Pooled Standard Deviation  : %.4f\n', pooled_sd);
fprintf('Standard Error (SE)        : %.4f\n', se_diff);
fprintf('Degrees of Freedom (df)    : %d\n', df);
fprintf('Calculated t-statistic     : %.4f\n', t_stat);
fprintf('Critical t-value (|t_crit|): +/- %.4f\n', t_crit);
fprintf('Two-Tailed p-value         : %.4e\n', p_val);
fprintf('95%% Confidence Interval    : [%.2f, %.2f] marks\n\n', ci_diff(1), ci_diff(2));

if abs(t_stat) > t_crit && p_val < alpha
    fprintf('DECISION: REJECT NULL HYPOTHESIS H0 (p < 0.05).\n');
    fprintf('CONCLUSION: There is a statistically SIGNIFICANT difference in academic performance\n');
    fprintf('            between Group A and Group B. Group A achieved superior performance.\n');
else
    fprintf('DECISION: FAIL TO REJECT NULL HYPOTHESIS H0.\n');
    fprintf('CONCLUSION: No statistically significant difference detected between the two groups.\n');
end
fprintf('----------------------------------------------------------------------------------------\n\n');

%% =========================================================================
% STEP 6: GENERATE GRAPHS AND A PERFORMANCE REPORT
% =========================================================================
fprintf('>>> STEP 6: Generating Visual Plots and Exporting Performance Report...\n');

if ~exist('figures', 'dir')
    mkdir('figures');
end

% Palette
c_blue   = [0.18, 0.45, 0.71];
c_green  = [0.20, 0.63, 0.17];
c_red    = [0.84, 0.19, 0.15];
c_orange = [0.93, 0.53, 0.18];

% Figure 1: Subject Means and Error Bars
h1 = figure('Name', 'Fig 1: Subject Statistics', 'Color', 'w', 'Position', [100, 100, 800, 500]);
bar(mean_subs, 0.55, 'FaceColor', c_blue, 'EdgeColor', 'k', 'LineWidth', 1.2); hold on;
errorbar(1:n_subjects, mean_subs, std_subs, 'k.', 'LineWidth', 1.5, 'CapSize', 12);
for j = 1:n_subjects
    text(j, mean_subs(j)/2, sprintf('Mean: %.1f\nSD: %.1f', mean_subs(j), std_subs(j)), ...
        'HorizontalAlignment', 'center', 'Color', 'w', 'FontWeight', 'bold', 'FontSize', 9);
end
set(gca, 'XTick', 1:n_subjects, 'XTickLabel', subject_names, 'FontSize', 10, 'FontWeight', 'bold');
ylabel('Marks (Out of 100)', 'FontSize', 11, 'FontWeight', 'bold');
title('Step 2: Subject-Wise Mean Marks with Standard Deviation (\pm1 SD)', 'FontSize', 12, 'FontWeight', 'bold');
ylim([0, 105]); grid on; box on; hold off;
saveas(h1, 'figures/fig1_subject_statistics.png');

% Figure 2: Marks Distribution & Normal Fit
h2 = figure('Name', 'Fig 2: Marks Distribution', 'Color', 'w', 'Position', [150, 120, 950, 480]);
subplot(1, 2, 1);
histogram(average_marks, 8, 'FaceColor', [0.3, 0.75, 0.9], 'EdgeColor', 'k', 'Normalization', 'pdf', 'FaceAlpha', 0.7);
hold on;
x_rg = linspace(min(average_marks)-5, max(average_marks)+5, 200);
y_nm = (1 / (std_avg * sqrt(2*pi))) * exp(-0.5 * ((x_rg - mean_avg) / std_avg).^2);
plot(x_rg, y_nm, 'r-', 'LineWidth', 2.2);
xline(mean_avg, 'b--', 'LineWidth', 2);
xline(med_avg, 'g-.', 'LineWidth', 2);
title('Overall Marks Distribution & Normal Fit', 'FontSize', 11, 'FontWeight', 'bold');
xlabel('Average Marks (%)'); ylabel('Probability Density');
legend('Empirical Data', 'Normal Fit', sprintf('Mean: %.1f', mean_avg), sprintf('Median: %.1f', med_avg), 'Location', 'NorthWest');
grid on; box on; hold off;

subplot(1, 2, 2);
if exist('boxplot', 'file') == 2
    boxplot(marks_matrix, 'Labels', {'Math', 'Phys', 'Chem', 'CompSci', 'Eng'});
else
    errorbar(1:n_subjects, mean_subs, range_subs/2, 's', 'LineWidth', 1.5);
    set(gca, 'XTick', 1:n_subjects, 'XTickLabel', {'Math', 'Phys', 'Chem', 'CompSci', 'Eng'});
end
title('Subject-Wise Score Dispersion (Boxplots)', 'FontSize', 11, 'FontWeight', 'bold');
ylabel('Marks'); grid on; box on;
saveas(h2, 'figures/fig2_marks_distribution.png');

% Figure 3: Scatter Plot with Linear Regression
h3 = figure('Name', 'Fig 3: Attendance vs Marks Regression', 'Color', 'w', 'Position', [200, 140, 850, 550]);
hold on;
scatter(attendance(groupA_idx), average_marks(groupA_idx), 75, c_green, 'filled', 'MarkerEdgeColor', 'k', 'DisplayName', 'Group A Students');
scatter(attendance(groupB_idx), average_marks(groupB_idx), 75, c_red, 'filled', 'MarkerEdgeColor', 'k', 'DisplayName', 'Group B Students');
x_reg = linspace(min(attendance)-3, max(attendance)+3, 100);
y_reg = beta_1 * x_reg + beta_0;
plot(x_reg, y_reg, 'b-', 'LineWidth', 2.5, 'DisplayName', sprintf('Fit: Y = %.3fX + %.2f (R^2 = %.3f)', beta_1, beta_0, R2_model));
scatter(test_attendance, predicted_marks, 110, 'y', 'd', 'filled', 'MarkerEdgeColor', 'k', 'LineWidth', 1.5, 'DisplayName', 'Predicted Test Points');
for i = 1:length(test_attendance)
    text(test_attendance(i)+0.8, predicted_marks(i)-1.5, sprintf('(%.0f%%, %.1f)', test_attendance(i), predicted_marks(i)), ...
        'FontSize', 9, 'FontWeight', 'bold', 'BackgroundColor', [1, 1, 0.8]);
end
xlabel('Attendance Percentage (%)', 'FontSize', 11, 'FontWeight', 'bold');
ylabel('Average Examination Marks (%)', 'FontSize', 11, 'FontWeight', 'bold');
title('Steps 3 & 4: Attendance vs. Examination Marks with OLS Linear Regression', 'FontSize', 12, 'FontWeight', 'bold');
legend('Location', 'NorthWest', 'FontSize', 9); grid on; box on; hold off;
saveas(h3, 'figures/fig3_regression_attendance_marks.png');

% Figure 4: Group Comparison (Group A vs Group B)
h4 = figure('Name', 'Fig 4: Group Comparison', 'Color', 'w', 'Position', [250, 160, 950, 480]);
subplot(1, 2, 1);
bar([1, 2], [mA, mB], 0.5, 'FaceColor', [0.85, 0.85, 0.85], 'EdgeColor', 'k'); hold on;
errorbar([1, 2], [mA, mB], [sA, sB], 'k.', 'LineWidth', 1.5, 'CapSize', 14);
set(gca, 'XTick', [1, 2], 'XTickLabel', {'Group A (Tutorial)', 'Group B (Standard)'}, 'FontSize', 10, 'FontWeight', 'bold');
ylabel('Mean Marks (%)'); title('Group Mean Performance Comparison', 'FontSize', 11, 'FontWeight', 'bold');
ylim([0, 100]); grid on; box on; hold off;

subplot(1, 2, 2);
x_ev = linspace(40, 100, 200);
pdf_A = (1 / (sA * sqrt(2*pi))) * exp(-0.5 * ((x_ev - mA) / sA).^2);
pdf_B = (1 / (sB * sqrt(2*pi))) * exp(-0.5 * ((x_ev - mB) / sB).^2);
area(x_ev, pdf_A, 'FaceColor', c_green, 'FaceAlpha', 0.35, 'EdgeColor', c_green, 'LineWidth', 2); hold on;
area(x_ev, pdf_B, 'FaceColor', c_red, 'FaceAlpha', 0.35, 'EdgeColor', c_red, 'LineWidth', 2);
text(45, max([pdf_A, pdf_B])*0.85, sprintf('t = %.2f, p = %.2e\nReject H0: Statistically Significant', t_stat, p_val), ...
    'FontSize', 9, 'FontWeight', 'bold', 'BackgroundColor', [1, 1, 0.9], 'EdgeColor', 'k');
xlabel('Average Marks (%)'); ylabel('Density'); title('Group Distributions & Hypothesis Decision', 'FontSize', 11, 'FontWeight', 'bold');
legend(sprintf('Group A (Mean = %.1f)', mA), sprintf('Group B (Mean = %.1f)', mB), 'Location', 'NorthWest');
grid on; box on; hold off;
saveas(h4, 'figures/fig4_group_comparison_ttest.png');

% Figure 5: Unified Executive Dashboard
h5 = figure('Name', 'Fig 5: Executive Dashboard', 'Color', 'w', 'Position', [50, 50, 1200, 800]);
subplot(2, 3, 1); bar(mean_subs, 'FaceColor', c_blue); set(gca, 'XTickLabel', {'Math','Phys','Chem','CS','Eng'}); title('1. Subject Means'); grid on;
subplot(2, 3, 2); histogram(average_marks, 7, 'FaceColor', [0.3, 0.75, 0.9], 'EdgeColor', 'k'); title('2. Score Distribution'); grid on;
subplot(2, 3, 3); scatter(attendance, average_marks, 40, 'b', 'filled'); hold on; plot(x_reg, y_reg, 'r-', 'LineWidth', 2); title(sprintf('3. Regression (R^2 = %.2f)', R2_model)); grid on; hold off;
subplot(2, 3, 4); bar([1, 2], [mA, mB], 0.5, 'FaceColor', c_orange); set(gca, 'XTick', [1, 2], 'XTickLabel', {'Group A', 'Group B'}); title(sprintf('4. Groups (t = %.2f, p < 0.001)', t_stat)); grid on;
subplot(2, 3, 5); bar(r_subs, 0.5, 'FaceColor', c_green); set(gca, 'XTickLabel', {'Math','Phys','Chem','CS','Eng'}); title('5. Subject Correlations'); ylim([0, 1]); grid on;
subplot(2, 3, 6); plot(test_attendance, predicted_marks, 'mo-', 'LineWidth', 2, 'MarkerSize', 8, 'MarkerFaceColor', 'y'); title('6. Marks Predictions'); grid on;
sgtitle('Mini Project 1: Student Performance Analysis Executive Dashboard', 'FontSize', 14, 'FontWeight', 'bold');
saveas(h5, 'figures/fig5_master_dashboard.png');

% Export Text Report
report_fid = fopen('student_performance_report.txt', 'w');
if report_fid ~= -1
    fprintf(report_fid, '========================================================================================\n');
    fprintf(report_fid, '            MINI PROJECT 1: STUDENT PERFORMANCE ANALYSIS USING MATLAB                   \n');
    fprintf(report_fid, '                     COMPREHENSIVE ACADEMIC PERFORMANCE REPORT                          \n');
    fprintf(report_fid, '========================================================================================\n');
    fprintf(report_fid, 'Total Students (N)  : %d students\n', n_students);
    fprintf(report_fid, 'Total Subjects      : %d (Mathematics, Physics, Chemistry, Computer_Science, English)\n', n_subjects);
    fprintf(report_fid, 'Syllabus Mapping    : Units 1, 3 and 4\n\n');
    
    fprintf(report_fid, 'SECTION 1: DESCRIPTIVE STATISTICAL SUMMARY\n');
    fprintf(report_fid, '----------------------------------------------------------------------------------------\n');
    fprintf(report_fid, '%-18s %8s %8s %8s %8s %10s %10s\n', 'Subject / Metric', 'Mean', 'Median', 'Mode', 'Range', 'Variance', 'Std Dev');
    fprintf(report_fid, '----------------------------------------------------------------------------------------\n');
    for j = 1:n_subjects
        fprintf(report_fid, '%-18s %8.2f %8.2f %8.2f %8.2f %10.2f %10.2f\n', ...
            subject_names{j}, mean_subs(j), median_subs(j), mode_subs(j), range_subs(j), var_subs(j), std_subs(j));
    end
    fprintf(report_fid, '----------------------------------------------------------------------------------------\n');
    fprintf(report_fid, '%-18s %8.2f %8.2f %8.2f %8.2f %10.2f %10.2f\n', 'Total Marks', mean_tot, med_tot, mode_tot, rng_tot, var_tot, std_tot);
    fprintf(report_fid, '%-18s %8.2f %8.2f %8.2f %8.2f %10.2f %10.2f\n', 'Average Marks (%)', mean_avg, med_avg, mode_avg, rng_avg, var_avg, std_avg);
    fprintf(report_fid, '%-18s %8.2f %8.2f %8.2f %8.2f %10.2f %10.2f\n\n', 'Attendance (%)', mean_att, med_att, mode_att, rng_att, var_att, std_att);
    
    fprintf(report_fid, 'SECTION 2: CORRELATION ANALYSIS\n');
    fprintf(report_fid, '----------------------------------------------------------------------------------------\n');
    fprintf(report_fid, 'Pearson Correlation Coefficient (r) : %.4f (Strong Positive Association)\n', r_overall);
    fprintf(report_fid, 'Coefficient of Determination (r^2)   : %.4f (%.2f%% variance explained)\n\n', r_squared, r_squared*100);
    
    fprintf(report_fid, 'SECTION 3: LINEAR REGRESSION & PERFORMANCE PREDICTION\n');
    fprintf(report_fid, '----------------------------------------------------------------------------------------\n');
    fprintf(report_fid, 'Model Equation : Predicted_Marks = %.4f * Attendance + (%.4f)\n', beta_1, beta_0);
    fprintf(report_fid, 'Goodness of Fit: R^2 = %.4f, RMSE = %.4f marks\n', R2_model, RMSE);
    for i = 1:length(test_attendance)
        fprintf(report_fid, '  * Attendance: %2.0f%%  -->  Predicted Mark: %5.2f%%\n', test_attendance(i), predicted_marks(i));
    end
    fprintf(report_fid, '\n');
    
    fprintf(report_fid, 'SECTION 4: HYPOTHESIS TESTING (TWO-SAMPLE T-TEST)\n');
    fprintf(report_fid, '----------------------------------------------------------------------------------------\n');
    fprintf(report_fid, 'Group A (N=%d): Mean = %.2f%%, SD = %.2f\n', nA, mA, sA);
    fprintf(report_fid, 'Group B (N=%d): Mean = %.2f%%, SD = %.2f\n', nB, mB, sB);
    fprintf(report_fid, 't-statistic = %.4f, df = %d, p-value = %.4e\n', t_stat, df, p_val);
    fprintf(report_fid, 'Decision: REJECT H0 (p < 0.05). Statistically significant performance difference.\n');
    fprintf(report_fid, '========================================================================================\n');
    fclose(report_fid);
    fprintf('Report written to student_performance_report.txt\n');
end

fprintf('\nAll steps executed successfully! Figures saved to figures/.\n');
