<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../class/Response.php';


class MovieRepository
{
    private $pdo;
    public function __construct() {
    global $pdo;
    if (!$pdo) {
        throw new Exception("La connexion à la base de données a échoué.");
    }
    $this->pdo = $pdo;
    }
    #region CRUD methods
    #region Create
    public function add(Movie $movie): void
    {
        $statement = $this->pdo->prepare(query: "INSERT INTO movies (title, description, duration, release_year, genre, director) VALUES (?, ?, ?, ?, ?, ?)");
        $statement->execute(params: [
            $movie->title,
            $movie->description,
            $movie->duration,
            $movie->release_year,
            $movie->genre,
            $movie->director
        ]);
    }
    #endregion
    #region Read
    public function getAll(): array
    {
        $statement = $this->pdo->query(query: "SELECT * FROM movies");
        return $statement->fetchAll( PDO::FETCH_CLASS,  "Movie");
    }
    public function getAllUndeleted(): array
    {
        $statement = $this->pdo->query(query: "SELECT * FROM movies WHERE is_deleted = 0");
        return $statement->fetchAll( PDO::FETCH_CLASS, "Movie");
    }
    public function getAllDeleted(): array
    {
        $statement = $this->pdo->query(query: "SELECT * FROM movies WHERE is_deleted = 1");
        return $statement->fetchAll( PDO::FETCH_CLASS,  "Movie");
    }
    public function getById(int $id): ?Movie {
        $statement = $this->pdo->prepare("SELECT * FROM movies WHERE id = ?");
        $statement->execute([$id]);
        $movie = $statement->fetchObject("Movie");
        return $movie ?: null;
    }
    #endregion
    #region Update
    public function update(Movie $movie): bool {
    $statement = $this->pdo->prepare("UPDATE movies SET title = ?, description = ?, duration = ?, release_year = ?, genre = ?, director = ? WHERE id = ?");
    return $statement->execute([
        $movie->title,
        $movie->description,
        $movie->duration,
        $movie->release_year,
        $movie->genre,
        $movie->director,
        $movie->id
    ]);
    }
    #endregion
    #region Delete
    public function remove(Movie $movie): bool {
        $statement = $this->pdo->prepare("UPDATE movies SET is_deleted = 1 WHERE id = ?");
        return (bool) $statement->execute([$movie->id]);
    }
    public function restore(Movie $movie): bool {
    $statement = $this->pdo->prepare("UPDATE movies SET is_deleted = 0 WHERE id = ?");
    return $statement->execute([$movie->id]);
    }   
    
    #endregion
    #endregion
}
?>