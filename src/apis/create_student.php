<?php
require_once __DIR__ . '/config.php';

$data = json_decode(file_get_contents('php://input'), true);
if (!$data) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid JSON"]);
    exit;
}

$first = $conn->real_escape_string($data['first_name'] ?? '');
$last = $conn->real_escape_string($data['last_name'] ?? '');
$email = $conn->real_escape_string($data['email'] ?? '');
$dept = $conn->real_escape_string($data['dept'] ?? '');
$student_id = $conn->real_escape_string($data['student_id'] ?? '');
$cgpa = isset($data['cgpa']) && $data['cgpa'] !== null ? floatval($data['cgpa']) : null;
$semester = $conn->real_escape_string($data['semester'] ?? '');

if (!$first || !$last || !$email || !$student_id) {
    http_response_code(400);
    echo json_encode(["error" => "Missing required fields"]);
    exit;
}

// Insert into user table
$stmt = $conn->prepare("INSERT INTO user (First_Name, Last_Name, `E-mail`, Dept, Is_guest) VALUES (?, ?, ?, ?, 0)");
if (!$stmt) {
    http_response_code(500);
    echo json_encode(["error" => "Prepare failed: " . $conn->error]);
    exit;
}
$stmt->bind_param('ssss', $first, $last, $email, $dept);
if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(["error" => "Insert user failed: " . $stmt->error]);
    exit;
}
$user_id = $conn->insert_id;
$stmt->close();

// Insert into regular_student
$student_id_int = intval($student_id);
if ($cgpa === null) {
    $stmt2 = $conn->prepare("INSERT INTO regular_student (User_id, Student_id, CGPA, Semester, Advisor_id, Status) VALUES (?, ?, NULL, ?, NULL, 'active')");
    if (!$stmt2) {
        http_response_code(500);
        echo json_encode(["error" => "Prepare failed: " . $conn->error]);
        exit;
    }
    $stmt2->bind_param('iis', $user_id, $student_id_int, $semester);
} else {
    $stmt2 = $conn->prepare("INSERT INTO regular_student (User_id, Student_id, CGPA, Semester, Advisor_id, Status) VALUES (?, ?, ?, ?, NULL, 'active')");
    if (!$stmt2) {
        http_response_code(500);
        echo json_encode(["error" => "Prepare failed: " . $conn->error]);
        exit;
    }
    $stmt2->bind_param('iids', $user_id, $student_id_int, $cgpa, $semester);
}

if (!$stmt2->execute()) {
    http_response_code(500);
    echo json_encode(["error" => "Insert student failed: " . $stmt2->error]);
    exit;
}
$stmt2->close();

echo json_encode(["success" => true, "user_id" => $user_id]);
