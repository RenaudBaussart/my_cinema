<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ .'/../model/Room.php';
class RoomRepository {
    private $pdo;

    public function __construct() {
        global $pdo;
        if (!$pdo) {
            throw new Exception(message: "La connexion à la base de données a échoué.");
        }
        $this->pdo = $pdo;
    }
    #region Create
    public function add(Room $room): void{
        $statement = $this->pdo->prepare(query: "INSERT INTO rooms (name, capacity, type) VALUES (?, ?, ?)");
        $statement->execute(params:[
            $room->name,
            $room->capacity,
            $room->type
        ]);
    }
    #endregion
    #region Read
    public function getAll(): array {
        $statement = $this->pdo->query(query: "SELECT * FROM rooms");
        $statement->setFetchMode(PDO::FETCH_CLASS, 'Room');
        return $statement->fetchAll();
    }
    public function getById(int $id): Room {
        $statement = $this->pdo->prepare(query: "SELECT * FROM rooms WHERE id = ?");
        $statement->execute(params: [$id]);
        $room = $statement->fetchObject(class: "Room");
        return $room;
    }
    public function getAllActive(): array {
        $statement = $this->pdo->query(query: "SELECT * FROM rooms WHERE active = 1");
        $statement->setFetchMode(PDO::FETCH_CLASS, 'Room');
        return $statement->fetchAll();
    }
    public function getAllInactive(): array {
        $statement = $this->pdo->query(query: "SELECT * FROM rooms WHERE active = 0");
        $statement->setFetchMode(PDO::FETCH_CLASS, 'Room');
        return $statement->fetchAll();
    }
    #endregion
    #region Update
    public function update(Room $room): bool {
        $statement = $this->pdo->prepare(query: "UPDATE rooms SET name = ?, capacity = ?, type = ? WHERE id = ?");
        return $statement->execute(params: [
            $room->name,
            $room->capacity,
            $room->type,
            $room->id
        ]);
    }
    #endregion
    #region Delete
    public function deactivate(Room $room): bool {
        $statement = $this->pdo->prepare(query: "UPDATE rooms SET active = 0 WHERE id = ?");
        return $statement->execute(params: [$room->id]);
        
    }
    public function activate(Room $room): bool {
        $statement = $this->pdo->prepare(query: "UPDATE rooms SET active = 1 WHERE id = ?");
        return $statement->execute(params: [$room->id]);
    }
    public function delete(Room $room): bool {
        $statement = $this->pdo->prepare(query: "DELETE FROM rooms WHERE id = ?");
        return $statement->execute(params: [$room->id]);
    }
    #endregion
}
?>