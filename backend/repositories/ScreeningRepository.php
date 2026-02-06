<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../model/Screening.php';
require_once __DIR__ . '/../services/ScreeningService.php';
class ScreeningRepository
{
    private $pdo;

    public function __construct()
    {
        global $pdo;
        if (!$pdo) {
            throw new Exception(message: "La connexion à la base de données a échoué.");
        }
        $this->pdo = $pdo;
    }
    #region Create
    public function add(Screening $screening): void
    {
        $stmt = $this->pdo->prepare("SELECT duration FROM movies WHERE id = ?");
        $stmt->execute([$screening->movie_id]);
        $movie = $stmt->fetch(PDO::FETCH_ASSOC);

        $stmtRoom = $this->pdo->prepare("SELECT name FROM rooms WHERE id = ?");
        $stmtRoom->execute([$screening->room_id]);
        $room = $stmtRoom->fetch(PDO::FETCH_ASSOC);

        $endTime = ScreeningService::addMinutesToDate($screening->start_time, (int) $movie['duration']);
        $existing = $this->getAllScreeningByRoomName($room['name']);
        error_log("[ScreeningRepository::add] room={$room['name']} newStart={$screening->start_time} newEnd={$endTime} existing=".json_encode($existing));
        $available = ScreeningService::isRoomAvailable($existing, $screening->start_time, $endTime);
        error_log("[ScreeningRepository::add] isRoomAvailable=".($available ? 'true' : 'false'));
        if (!$available) {
            throw new Exception("La salle est déjà occupée sur ce créneau horaire.");
        }
        $statement = $this->pdo->prepare("INSERT INTO screenings (is_deleted, start_time, end_time, room_id, movie_id) VALUES (?, ?, ?, ?, ?)");
        $statement->execute([$screening->is_deleted ?? 0, $screening->start_time, $endTime, $screening->room_id, $screening->movie_id]);
    }
    #endregion
    #region Read
    public function getAll(): array
    {
        $statement = $this->pdo->query(query: "SELECT s.*, m.title as movie_title, r.name as room_name FROM screenings s JOIN movies m ON s.movie_id = m.id JOIN rooms r ON s.room_id = r.id WHERE s.is_deleted = 0 AND m.is_deleted = 0 AND r.active = 1");
        return $statement->fetchall(mode: PDO::FETCH_ASSOC);
    }
    public function getById(int $id): Screening
    {
        $statement = $this->pdo->prepare(query: "SELECT * FROM screenings WHERE id = ?");
        $statement->execute(params: [$id]);
        $screening = $statement->fetchObject(class: "Screening");
        return $screening;
    }
    public function getAllActive(): array
    {
        $statement = $this->pdo->query(query: "SELECT * FROM screenings WHERE is_deleted = 0");
        return $statement->fetchall(PDO::FETCH_CLASS, 'Screening');
    }
    public function getAllInactive(): array
    {
        $statement = $this->pdo->query(query: "SELECT * FROM screenings WHERE is_deleted = 1");
        return $statement->fetchall(PDO::FETCH_CLASS, 'Screening');
    }
    public function getAllScreeningByRoomName(string $roomName): array
    {
        $statement = $this->pdo->prepare(query: "SELECT s.*, m.title as movie_title, r.name as room_name FROM screenings s JOIN movies m ON s.movie_id = m.id JOIN rooms r ON s.room_id = r.id WHERE r.name = ? AND s.is_deleted = 0 AND m.is_deleted = 0 AND r.active = 1");
        $statement->execute(params: [$roomName]);
        return $statement->fetchall(mode: PDO::FETCH_ASSOC);
    }
    #endregion
    #region Update
    public function update(Screening $screening): bool
    {
        $stmt = $this->pdo->prepare("SELECT duration FROM movies WHERE id = ?");
        $stmt->execute([$screening->movie_id]);
        $movie = $stmt->fetch(PDO::FETCH_ASSOC);

        $stmtRoom = $this->pdo->prepare("SELECT name FROM rooms WHERE id = ?");
        $stmtRoom->execute([$screening->room_id]);
        $room = $stmtRoom->fetch(PDO::FETCH_ASSOC);

        $endTime = ScreeningService::addMinutesToDate($screening->start_time, (int) $movie['duration']);

        $existing = $this->getAllScreeningByRoomName($room['name']);
        error_log("[ScreeningRepository::update] room={$room['name']} id={$screening->id} newStart={$screening->start_time} newEnd={$endTime} existing=".json_encode($existing));
        $available = ScreeningService::isRoomAvailable($existing, $screening->start_time, $endTime, $screening->id);
        error_log("[ScreeningRepository::update] isRoomAvailable=".($available ? 'true' : 'false'));
        if (!$available) {
            throw new Exception("La salle est déjà occupée sur ce créneau horaire.");
        }

        $statement = $this->pdo->prepare("UPDATE screenings SET start_time = ?, end_time = ?, room_id = ?, movie_id = ?, is_deleted = ? WHERE id = ?");
        return $statement->execute([$screening->start_time, $endTime, $screening->room_id, $screening->movie_id, $screening->is_deleted, $screening->id]);
    }
    #endregion
    #region Delete
    public function remove(Screening $screening): bool
    {
        $statement = $this->pdo->prepare(query: "UPDATE screenings SET is_deleted = 1 WHERE id = ?");
        $statement->execute(params: [$screening->id]);
        return $statement->rowCount() > 0;
    }
    public function restore(Screening $screening): bool
    {
        $statement = $this->pdo->prepare(query: "UPDATE screenings SET is_deleted = 0 WHERE id = ?");
        $statement->execute(params: [$screening->id]);
        return $statement->rowCount() > 0;
    }
    #endregion

}
?>