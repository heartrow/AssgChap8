-- sql/schema.sql
CREATE DATABASE IF NOT EXISTS employee_records
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE employee_records;

DROP TABLE IF EXISTS employees;

CREATE TABLE employees (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    empId       VARCHAR(10),
    name        VARCHAR(120) NOT NULL,
    email       VARCHAR(255) UNIQUE NOT NULL,
    department  VARCHAR(50) NOT NULL,
    position    VARCHAR(30) NOT NULL,
    hireDate    DATE NOT NULL,
    salary      DECIMAL(10, 2),
    active      BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB;

INSERT INTO employees 
    (empId, name, email, department, position, hireDate, salary, active)
VALUES 
    ('EMP001', 'Arisya Osman', 'arisya.o@company.my', 'IT', 
        'Senior Developer', '2023-01-15', 8500.00, TRUE),
    ('EMP002', 'Benjamin Tan', 'ben.tan@company.my', 'Finance', 
        'Accountant', '2022-11-01', 5200.00, TRUE),
    ('EMP003', 'Chloe Lim', 'chloe.l@company.my', 'Marketing', 
        'Content Strategist', '2024-02-10', 4800.00, TRUE),
    ('EMP004', 'Dinesh Kumar', 'dinesh.k@company.my', 'Operations', 
        'Supply Chain Manager', '2021-06-20', 9500.00, TRUE),
    ('EMP005', 'Elena Gilbert', 'elena.g@company.my', 'HR', 
        'HR Assistant', '2023-09-12', 3800.00, FALSE),
    ('EMP006', 'Fahmi Zaki', 'fahmi.z@company.my', 'IT', 
        'Junior Developer', '2024-01-20', 4200.00, TRUE),
    ('EMP007', 'Grace Lee', 'grace.l@company.my', 'Sales', 
        'Sales Associate', '2023-03-28', 4500.00, TRUE);