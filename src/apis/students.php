<?php
require_once __DIR__ . '/config.php';
$res = $conn->query("
  SELECT s.User_id AS user_id, s.Student_id AS student_id, s.CGPA AS cgpa,
         s.Semester AS semester, s.Advisor_id AS advisor_id, s.Booking_id AS booking_id,
         s.Status AS status,
         CONCAT(u.First_Name, ' ', u.Last_Name) AS name, u.`E-mail` AS email, u.Dept AS dept
  FROM regular_student s
  JOIN user u ON u.User_id = s.User_id
");
$rows = [];
while ($r = $res->fetch_assoc()) $rows[] = $r;
echo json_encode($rows);
