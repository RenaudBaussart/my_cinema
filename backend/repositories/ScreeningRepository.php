<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ .'/../model/Screening.php';
class ScreeningRepository {
    private $pdo;

    public function __construct() {
        global $pdo;
        if (!$pdo) {
            throw new Exception(message: "La connexion à la base de données a échoué.");
        }
        $this->pdo = $pdo;
    }
        #region Create
    public function add(Screening $screening): void{
        $statement = $this->pdo->prepare(query: "INSERT INTO screenings (is_deleted, start_time, room_id, movie_id) VALUES (?, ?, ?, ?)");
        $statement->execute(params:[
            $screening->is_deleted,
            $screening->start_time,
            $screening->room_id,
            $screening->movie_id
        ]);
    }
    #endregion
    #region Read
    public function getAll(): array {
        $statement = $this->pdo->query(query: "SELECT s.*, m.title as movie_title, r.name as room_name FROM screenings s JOIN movies m ON s.movie_id = m.id JOIN rooms r ON s.room_id = r.id WHERE s.is_deleted = 0 AND m.is_deleted = 0 AND r.active = 1");
        return $statement->fetchall(mode: PDO::FETCH_ASSOC);
    }
    public function getById(int $id): Screening {
        $statement = $this->pdo->prepare(query: "SELECT * FROM screenings WHERE id = ?");
        $statement->execute(params: [$id]);
        $screening = $statement->fetchObject(class: "Screening");
        return $screening;
    }
    public function getAllActive(): array {
        $statement = $this->pdo->query(query: "SELECT * FROM screenings WHERE is_deleted = 0");
        return $statement->fetchall(mode: PDO::FETCH_CLASS, column:'Screening');
    }
    public function getAllInactive(): array {
        $statement = $this->pdo->query(query: "SELECT * FROM screenings WHERE is_deleted = 1");
        return $statement->fetchall(mode: PDO::FETCH_CLASS, column:'Screening');
    }
    #endregion
    #region Update
    public function update(Screening $screening): bool {
        $statement = $this->pdo->prepare(query: "UPDATE screenings SET is_deleted = ?, start_time = ?, room_id = ?, movie_id = ? WHERE id = ?");
        return $statement->execute(params: [
            $screening->is_deleted,
            $screening->start_time,
            $screening->room_id,
            $screening->movie_id,
            $screening->id
        ]);
    }
    #endregion
    #region Delete
    public function remove(Screening $screening): bool {
        $statement = $this->pdo->prepare(query: "UPDATE screenings SET is_deleted = 1 WHERE id = ?");
        $statement->execute(params: [$screening->id]);
        return $statement->rowCount() > 0;
    }
    public function restore(Screening $screening): bool {
        $statement = $this->pdo->prepare(query: "UPDATE screenings SET is_deleted = 0 WHERE id = ?");
        $statement->execute(params: [$screening->id]);
        return $statement->rowCount() > 0;
    }
    #endregion

}
?>