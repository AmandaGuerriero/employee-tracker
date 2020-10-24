use employees_db;

INSERT INTO departments
    (name)
VALUES
    ('Parks'),
    ('Recreation'),
    ('Other');

INSERT INTO roles
    (title, salary, department_id)
VALUES
    ('Park Director', 100000, 1),
    ('Marketing Manager', 85000, 1),
    ('Nurse', 90000, 3),
    ('City Planner', 90000, 2),
    ('Recreation Director', 80000, 2),
    ('Secretary', 50000, 3),
    ('Receptionist', 50000, 2),
    ('Shoe Shiner', 12000, 3),
    ('Park Worker', 60000, 1);

INSERT INTO employees
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Leslie', 'Knope', 1, NULL),
    ('Ron', 'Swanson', 2, NULL),
    ('Mark', 'Brendanawicz', 3, NULL),
    ('Ann', 'Perkins', 4, 1),
    ('Tom', 'Haverford', 5, 1),
    ('April', 'Ludgate', 6, 2),
    ('Donna', 'Meagle', 7, 1),
    ('Andy', 'Dwyer', 8, NULL),
    ('Garry', 'Gergich', 9, 2);