USE hostel_portal;

-- Admin
INSERT IGNORE INTO users (id, google_sub, email, name, role)
VALUES (1, NULL, 'admin@example.com', 'Portal Admin', 'admin');

-- Employees
INSERT IGNORE INTO users (id, google_sub, email, name, role)
VALUES
  (2, NULL, 'elec1@example.com', 'Elena Electric', 'employee'),
  (3, NULL, 'plumb1@example.com', 'Paul Plumber', 'employee');

INSERT IGNORE INTO employees (id, specialization, availability)
VALUES
  (2, 'Electrical', 'available'),
  (3, 'Plumbing', 'available');

-- Student
INSERT IGNORE INTO users (id, google_sub, email, name, role)
VALUES (4, NULL, 'student1@example.com', 'Sam Student', 'student');

-- Sample faults
INSERT INTO faults (student_id, name, reg_no, hostel_name, floor, description, image_path, predicted_category, status)
VALUES
(4, 'Sam Student', 'REG123', 'Hostel-A', '2', 'Flickering light in room 204', NULL, 'electrical', 'pending'),
(4, 'Sam Student', 'REG123', 'Hostel-A', '2', 'Leaky tap in bathroom', NULL, 'plumbing', 'pending');
