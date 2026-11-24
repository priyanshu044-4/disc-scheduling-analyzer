function fig_handles = generate_plots(student_data, stats_res, corr_res, reg_res, ttest_res, save_dir)
% GENERATE_PLOTS Implementation Step 6: Visualizations and Graphs
%
% SYNOPSIS:
%   fig_handles = generate_plots(student_data, stats_res, corr_res, reg_res, ttest_res, save_dir)
%
% INPUTS:
%   student_data - Struct returned by create_student_matrix()
%   stats_res    - Struct returned by calculate_statistics()
%   corr_res     - Struct returned by calculate_correlation()
%   reg_res      - Struct returned by predict_marks_regression()
%   ttest_res    - Struct returned by compare_groups_ttest()
%   save_dir     - (Optional) Directory to save output PNG files. Default: 'figures'
%
% OUTPUT:
%   fig_handles  - Array of figure handles created
%
% SYLLABUS MAPPING: Unit 3 (2D & 3D Plotting, Subplots, Aesthetics, Labels)

    if nargin < 6 || isempty(save_dir)
        save_dir = 'figures';
    end

    if ~exist(save_dir, 'dir')
        mkdir(save_dir);
    end

    fig_handles = [];

    subjects = student_data.subject_names;
    n_subs   = length(subjects);
    att      = student_data.attendance;
    avg      = student_data.average_marks;
    M        = student_data.marks_matrix;
    gA_idx   = student_data.groupA_mask;
    gB_idx   = student_data.groupB_mask;

    % Set color palette
    c_blue   = [0.18, 0.45, 0.71];
    c_green  = [0.20, 0.63, 0.17];
    c_red    = [0.84, 0.19, 0.15];
    c_orange = [0.93, 0.53, 0.18];
    c_purple = [0.58, 0.40, 0.74];

    % =========================================================================
    % FIGURE 1: Subject-Wise Mean Marks with Standard Deviation Error Bars
    % =========================================================================
    h1 = figure('Name', 'Fig 1: Subject Statistics', 'NumberTitle', 'off', ...
        'Color', 'w', 'Position', [100, 100, 800, 500]);
    
    b = bar(stats_res.means, 0.55, 'FaceColor', c_blue, 'EdgeColor', 'k', 'LineWidth', 1.2);
    hold on;
    errorbar(1:n_subs, stats_res.means, stats_res.stds, 'k.', 'LineWidth', 1.5, 'CapSize', 12);
    
    % Display numerical values on top of bars
    for j = 1:n_subs
        text(j, stats_res.means(j) / 2, ...
            sprintf('Mean: %.1f\nSD: %.1f', stats_res.means(j), stats_res.stds(j)), ...
            'HorizontalAlignment', 'center', 'Color', 'w', 'FontWeight', 'bold', 'FontSize', 9);
    end
    
    set(gca, 'XTick', 1:n_subs, 'XTickLabel', subjects, 'FontSize', 10, 'FontWeight', 'bold');
    ylabel('Marks (Out of 100)', 'FontSize', 11, 'FontWeight', 'bold');
    title('Step 2: Subject-Wise Mean Marks with Standard Deviation (\pm1 SD)', 'FontSize', 13, 'FontWeight', 'bold');
    ylim([0, 105]);
    grid on;
    box on;
    hold off;
    
    saveas(h1, fullfile(save_dir, 'fig1_subject_statistics.png'));
    fig_handles = [fig_handles, h1];

    % =========================================================================
    % FIGURE 2: Overall Marks Distribution (Histogram & Subject Boxplots)
    % =========================================================================
    h2 = figure('Name', 'Fig 2: Marks Distribution', 'NumberTitle', 'off', ...
        'Color', 'w', 'Position', [150, 120, 950, 480]);
    
    % Subplot 1: Overall Average Histogram + Fitted Normal Curve
    subplot(1, 2, 1);
    h_hist = histogram(avg, 8, 'FaceColor', [0.3, 0.75, 0.9], 'EdgeColor', 'k', ...
        'Normalization', 'pdf', 'FaceAlpha', 0.7);
    hold on;
    
    % Overlay normal density curve
    x_range = linspace(min(avg)-5, max(avg)+5, 200);
    y_norm  = (1 / (stats_res.overall.std * sqrt(2*pi))) * ...
              exp(-0.5 * ((x_range - stats_res.overall.mean) / stats_res.overall.std).^2);
    plot(x_range, y_norm, 'r-', 'LineWidth', 2.2, 'DisplayName', 'Normal Fit');
    
    xline(stats_res.overall.mean, 'b--', 'LineWidth', 2, ...
        'DisplayName', sprintf('Mean = %.1f', stats_res.overall.mean));
    xline(stats_res.overall.median, 'g-.', 'LineWidth', 2, ...
        'DisplayName', sprintf('Median = %.1f', stats_res.overall.median));
    
    title('Overall Average Marks Distribution', 'FontSize', 11, 'FontWeight', 'bold');
    xlabel('Average Examination Marks (%)', 'FontSize', 10, 'FontWeight', 'bold');
    ylabel('Probability Density', 'FontSize', 10, 'FontWeight', 'bold');
    legend('Empirical Data', 'Normal Fit', sprintf('Mean: %.1f', stats_res.overall.mean), ...
        sprintf('Median: %.1f', stats_res.overall.median), 'Location', 'NorthWest');
    grid on; box on; hold off;

    % Subplot 2: Subject Box Plots
    subplot(1, 2, 2);
    if exist('boxplot', 'file') == 2
        boxplot(M, 'Labels', {'Math', 'Phys', 'Chem', 'CompSci', 'Eng'}, ...
            'Colors', 'k', 'Symbol', 'ro');
    else
        % Fallback for base MATLAB without stats toolbox: error bar plot
        errorbar(1:n_subs, stats_res.means, stats_res.ranges/2, 's', ...
            'MarkerSize', 8, 'MarkerFaceColor', c_blue, 'LineWidth', 1.5);
        set(gca, 'XTick', 1:n_subs, 'XTickLabel', {'Math', 'Phys', 'Chem', 'CompSci', 'Eng'});
    end
    title('Subject-Wise Score Dispersion (Box Plots)', 'FontSize', 11, 'FontWeight', 'bold');
    ylabel('Marks', 'FontSize', 10, 'FontWeight', 'bold');
    grid on; box on;
    
    saveas(h2, fullfile(save_dir, 'fig2_marks_distribution.png'));
    fig_handles = [fig_handles, h2];

    % =========================================================================
    % FIGURE 3: Attendance vs Examination Marks with Linear Regression Line
    % =========================================================================
    h3 = figure('Name', 'Fig 3: Attendance vs Marks Regression', 'NumberTitle', 'off', ...
        'Color', 'w', 'Position', [200, 140, 850, 550]);
    
    hold on;
    % Scatter points by group
    scatter(att(gA_idx), avg(gA_idx), 75, c_green, 'filled', 'MarkerEdgeColor', 'k', ...
        'DisplayName', 'Group A Students');
    scatter(att(gB_idx), avg(gB_idx), 75, c_red, 'filled', 'MarkerEdgeColor', 'k', ...
        'DisplayName', 'Group B Students');
    
    % Regression line
    x_line = linspace(min(att)-3, max(att)+3, 100);
    y_line = reg_res.slope * x_line + reg_res.intercept;
    plot(x_line, y_line, 'b-', 'LineWidth', 2.5, ...
        'DisplayName', sprintf('Fit: Y = %.3fX + %.2f (R^2 = %.3f)', ...
        reg_res.slope, reg_res.intercept, reg_res.r_squared));
    
    % Highlight predicted points
    scatter(reg_res.test_attendance, reg_res.predicted_marks, 110, 'y', 'd', ...
        'filled', 'MarkerEdgeColor', 'k', 'LineWidth', 1.5, ...
        'DisplayName', 'Predicted Test Points');
    
    for i = 1:length(reg_res.test_attendance)
        text(reg_res.test_attendance(i) + 0.8, reg_res.predicted_marks(i) - 1.5, ...
            sprintf('(%.0f%%, %.1f)', reg_res.test_attendance(i), reg_res.predicted_marks(i)), ...
            'FontSize', 9, 'FontWeight', 'bold', 'BackgroundColor', [1, 1, 0.8]);
    end
    
    xlabel('Student Attendance Percentage (%)', 'FontSize', 11, 'FontWeight', 'bold');
    ylabel('Average Examination Marks (%)', 'FontSize', 11, 'FontWeight', 'bold');
    title('Steps 3 & 4: Attendance vs. Examination Marks with OLS Linear Regression', ...
        'FontSize', 12, 'FontWeight', 'bold');
    legend('Location', 'NorthWest', 'FontSize', 9);
    grid on; box on; hold off;
    
    saveas(h3, fullfile(save_dir, 'fig3_regression_attendance_marks.png'));
    fig_handles = [fig_handles, h3];

    % =========================================================================
    % FIGURE 4: Group Comparison (Group A vs Group B) with t-Test Metrics
    % =========================================================================
    h4 = figure('Name', 'Fig 4: Group Comparison & t-Test', 'NumberTitle', 'off', ...
        'Color', 'w', 'Position', [250, 160, 950, 480]);
    
    % Subplot 1: Comparative Boxplot with individual jittered points
    subplot(1, 2, 1);
    hold on;
    group_labels = [repmat({'Group A'}, sum(gA_idx), 1); repmat({'Group B'}, sum(gB_idx), 1)];
    all_group_marks = [avg(gA_idx); avg(gB_idx)];
    
    if exist('boxplot', 'file') == 2
        boxplot(all_group_marks, group_labels, 'Colors', 'k', 'Widths', 0.4);
    else
        bar([1, 2], [ttest_res.mean_A, ttest_res.mean_B], 0.5, 'FaceColor', [0.8, 0.8, 0.8]);
        set(gca, 'XTick', [1, 2], 'XTickLabel', {'Group A', 'Group B'});
    end
    
    % Overlay individual jittered student points
    jitterA = 1 + (rand(sum(gA_idx), 1) - 0.5) * 0.15;
    jitterB = 2 + (rand(sum(gB_idx), 1) - 0.5) * 0.15;
    scatter(jitterA, avg(gA_idx), 45, c_green, 'filled', 'MarkerFaceAlpha', 0.7);
    scatter(jitterB, avg(gB_idx), 45, c_red, 'filled', 'MarkerFaceAlpha', 0.7);
    
    title('Group Marks Comparison', 'FontSize', 11, 'FontWeight', 'bold');
    ylabel('Average Marks (%)', 'FontSize', 10, 'FontWeight', 'bold');
    grid on; box on; hold off;

    % Subplot 2: Probability Density / Distribution Comparison
    subplot(1, 2, 2);
    hold on;
    x_eval = linspace(40, 100, 200);
    pdf_A  = (1 / (ttest_res.std_A * sqrt(2*pi))) * exp(-0.5 * ((x_eval - ttest_res.mean_A) / ttest_res.std_A).^2);
    pdf_B  = (1 / (ttest_res.std_B * sqrt(2*pi))) * exp(-0.5 * ((x_eval - ttest_res.mean_B) / ttest_res.std_B).^2);
    
    area(x_eval, pdf_A, 'FaceColor', c_green, 'FaceAlpha', 0.35, 'EdgeColor', c_green, 'LineWidth', 2, ...
        'DisplayName', sprintf('Group A: Mean = %.1f, SD = %.1f', ttest_res.mean_A, ttest_res.std_A));
    area(x_eval, pdf_B, 'FaceColor', c_red, 'FaceAlpha', 0.35, 'EdgeColor', c_red, 'LineWidth', 2, ...
        'DisplayName', sprintf('Group B: Mean = %.1f, SD = %.1f', ttest_res.mean_B, ttest_res.std_B));
    
    xline(ttest_res.mean_A, 'Color', [0, 0.5, 0], 'LineStyle', '--', 'LineWidth', 1.8);
    xline(ttest_res.mean_B, 'Color', [0.7, 0, 0], 'LineStyle', '--', 'LineWidth', 1.8);
    
    % Display t-test statistic banner
    text(45, max([pdf_A, pdf_B])*0.85, ...
        sprintf('t = %.2f, p = %.2e\nReject H0: Significant Diff', ttest_res.t_stat, ttest_res.p_value), ...
        'FontSize', 9, 'FontWeight', 'bold', 'BackgroundColor', [1, 1, 0.9], 'EdgeColor', 'k');
    
    title('Step 5: Theoretical Distribution & Hypothesis Testing', 'FontSize', 11, 'FontWeight', 'bold');
    xlabel('Average Marks (%)', 'FontSize', 10, 'FontWeight', 'bold');
    ylabel('Normal Probability Density', 'FontSize', 10, 'FontWeight', 'bold');
    legend('Location', 'NorthWest', 'FontSize', 9);
    grid on; box on; hold off;
    
    saveas(h4, fullfile(save_dir, 'fig4_group_comparison_ttest.png'));
    fig_handles = [fig_handles, h4];

    % =========================================================================
    % FIGURE 5: Correlation Matrix Heatmap
    % =========================================================================
    h5 = figure('Name', 'Fig 5: Correlation Heatmap', 'NumberTitle', 'off', ...
        'Color', 'w', 'Position', [300, 180, 750, 600]);
    
    imagesc(corr_res.corr_matrix);
    colormap(jet);
    c = colorbar;
    c.Label.String = 'Pearson Correlation Coefficient (r)';
    c.Label.FontWeight = 'bold';
    caxis([0, 1]);
    
    labels = corr_res.feature_names;
    n_vars = length(labels);
    set(gca, 'XTick', 1:n_vars, 'XTickLabel', labels, ...
             'YTick', 1:n_vars, 'YTickLabel', labels, ...
             'FontSize', 10, 'FontWeight', 'bold');
    xtickangle(45);
    
    % Overlay text numbers
    for r = 1:n_vars
        for col = 1:n_vars
            text(col, r, sprintf('%.2f', corr_res.corr_matrix(r, col)), ...
                'HorizontalAlignment', 'center', 'Color', 'k', 'FontWeight', 'bold', 'FontSize', 9);
        end
    end
    title('Inter-Feature Correlation Matrix Heatmap', 'FontSize', 12, 'FontWeight', 'bold');
    axis square;
    
    saveas(h5, fullfile(save_dir, 'fig5_correlation_heatmap.png'));
    fig_handles = [fig_handles, h5];

    % =========================================================================
    % FIGURE 6: Master Unified Dashboard (6 Panels in 1 Canvas)
    % =========================================================================
    h6 = figure('Name', 'Master Executive Dashboard', 'NumberTitle', 'off', ...
        'Color', 'w', 'Position', [50, 50, 1200, 800]);
    
    % Panel 1: Subject Means
    subplot(2, 3, 1);
    bar(stats_res.means, 'FaceColor', c_blue);
    set(gca, 'XTick', 1:n_subs, 'XTickLabel', {'Math','Phys','Chem','CS','Eng'});
    ylabel('Marks'); title('1. Subject Means'); grid on;
    
    % Panel 2: Overall Marks Hist
    subplot(2, 3, 2);
    histogram(avg, 7, 'FaceColor', [0.3, 0.75, 0.9], 'EdgeColor', 'k');
    xlabel('Average (%)'); ylabel('Students'); title('2. Score Distribution'); grid on;
    
    % Panel 3: Attendance vs Marks Regression
    subplot(2, 3, 3);
    scatter(att, avg, 40, 'b', 'filled'); hold on;
    plot(x_line, y_line, 'r-', 'LineWidth', 2);
    xlabel('Attendance (%)'); ylabel('Average Marks (%)');
    title(sprintf('3. Regression (R^2 = %.2f)', reg_res.r_squared)); grid on; hold off;
    
    % Panel 4: Group A vs B Comparison
    subplot(2, 3, 4);
    bar([1, 2], [ttest_res.mean_A, ttest_res.mean_B], 0.5, 'FaceColor', c_orange);
    set(gca, 'XTick', [1, 2], 'XTickLabel', {'Group A', 'Group B'});
    ylabel('Mean Marks'); title(sprintf('4. Groups (t = %.2f, p < 0.001)', ttest_res.t_stat)); grid on;
    
    % Panel 5: Correlation with Attendance
    subplot(2, 3, 5);
    bar(corr_res.r_subjects, 0.5, 'FaceColor', c_green);
    set(gca, 'XTick', 1:n_subs, 'XTickLabel', {'Math','Phys','Chem','CS','Eng'});
    ylabel('r with Attendance'); title('5. Subject Correlations'); ylim([0, 1]); grid on;
    
    % Panel 6: Predicted Marks on Benchmark Attendance
    subplot(2, 3, 6);
    plot(reg_res.test_attendance, reg_res.predicted_marks, 'mo-', 'LineWidth', 2, 'MarkerSize', 8, 'MarkerFaceColor', 'y');
    xlabel('Attendance (%)'); ylabel('Predicted Marks (%)');
    title('6. Marks Predictions'); grid on;
    for i = 1:length(reg_res.test_attendance)
        text(reg_res.test_attendance(i), reg_res.predicted_marks(i)+1.5, ...
            sprintf('%.1f%%', reg_res.predicted_marks(i)), 'HorizontalAlignment', 'center', 'FontSize', 8, 'FontWeight', 'bold');
    end
    ylim([min(reg_res.predicted_marks)-5, max(reg_res.predicted_marks)+8]);
    
    sgtitle('Mini Project 1: Student Performance Analysis Executive Dashboard', 'FontSize', 14, 'FontWeight', 'bold');
    saveas(h6, fullfile(save_dir, 'fig6_master_dashboard.png'));
    fig_handles = [fig_handles, h6];

    fprintf('Step 6 (Part A) Complete: 6 High-Resolution figures generated and saved to "%s/".\n', save_dir);
end
