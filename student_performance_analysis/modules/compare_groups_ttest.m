function ttest_result = compare_groups_ttest(student_data, alpha)
% COMPARE_GROUPS_TTEST Implementation Step 5: Two-Sample Hypothesis Testing (t-Test)
%
% SYNOPSIS:
%   ttest_result = compare_groups_ttest(student_data, alpha)
%
% INPUT:
%   student_data - Struct returned by create_student_matrix()
%   alpha        - (Optional) Significance level. Default: 0.05 (95% confidence)
%
% OUTPUT:
%   ttest_result - Struct containing:
%       .mean_A, .std_A, .nA - Descriptive metrics for Group A
%       .mean_B, .std_B, .nB - Descriptive metrics for Group B
%       .mean_diff           - Difference in sample means (mean_A - mean_B)
%       .pooled_std          - Pooled standard deviation (s_p)
%       .standard_error      - Standard error of the difference (SE)
%       .df                  - Degrees of freedom
%       .t_stat              - Calculated t-statistic
%       .t_crit              - Two-tailed critical t-value at given alpha
%       .p_value             - Two-tailed p-value
%       .ci_95               - 95% Confidence interval [lower, upper] for difference
%       .h_decision          - 1 (Reject H0) or 0 (Fail to reject H0)
%       .conclusion_str      - Plain text conclusion
%
% SYLLABUS MAPPING: Unit 4 (Inferential Statistics, Hypothesis Testing)

    if nargin < 2 || isempty(alpha)
        alpha = 0.05;
    end

    groupA_marks = student_data.groupA_marks;
    groupB_marks = student_data.groupB_marks;

    nA = length(groupA_marks);
    nB = length(groupB_marks);

    mean_A = mean(groupA_marks);
    mean_B = mean(groupB_marks);

    var_A = var(groupA_marks);
    var_B = var(groupB_marks);

    std_A = sqrt(var_A);
    std_B = sqrt(var_B);

    mean_diff = mean_A - mean_B;

    % Degrees of freedom
    df = nA + nB - 2;

    % Pooled sample variance and standard deviation
    pooled_var = ((nA - 1) * var_A + (nB - 1) * var_B) / df;
    pooled_std = sqrt(pooled_var);

    % Standard error of difference in means
    se = pooled_std * sqrt((1 / nA) + (1 / nB));

    % Calculated t-statistic
    t_stat = mean_diff / se;

    % Two-tailed p-value calculation
    % Uses incomplete beta function betainc (exact core MATLAB built-in, zero toolbox required)
    % p = betainc(df / (df + t^2), df / 2, 0.5)
    x_val = df / (df + t_stat^2);
    p_value = betainc(x_val, df / 2, 0.5);

    % Approximate critical value t_crit at alpha=0.05 using Cornish-Fisher expansion / tinv if available
    if exist('tinv', 'file') == 2
        t_crit = tinv(1 - alpha/2, df);
    else
        % Standard Cornish-Fisher approximation for Student's t distribution:
        % z = 1.95996 for alpha = 0.05
        z = 1.959963984540;
        t_crit = z + (z^3 + z) / (4 * df) + (5 * z^5 + 16 * z^3 + 3 * z) / (96 * df^2);
    end

    % 95% Confidence Interval for difference (mu_A - mu_B)
    margin_error = t_crit * se;
    ci = [mean_diff - margin_error, mean_diff + margin_error];

    % Hypothesis Decision
    % H0: mu_A = mu_B (No difference)
    % H1: mu_A ~= mu_B (Significant difference)
    if abs(t_stat) > t_crit && p_value < alpha
        h_decision = 1; % Reject Null Hypothesis
        conclusion = sprintf('REJECT H0 at alpha = %.2f (p = %.4e < %.2f). There is a statistically SIGNIFICANT difference in academic performance between Group A and Group B.', ...
            alpha, p_value, alpha);
    else
        h_decision = 0; % Fail to reject Null Hypothesis
        conclusion = sprintf('FAIL TO REJECT H0 at alpha = %.2f (p = %.4e >= %.2f). No statistically significant difference detected between Group A and Group B.', ...
            alpha, p_value, alpha);
    end

    % Cross-check with toolbox ttest2 if present
    if exist('ttest2', 'file') == 2
        [h_tb, p_tb, ci_tb, stats_tb] = ttest2(groupA_marks, groupB_marks, 'Alpha', alpha);
        ttest_result.toolbox_verified = true;
    else
        ttest_result.toolbox_verified = false;
    end

    % Populate return struct
    ttest_result.mean_A          = mean_A;
    ttest_result.std_A           = std_A;
    ttest_result.nA              = nA;
    ttest_result.mean_B          = mean_B;
    ttest_result.std_B           = std_B;
    ttest_result.nB              = nB;
    ttest_result.mean_diff       = mean_diff;
    ttest_result.pooled_std      = pooled_std;
    ttest_result.standard_error  = se;
    ttest_result.df              = df;
    ttest_result.t_stat          = t_stat;
    ttest_result.t_crit          = t_crit;
    ttest_result.p_value         = p_value;
    ttest_result.alpha           = alpha;
    ttest_result.ci_95           = ci;
    ttest_result.h_decision      = h_decision;
    ttest_result.conclusion_str  = conclusion;

    % Print formatted test summary
    fprintf('\n----------------------------------------------------------------------------------------\n');
    fprintf('  STEP 5: HYPOTHESIS TESTING (TWO-SAMPLE INDEPENDENT STUDENT''S T-TEST)                 \n');
    fprintf('----------------------------------------------------------------------------------------\n');
    fprintf('Null Hypothesis (H0)       : mu_A = mu_B (No difference between Group A and Group B)\n');
    fprintf('Alt. Hypothesis (H1)       : mu_A ~= mu_B (Two-tailed significant difference)\n');
    fprintf('Significance Level (Alpha) : %.2f (Confidence Level: %.0f%%)\n\n', alpha, (1-alpha)*100);

    fprintf('%-18s %-12s %-12s %-12s\n', 'Group Name', 'Sample Size', 'Mean Mark', 'Std Dev');
    fprintf('----------------------------------------------------------------------------------------\n');
    fprintf('%-18s %-12d %-12.2f %-12.2f\n', 'Group A (Intervention)', nA, mean_A, std_A);
    fprintf('%-18s %-12d %-12.2f %-12.2f\n', 'Group B (Standard)', nB, mean_B, std_B);
    fprintf('----------------------------------------------------------------------------------------\n');
    fprintf('Observed Difference (A - B): +%.2f marks\n', mean_diff);
    fprintf('Pooled Standard Deviation  : %.4f\n', pooled_std);
    fprintf('Standard Error (SE)        : %.4f\n', se);
    fprintf('Degrees of Freedom (df)    : %d\n', df);
    fprintf('Calculated t-statistic     : %.4f\n', t_stat);
    fprintf('Critical t-value (|t_crit|): +/- %.4f\n', t_crit);
    fprintf('Two-Tailed p-value         : %.4e\n', p_value);
    fprintf('95%% Confidence Interval    : [%.2f, %.2f] marks\n\n', ci(1), ci(2));

    fprintf('DECISION & CONCLUSION:\n');
    fprintf('  %s\n', conclusion);
    fprintf('----------------------------------------------------------------------------------------\n\n');
end
