<?php
include 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $road = $_POST['road'];
    $rating = $_POST['rating'];
    $review = $_POST['review'];
    $user = $_POST['user'];
    $lat = $_POST['lat'];
    $lng = $_POST['lng'];

    $sql = "INSERT INTO reviews (road, rating, review, user, lat, lng) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sissdd", $road, $rating, $review, $user, $lat, $lng);

    if ($stmt->execute()) {
        echo "Review submitted successfully";
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
} else {
    echo "Invalid request method";
}
?>
