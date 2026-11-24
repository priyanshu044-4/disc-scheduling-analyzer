function stats_result = calculate_statistics(student_data)
% CALCULATE_STATISTICS Implementation Step 2: Descriptive Statistical Analysis
%
% SYNOPSIS:
%   stats_result = calculate_statistics(student_data)
%
% INPUT:
%   student_data - Struct returned by create_student_matrix()
%
% OUTPUT:
%   stats_result - Struct containing:
%       .subjects    - Struct with mean, median, mode, range, var, std for each subject
%       .overall     - Struct with stats for overall student averages
%       .totals      - Struct with stats for total marks
%       .summary_mat - Summary table matrix [Mean, Med, Mode, Range, Var, Std]
%
% SYLLABUS MAPPING: Unit 3 (Descriptive Statistics, Central Tendency & Dispersion)

    M = student_data.marks_matrix;
    avg = student_data.average_marks;
    tot = student_data.total_marks;
    subjects = student_data.subject_names;
    n_subs = length(subjects);

    % Preallocate metric arrays
    means  = zeros(1, n_subs);
    medians= zeros(1, n_subs);
    modes  = zeros(1, n_subs);
    ranges = zeros(1, n_subs);
    vars   = zeros(1, n_subs);
    stds   = zeros(1, n_subs);

    for j = 1:n_subs
        col = M(:, j);
        means(j)   = mean(col);
        medians(j) = median(col);
        
        % Mode calculation (using mode function, fallback to unique frequency)
        m_val = mode(col);
        modes(j) = m_val(1);
        
        % Range calculation: max - min
        ranges(j)  = max(col) - min(col);
        
        % Sample variance (N-1 denominator)
        vars(j)    = var(col);
        
        % Sample standard deviation
        stds(j)    = std(col);
    end

    % Overall Average statistics
    ov_mean   = mean(avg);
    ov_median = median(avg);
    ov_mode_v = mode(avg);
    ov_mode   = ov_mode_v(1);
    ov_range  = max(avg) - min(avg);
    ov_var    = var(avg);
    ov_std    = std(avg);

    % Total Marks statistics
    tot_mean   = mean(tot);
    tot_median = median(tot);
    tot_mode_v = mode(tot);
    tot_mode   = tot_mode_v(1);
    tot_range  = max(tot) - min(tot);
    tot_var    = var(tot);
    tot_std    = std(tot);

    % Attendance statistics
    att = student_data.attendance;
    att_mean   = mean(att);
    att_median = median(att);
    att_mode_v = mode(att);
    att_mode   = att_mode_v(1);
    att_range  = max(att) - min(att);
    att_var    = var(att);
    att_std    = std(att);

    % Populate return struct
    stats_result.subject_names = subjects;
    stats_result.means   = means;
    stats_result.medians = medians;
    stats_result.modes   = modes;
    stats_result.ranges  = ranges;
    stats_result.vars    = vars;
    stats_result.stds    = stds;

    stats_result.overall = struct('mean', ov_mean, 'median', ov_median, ...
        'mode', ov_mode, 'range', ov_range, 'var', ov_var, 'std', ov_std);

    stats_result.total = struct('mean', tot_mean, 'median', tot_median, ...
        'mode', tot_mode, 'range', tot_range, 'var', tot_var, 'std', tot_std);

    stats_result.attendance = struct('mean', att_mean, 'median', att_median, ...
        'mode', att_mode, 'range', att_range, 'var', att_var, 'std', att_std);

    % Print formatted table to Command Window
    fprintf('\n----------------------------------------------------------------------------------------\n');
    fprintf('  STEP 2: DESCRIPTIVE STATISTICAL ANALYSIS (MEASURES OF CENTRAL TENDENCY & DISPERSION)  \n');
    fprintf('----------------------------------------------------------------------------------------\n');
    fprintf('%-18s %8s %8s %8s %8s %10s %10s\n', 'Subject / Metric', 'Mean', 'Median', 'Mode', 'Range', 'Variance', 'Std Dev');
    fprintf('----------------------------------------------------------------------------------------\n');
    for j = 1:n_subs
        fprintf('%-18s %8.2f %8.2f %8.2f %8.2f %10.2f %10.2f\n', ...
            subjects{j}, means(j), medians(j), modes(j), ranges(j), vars(j), stds(j));
    end
    fprintf('----------------------------------------------------------------------------------------\n');
    fprintf('%-18s %8.2f %8.2f %8.2f %8.2f %10.2f %10.2f\n', ...
        'Total Marks', tot_mean, tot_median, tot_mode, tot_range, tot_var, tot_std);
    fprintf('%-18s %8.2f %8.2f %8.2f %8.2f %10.2f %10.2f\n', ...
        'Average Marks (%)', ov_mean, ov_median, ov_mode, ov_range, ov_var, ov_std);
    fprintf('%-18s %8.2f %8.2f %8.2f %8.2f %10.2f %10.2f\n', ...
        'Attendance (%)', att_mean, att_median, att_mode, att_range, att_var, att_std);
    fprintf('----------------------------------------------------------------------------------------\n\n');
end
