<?php
$database_path = __DIR__ . "/pong.db";

try {
    $db = new PDO("sqlite:" . $database_path);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}
?>
