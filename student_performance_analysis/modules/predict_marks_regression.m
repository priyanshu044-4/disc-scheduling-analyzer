function reg_result = predict_marks_regression(student_data, test_attendance_vals)
% PREDICT_MARKS_REGRESSION Implementation Step 4: Simple Linear Regression
%
% SYNOPSIS:
%   reg_result = predict_marks_regression(student_data, test_attendance_vals)
%
% INPUT:
%   student_data         - Struct returned by create_student_matrix()
%   test_attendance_vals - (Optional) Vector of attendance % to predict marks for.
%                          Default: [60, 75, 85, 95]
%
% OUTPUT:
%   reg_result - Struct containing:
%       .slope (beta_1)        - Rate of mark change per 1% attendance
%       .intercept (beta_0)    - Expected mark at 0% attendance
%       .r_squared             - R^2 goodness-of-fit
%       .adj_r_squared         - Adjusted R^2
%       .rmse                  - Root Mean Squared Error
%       .mae                   - Mean Absolute Error
%       .equation_str          - String representation of regression model
%       .test_attendance       - Query attendance points
%       .predicted_marks       - Predicted marks for query points
%       .y_fitted              - In-sample fitted values
%       .residuals             - In-sample prediction residuals
%
% SYLLABUS MAPPING: Unit 4 (Regression Analysis, Least Squares Estimation)

    if nargin < 2 || isempty(test_attendance_vals)
        test_attendance_vals = [60; 75; 85; 95];
    else
        test_attendance_vals = test_attendance_vals(:);
    end

    x = student_data.attendance;
    y = student_data.average_marks;
    N = length(x);

    % Method 1: Ordinary Least Squares (OLS) via Base MATLAB Matrix Left-Division
    % Design matrix X_mat with column of ones for intercept
    X_mat = [ones(N, 1), x];
    beta = X_mat \ y; % Analytical solution: (X'X)^(-1) X'Y
    beta_0 = beta(1); % Intercept
    beta_1 = beta(2); % Slope

    % Method 2 verification: polyfit
    p_poly = polyfit(x, y, 1);
    % p_poly(1) is slope, p_poly(2) is intercept

    % Fitted values and residuals
    y_fitted = X_mat * beta;
    residuals = y - y_fitted;

    % Goodness-of-Fit Metrics
    SS_res = sum(residuals.^2);
    SS_tot = sum((y - mean(y)).^2);
    r_squared = 1 - (SS_res / SS_tot);
    
    k = 1; % Number of predictors
    adj_r_squared = 1 - ((1 - r_squared) * (N - 1) / (N - k - 1));
    rmse = sqrt(SS_res / N);
    mae  = mean(abs(residuals));

    % Make predictions for test attendance values
    X_test = [ones(length(test_attendance_vals), 1), test_attendance_vals];
    predicted_marks = max(0, min(100, X_test * beta));

    % Formulate model equation string
    if beta_0 >= 0
        eq_str = sprintf('Predicted_Marks = %.4f * Attendance + %.4f', beta_1, beta_0);
    else
        eq_str = sprintf('Predicted_Marks = %.4f * Attendance - %.4f', beta_1, abs(beta_0));
    end

    % Populate return struct
    reg_result.slope            = beta_1;
    reg_result.intercept        = beta_0;
    reg_result.r_squared        = r_squared;
    reg_result.adj_r_squared    = adj_r_squared;
    reg_result.rmse             = rmse;
    reg_result.mae              = mae;
    reg_result.equation_str     = eq_str;
    reg_result.test_attendance  = test_attendance_vals;
    reg_result.predicted_marks  = predicted_marks;
    reg_result.y_fitted         = y_fitted;
    reg_result.residuals        = residuals;

    % Display formatted results
    fprintf('\n----------------------------------------------------------------------------------------\n');
    fprintf('  STEP 4: LINEAR REGRESSION MODELING & ACADEMIC PERFORMANCE PREDICTION                 \n');
    fprintf('----------------------------------------------------------------------------------------\n');
    fprintf('Fitted Linear Model        : %s\n', eq_str);
    fprintf('Slope (Beta_1)             : %.4f (Marks gain per +1%% attendance)\n', beta_1);
    fprintf('Intercept (Beta_0)         : %.4f (Baseline performance)\n', beta_0);
    fprintf('Coefficient of Determ. (R2): %.4f (%.2f%% variance explained)\n', r_squared, r_squared*100);
    fprintf('Adjusted R-Squared         : %.4f\n', adj_r_squared);
    fprintf('Root Mean Squared Error    : %.4f marks\n', rmse);
    fprintf('Mean Absolute Error (MAE)  : %.4f marks\n\n', mae);

    fprintf('--- Model Prediction on Benchmark Attendance Levels ---\n');
    fprintf('%-20s %-25s %-20s\n', 'Attendance (%)', 'Predicted Average Mark (%)', 'Expected Performance Band');
    fprintf('--------------------------------------------------------------------------------\n');
    for i = 1:length(test_attendance_vals)
        pred = predicted_marks(i);
        if pred >= 80
            band = 'Distinction / Grade A';
        elseif pred >= 70
            band = 'First Class / Grade B';
        elseif pred >= 60
            band = 'Second Class / Grade C';
        elseif pred >= 50
            band = 'Pass / Grade D';
        else
            band = 'Remedial / Warning';
        end
        fprintf('%-20.1f %-25.2f %-20s\n', test_attendance_vals(i), pred, band);
    end
    fprintf('--------------------------------------------------------------------------------\n\n');
end
