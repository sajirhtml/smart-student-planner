-- Run this in your MariaDB `scms` database

CREATE TABLE IF NOT EXISTS consultation_booking (
    id INT(11) NOT NULL AUTO_INCREMENT,
    booking_id INT(11) NOT NULL,
    student_id INT(11) NOT NULL,
    topic VARCHAR(255) DEFAULT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'booked',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY fk_cb_booking (booking_id),
    KEY fk_cb_student (student_id),
    CONSTRAINT fk_cb_booking FOREIGN KEY (booking_id) REFERENCES consultation (Booking_id),
    CONSTRAINT fk_cb_student FOREIGN KEY (student_id) REFERENCES student (Student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
