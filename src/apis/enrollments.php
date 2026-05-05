<?php
require_once __DIR__ . '/config.php';
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $sid = isset($_GET['student_id']) ? intval($_GET['student_id']) : null;
    $sql = "SELECT Student_id AS student_id, Course_code AS course_code, semester, grade, grade_point, status FROM enrollment";
    if ($sid) $sql .= " WHERE Student_id = $sid";
    $res = $conn->query($sql);
    $rows = [];
    while ($r = $res->fetch_assoc()) $rows[] = $r;
    echo json_encode($rows);
} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $stmt = $conn->prepare("INSERT INTO enrollment (Student_id, Course_code, semester, grade, grade_point, status) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("isisds", $data['student_id'], $data['course_code'], $data['semester'], $data['grade'], $data['grade_point'], $data['status']);
    $stmt->execute();
    echo json_encode(["success" => true]);
}
