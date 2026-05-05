<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'GET') {
	$res = $conn->query("SELECT User_id AS user_id, CONCAT(First_Name, ' ', Last_Name) AS name, `E-mail` AS email, Dept AS dept, Is_guest AS is_guest FROM user");
	$rows = [];
	while ($r = $res->fetch_assoc()) $rows[] = $r;
	echo json_encode($rows);
} elseif ($method === 'PUT') {
	$data = json_decode(file_get_contents('php://input'), true);
	if (!$data || !isset($data['user_id'])) {
		http_response_code(400);
		echo json_encode(["error" => "Invalid payload"]);
		exit;
	}
	$stmt = $conn->prepare("UPDATE user SET First_Name = ?, Last_Name = ?, `E-mail` = ?, Dept = ? WHERE User_id = ?");
	if (!$stmt) {
		http_response_code(500);
		echo json_encode(["error" => $conn->error]);
		exit;
	}
	$stmt->bind_param('ssssi', $data['first_name'], $data['last_name'], $data['email'], $data['dept'], $data['user_id']);
	if (!$stmt->execute()) {
		http_response_code(500);
		echo json_encode(["error" => $stmt->error]);
		exit;
	}
	echo json_encode(["success" => true]);
}
