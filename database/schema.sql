CREATE DATABASE IF NOT EXISTS hostel_portal
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hostel_portal;

-- Users table (unified)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  google_sub VARCHAR(64) UNIQUE NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  role ENUM('student','employee','admin') NOT NULL DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Employees (subset of users)
CREATE TABLE IF NOT EXISTS employees (
  id INT PRIMARY KEY,                -- FK to users.id
  specialization ENUM('Electrical','Plumbing','Carpentry','Other') NOT NULL,
  availability ENUM('available','busy') NOT NULL DEFAULT 'available',
  FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Faults reported by Students
CREATE TABLE IF NOT EXISTS faults (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,           -- FK to users.id (student)
  name VARCHAR(255) NOT NULL,
  reg_no VARCHAR(64) NOT NULL,
  hostel_name VARCHAR(128) NOT NULL,
  floor VARCHAR(32) NOT NULL,
  description TEXT,
  image_path VARCHAR(512),
  predicted_category ENUM('plumbing','electrical','carpentry','other') DEFAULT 'other',
  status ENUM('pending','in-progress','resolved') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Assignments (Admin → Employee)
CREATE TABLE IF NOT EXISTS assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fault_id INT NOT NULL,
  employee_id INT NOT NULL,          -- FK to users.id (employee)
  assigned_by INT NOT NULL,          -- FK to users.id (admin)
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  started_at TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  FOREIGN KEY (fault_id) REFERENCES faults(id) ON DELETE CASCADE,
  FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE INDEX idx_faults_student ON faults(student_id);
CREATE INDEX idx_assignments_fault ON assignments(fault_id);
