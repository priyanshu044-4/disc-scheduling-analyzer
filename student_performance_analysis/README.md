# Mini Project 1: Student Performance Analysis Using MATLAB

**Objective:** Analyze student marks and attendance using statistical techniques and predict academic performance through linear regression.  
**Syllabus Mapping:** Units 1, 3, and 4 (Matrices, Descriptive Statistics, Data Visualization, Correlation, Regression, and Hypothesis Testing).

---

## 📁 Project Directory Structure

```text
student_performance_analysis/
├── main_student_performance_analysis.m   % Master modular script (recommended entry point)
├── student_performance_all_in_one.m      % Standalone single-file script (zero external dependencies)
├── generate_dataset.m                    % Script to generate or regenerate custom student data
├── student_data.csv                      % Curated dataset (50 students, 5 subjects, attendance, groups)
├── student_performance_report.txt        % Formatted academic performance report output
├── modules/                              % Modular functions implementing each step
│   ├── create_student_matrix.m           % Step 1: Matrix creation, indexing, group splitting
│   ├── calculate_statistics.m            % Step 2: Mean, median, mode, range, variance, std dev
│   ├── calculate_correlation.m           % Step 3: Pearson correlation coefficient and strength
│   ├── predict_marks_regression.m        % Step 4: OLS linear regression model & predictions
│   ├── compare_groups_ttest.m            % Step 5: Independent two-sample Student's t-test
│   ├── generate_plots.m                  % Step 6A: 6 High-resolution figures & dashboard
│   └── generate_report.m                 % Step 6B: Formatted report generator (console & file)
└── figures/                              % Generated and saved high-resolution figures (.png)
    ├── fig1_subject_statistics.png       % Bar chart with ±1 SD error bars
    ├── fig2_marks_distribution.png       % Histogram with normal fit & subject boxplots
    ├── fig3_regression_attendance_marks.png % Scatter plot, regression line, predicted points
    ├── fig4_group_comparison_ttest.png   % Boxplot and distribution comparison (Group A vs B)
    ├── fig5_correlation_heatmap.png      % Inter-feature correlation heatmap
    └── fig6_master_dashboard.png         % Unified 6-panel executive summary dashboard
```

---

## 🚀 Quick Start Guide

### Option 1: Running the Master Modular Script (Recommended)
1. Open **MATLAB** or **GNU Octave**.
2. Navigate to this directory:
   ```matlab
   cd 'path/to/student_performance_analysis'
   ```
3. Run the master script:
   ```matlab
   main_student_performance_analysis
   ```
   * All 6 implementation steps execute sequentially.
   * Formatted tables and summaries are printed directly to the MATLAB Command Window.
   * Visual plots are displayed interactively and saved to `figures/`.
   * A performance report is saved to `student_performance_report.txt`.

### Option 2: Running the Standalone Script (Single-File Submission)
If your laboratory submission requires submitting only a single `.m` file:
```matlab
student_performance_all_in_one
```
* Contains the complete numeric dataset embedded internally.
* Runs on base MATLAB with no toolboxes required (includes analytical regularized incomplete beta function `betainc` for exact p-value calculation).

---

## 🔬 Syllabus & Concept Mapping

| Syllabus Unit | Key Concepts Applied | MATLAB Implementation Functions |
| :--- | :--- | :--- |
| **Unit 1: Matrices & Arrays** | Matrix initialization, 2D arrays ($50 \times 5$), indexing, vectorization, row-wise summation | `zeros`, `sum(M, 2)`, `size()`, logical indexing `M(mask, :)` |
| **Unit 3: Statistics & Visualization** | Central tendency, dispersion, 2D graphics, subplots, error bars | `mean`, `median`, `mode`, `var`, `std`, `bar`, `errorbar`, `histogram`, `scatter`, `saveas` |
| **Unit 4: Modeling & Hypothesis Testing** | Pearson correlation, ordinary least squares (OLS), Student's t-test | `corrcoef`, matrix division `X \ Y`, `polyfit`, `polyval`, `ttest2`, `betainc` |

---

## 📊 Summary of Statistical Results (N = 50)

### 1. Descriptive Statistics by Subject & Overall
| Subject / Metric | Mean | Median | Mode | Range | Variance | Std Dev |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Mathematics** | 73.36 | 72.00 | 66.00 | 32.00 | 71.05 | 8.43 |
| **Physics** | 67.28 | 66.50 | 64.00 | 48.00 | 103.88 | 10.19 |
| **Chemistry** | 71.32 | 72.50 | 64.00 | 41.00 | 98.96 | 9.95 |
| **Computer Science** | 75.20 | 77.50 | 79.00 | 40.00 | 100.82 | 10.04 |
| **English** | 70.38 | 71.00 | 65.00 | 41.00 | 87.67 | 9.36 |
| **Total Marks (out of 500)** | 357.54 | 365.50 | 307.00 | 180.00 | 1945.23 | 44.10 |
| **Average Marks (%)** | 71.51 | 73.10 | 61.40 | 36.00 | 77.81 | 8.82 |
| **Attendance (%)** | 79.13 | 79.15 | 85.10 | 34.50 | 80.39 | 8.97 |

### 2. Correlation Analysis
* **Pearson Correlation ($r$)**: `+0.7215` (Strong positive correlation)
* **Coefficient of Determination ($r^2$)**: `0.5206` (52.06% of marks variance explained by attendance)
* **Subject-wise Correlation with Attendance**:
  - Physics: $r = 0.7491$ (Strongest)
  - Computer Science: $r = 0.7012$
  - Chemistry: $r = 0.6804$
  - English: $r = 0.6558$
  - Mathematics: $r = 0.6382$

### 3. Linear Regression Model
* **Model Equation**: $\hat{Y} = 0.7532 \times \text{Attendance} + 10.9009$
* **Slope ($\beta_1$)**: $+0.7532$ (For every $+1\%$ gain in attendance, average exam score increases by $\approx 0.75$ marks)
* **Intercept ($\beta_0$)**: $10.9009$
* **Goodness of Fit**: $R^2 = 0.5206$, $\text{RMSE} = 6.05$ marks, $\text{MAE} = 4.88$ marks
* **Benchmark Predictions**:
  - $60\%$ Attendance $\rightarrow$ **$56.09\%$** (Pass / Grade D)
  - $75\%$ Attendance $\rightarrow$ **$67.39\%$** (Second Class / Grade C)
  - $85\%$ Attendance $\rightarrow$ **$74.92\%$** (First Class / Grade B)
  - $95\%$ Attendance $\rightarrow$ **$82.46\%$** (Distinction / Grade A)

### 4. Two-Sample Independent Student's t-Test
* **Groups**: Group A ($N=25$, Tutorial Cohort) vs. Group B ($N=25$, Standard Cohort)
* **Hypotheses**:
  - $H_0: \mu_A = \mu_B$ (No significant difference in group means)
  - $H_1: \mu_A \ne \mu_B$ (Two-tailed significant difference)
* **Group A Mean**: $77.00\% \pm 6.92$
* **Group B Mean**: $66.02\% \pm 6.94$
* **Difference in Means**: $+10.98$ marks
* **Pooled Variance ($s_p^2$)**: $47.9892$ ($s_p = 6.9274$)
* **Degrees of Freedom ($df$)**: $48$
* **$t$-statistic**: $+5.6046$
* **Critical $t$ ($\alpha = 0.05$)**: $\pm 2.0106$
* **$p$-value**: $1.0015 \times 10^{-6}$ ($< 0.001$)
* **Statistical Decision**: **Reject $H_0$**. Group A achieved statistically significant higher marks.

---

## 🎯 Viva-Voce & Lab Examination Preparation

1. **Q: Why use `sum(M, 2)` instead of `sum(M)` in MATLAB?**  
   *A:* In MATLAB, `sum(M)` operates down columns (dimension 1). Passing dimension 2 (`sum(M, 2)`) performs row-wise summation, adding all subject marks for each student.

2. **Q: How does MATLAB compute linear regression using the backslash operator `\`?**  
   *A:* The expression `beta = [ones(N,1), X] \ Y` solves the normal equations $(X^T X)\beta = X^T Y$ using QR decomposition, yielding the optimal ordinary least squares estimators $\beta_0$ and $\beta_1$ without matrix inversion.

3. **Q: What is the difference between variance and standard deviation?**  
   *A:* Variance measures the average squared deviations from the mean ($s^2 = \frac{1}{N-1}\sum (x_i - \bar{x})^2$), expressed in squared units. Standard deviation ($s = \sqrt{s^2}$) is in the original units of measurement (marks).

4. **Q: What is the degrees of freedom for a two-sample independent t-test with equal sample sizes?**  
   *A:* $df = n_1 + n_2 - 2$. For 25 students in each group, $df = 25 + 25 - 2 = 48$.

5. **Q: How can you compute the p-value of a t-test without the Statistics Toolbox?**  
   *A:* By using MATLAB's core regularized incomplete beta function: `p = betainc(df / (df + t^2), df / 2, 0.5)`. This is the exact analytical cumulative distribution of Student's t distribution.
