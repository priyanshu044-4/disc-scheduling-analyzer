%% =========================================================================
% SCRIPT: generate_dataset.m
% TITLE : Synthetic Student Performance Dataset Generator for MATLAB
% COURSE: Engineering / Computing - Mini Project 1
% MAPPING: Units 1, 3, and 4
%
% PURPOSE:
%   Generates a realistic dataset of 50 students across 5 subjects,
%   with attendance records and two student groups (Group A and Group B).
%   Saves the generated data to 'student_data.csv'.
%
% OUTPUT:
%   student_data.csv - CSV containing StudentID, Group, Attendance,
%                      Mathematics, Physics, Chemistry, Computer_Science,
%                      English, Total, Average
% =========================================================================

clc;
clear;

fprintf('=====================================================\n');
fprintf('  Generating Student Performance Dataset (N = 50)   \n');
fprintf('=====================================================\n\n');

% Set reproducible random seed
rng(101, 'twister');

n = 50;
student_ids = arrayfun(@(x) sprintf('STU_%03d', x), (1:n)', 'UniformOutput', false);

% Group assignment: First 25 in Group A, remaining 25 in Group B
groups = cell(n, 1);
groups(1:25) = {'Group A'};
groups(26:50) = {'Group B'};

% Generate attendance (%): Group A has higher mean attendance (~84%), Group B (~73.5%)
att_A = 84.0 + 6.0 * randn(25, 1);
att_A = max(68.0, min(98.0, att_A));

att_B = 73.5 + 7.5 * randn(25, 1);
att_B = max(58.0, min(92.0, att_B));

attendance = round([att_A; att_B], 1);

% Base academic performance correlated with attendance
ability = 5.0 * randn(n, 1);
base = 65.0 + 0.50 * (attendance - 75.0) + ability;

% 5 Core Subjects
subject_names = {'Mathematics', 'Physics', 'Chemistry', 'Computer_Science', 'English'};
offsets = [3, -2, 1, 5, 0];
marks_matrix = zeros(n, 5);

for j = 1:5
    group_bonus = zeros(n, 1);
    group_bonus(1:25) = 4.0; % Group A slight performance advantage (tutorials/intervention)
    sub_noise = 4.0 * randn(n, 1);
    raw_marks = round(base + offsets(j) + group_bonus + sub_noise);
    marks_matrix(:, j) = max(45, min(98, raw_marks));
end

% Calculate Total and Average Marks
total_marks = sum(marks_matrix, 2);
average_marks = round(total_marks / 5, 2);

% Build MATLAB Table
T = table(student_ids, groups, attendance, ...
    marks_matrix(:, 1), marks_matrix(:, 2), marks_matrix(:, 3), marks_matrix(:, 4), marks_matrix(:, 5), ...
    total_marks, average_marks, ...
    'VariableNames', {'StudentID', 'Group', 'Attendance', ...
    'Mathematics', 'Physics', 'Chemistry', 'Computer_Science', 'English', ...
    'Total', 'Average'});

% Export to CSV
output_csv = 'student_data.csv';
writetable(T, output_csv);
fprintf('Dataset successfully generated and saved to: %s\n', output_csv);
fprintf('Total Students: %d\n', n);
fprintf('Total Subjects: %d (%s)\n', length(subject_names), strjoin(subject_names, ', '));
fprintf('Attendance Mean: %.2f%% (Range: %.1f%% - %.1f%%)\n', mean(attendance), min(attendance), max(attendance));
fprintf('Overall Marks Mean: %.2f (Range: %.2f - %.2f)\n\n', mean(average_marks), min(average_marks), max(average_marks));
