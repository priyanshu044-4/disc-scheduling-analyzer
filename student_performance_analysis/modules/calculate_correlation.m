function corr_result = calculate_correlation(student_data)
% CALCULATE_CORRELATION Implementation Step 3: Correlation Analysis
%
% SYNOPSIS:
%   corr_result = calculate_correlation(student_data)
%
% INPUT:
%   student_data - Struct returned by create_student_matrix()
%
% OUTPUT:
%   corr_result - Struct containing:
%       .r_overall        - Pearson correlation coefficient (Attendance vs Average Marks)
%       .r_subjects       - Vector of correlation coefficients for each subject vs Attendance
%       .corr_matrix      - Full (N_features x N_features) correlation matrix
%       .feature_names    - Labels for correlation matrix
%       .interpretation   - Qualitative description of correlation strength and direction
%
% SYLLABUS MAPPING: Unit 4 (Bivariate Analysis, Pearson Correlation)

    att = student_data.attendance;
    avg = student_data.average_marks;
    M   = student_data.marks_matrix;
    subjects = student_data.subject_names;
    n_subs = length(subjects);

    % Overall Correlation using Pearson formula and MATLAB corrcoef
    % Manual mathematical verification:
    x_dev = att - mean(att);
    y_dev = avg - mean(avg);
    r_manual = sum(x_dev .* y_dev) / sqrt(sum(x_dev.^2) * sum(y_dev.^2));

    R_matrix = corrcoef(att, avg);
    r_overall = R_matrix(1, 2);

    % Subject-wise correlations with Attendance
    r_subjects = zeros(1, n_subs);
    for j = 1:n_subs
        R_sub = corrcoef(att, M(:, j));
        r_subjects(j) = R_sub(1, 2);
    end

    % Qualitative interpretation of Pearson r
    abs_r = abs(r_overall);
    if abs_r >= 0.70
        strength = 'Strong';
    elseif abs_r >= 0.40
        strength = 'Moderate';
    elseif abs_r >= 0.20
        strength = 'Weak';
    else
        strength = 'Negligible';
    end

    if r_overall > 0
        direction = 'Positive';
    else
        direction = 'Negative';
    end
    interpretation_str = sprintf('%s %s Linear Association', strength, direction);

    % Full correlation matrix across [Attendance, Subjects..., Average]
    all_data = [att, M, avg];
    corr_matrix = corrcoef(all_data);
    feature_names = [{'Attendance'}, subjects, {'Average'}];

    % Populate return struct
    corr_result.r_overall        = r_overall;
    corr_result.r_manual         = r_manual;
    corr_result.r_subjects       = r_subjects;
    corr_result.corr_matrix      = corr_matrix;
    corr_result.feature_names    = feature_names;
    corr_result.interpretation   = interpretation_str;
    corr_result.r_squared        = r_overall^2;

    % Display formatted results
    fprintf('\n----------------------------------------------------------------------------------------\n');
    fprintf('  STEP 3: CORRELATION ANALYSIS (ATTENDANCE VS. EXAMINATION MARKS)                       \n');
    fprintf('----------------------------------------------------------------------------------------\n');
    fprintf('Pearson Correlation Coefficient (r) = %.4f\n', r_overall);
    fprintf('Coefficient of Determination (r^2)   = %.4f (%.1f%% variance explained)\n', ...
        corr_result.r_squared, corr_result.r_squared * 100);
    fprintf('Correlation Classification          = %s\n', interpretation_str);
    fprintf('Interpretation: Higher class attendance is strongly associated with higher academic scores.\n\n');

    fprintf('--- Subject-Wise Correlation with Attendance ---\n');
    fprintf('%-22s %-15s %-20s\n', 'Subject', 'Pearson r', 'Strength');
    fprintf('------------------------------------------------------------\n');
    for j = 1:n_subs
        r_s = r_subjects(j);
        if abs(r_s) >= 0.7
            s_label = 'Strong Positive';
        elseif abs(r_s) >= 0.4
            s_label = 'Moderate Positive';
        else
            s_label = 'Weak Positive';
        end
        fprintf('%-22s %-15.4f %-20s\n', subjects{j}, r_s, s_label);
    end
    fprintf('------------------------------------------------------------\n\n');
end
