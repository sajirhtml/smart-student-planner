<?php
require_once __DIR__ . '/config.php';
$res = $conn->query("SELECT User_id AS user_id, CONCAT(First_Name, ' ', Last_Name) AS name, `E-mail` AS email, Dept AS dept, Is_guest AS is_guest FROM user");
$rows = [];
while ($r = $res->fetch_assoc()) $rows[] = $r;
echo json_encode($rows);
