<?php
include 'config.php';

$sql = "SELECT * FROM reviews";
$result = $conn->query($sql);

$reviews = array();
while($row = $result->fetch_assoc()) {
    $reviews[] = $row;
}

echo json_encode($reviews);

$conn->close();
?>
