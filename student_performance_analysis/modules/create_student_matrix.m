function student_data = create_student_matrix(csv_file)
% CREATE_STUDENT_MATRIX Implementation Step 1: Create a matrix of student marks
%
% SYNOPSIS:
%   student_data = create_student_matrix(csv_file)
%
% INPUT:
%   csv_file - (Optional) Path to CSV file containing student records.
%              If omitted or not found, internal embedded matrix is loaded.
%
% OUTPUT:
%   student_data - Struct containing:
%       .student_ids   - Cell array of student identifiers (Nx1)
%       .groups        - Cell array of group affiliations ('Group A'/'Group B')
%       .attendance    - Column vector of attendance percentages (Nx1)
%       .marks_matrix  - Numeric matrix of marks in 5 subjects (Nx5)
%       .subject_names - Cell array of subject headers
%       .total_marks   - Sum of marks across all subjects (Nx1)
%       .average_marks - Average percentage marks (Nx1)
%       .groupA_marks  - Average marks of Group A students
%       .groupB_marks  - Average marks of Group B students
%
% SYLLABUS MAPPING: Unit 1 (Matrices, Vectorization, Indexing)

    if nargin < 1 || isempty(csv_file)
        csv_file = 'student_data.csv';
    end

    subject_names = {'Mathematics', 'Physics', 'Chemistry', 'Computer_Science', 'English'};

    if exist(csv_file, 'file') == 2
        % Load from CSV file
        fprintf('Loading student data from: %s ...\n', csv_file);
        T = readtable(csv_file);
        student_ids = T.StudentID;
        if iscell(T.Group)
            groups = T.Group;
        else
            groups = cellstr(T.Group);
        end
        attendance = T.Attendance;
        marks_matrix = [T.Mathematics, T.Physics, T.Chemistry, T.Computer_Science, T.English];
    else
        % Fallback embedded matrix (50 students, 5 subjects)
        fprintf('CSV file not found. Loading embedded 50x5 reference dataset...\n');
        rng(101, 'twister');
        n = 50;
        student_ids = arrayfun(@(x) sprintf('STU_%03d', x), (1:n)', 'UniformOutput', false);
        groups = cell(n, 1);
        groups(1:25) = {'Group A'};
        groups(26:50) = {'Group B'};
        
        att_A = max(68.0, min(98.0, 84.0 + 6.0 * randn(25, 1)));
        att_B = max(58.0, min(92.0, 73.5 + 7.5 * randn(25, 1)));
        attendance = round([att_A; att_B], 1);
        
        ability = 5.0 * randn(n, 1);
        base = 65.0 + 0.50 * (attendance - 75.0) + ability;
        offsets = [3, -2, 1, 5, 0];
        marks_matrix = zeros(n, 5);
        for j = 1:5
            g_bonus = zeros(n, 1);
            g_bonus(1:25) = 4.0;
            noise = 4.0 * randn(n, 1);
            marks_matrix(:, j) = max(45, min(98, round(base + offsets(j) + g_bonus + noise)));
        end
    end

    % Matrix calculations for Total and Average marks
    % Using Unit 1 matrix operation sum(M, 2) and scalar division
    total_marks = sum(marks_matrix, 2);
    average_marks = round(total_marks / size(marks_matrix, 2), 2);

    % Logical indexing for Group A and Group B
    groupA_mask = strcmp(groups, 'Group A');
    groupB_mask = strcmp(groups, 'Group B');

    % Populate return struct
    student_data.student_ids   = student_ids;
    student_data.groups        = groups;
    student_data.attendance    = attendance;
    student_data.marks_matrix  = marks_matrix;
    student_data.subject_names = subject_names;
    student_data.total_marks   = total_marks;
    student_data.average_marks = average_marks;
    student_data.groupA_mask   = groupA_mask;
    student_data.groupB_mask   = groupB_mask;
    student_data.groupA_marks  = average_marks(groupA_mask);
    student_data.groupB_marks  = average_marks(groupB_mask);
    student_data.n_students    = size(marks_matrix, 1);
    student_data.n_subjects    = size(marks_matrix, 2);

    fprintf('Step 1 Complete: Created %dx%d marks matrix for %d students across %d subjects.\n', ...
        size(marks_matrix, 1), size(marks_matrix, 2), student_data.n_students, student_data.n_subjects);
end
