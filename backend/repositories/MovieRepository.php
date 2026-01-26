<?php
class MovieRepository
{
    private $pdo;
    public function __construct()
    {
        global $pdo;
        $this->pdo = $pdo;
    }
    public function getAll(): array
    {
        $stmt = $this->pdo->query(query: "SELECT * FROM movies");
        return $stmt->fetchAll(mode: PDO::FETCH_CLASS, column: "Movie");
    }
    public function add(Movie $movie)
    {
        $stmt = $this->pdo->prepare(query: "INSERT INTO movies (title, description, duration, release_year, genre, director) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute(params: [
            $movie->title,
            $movie->description,
            $movie->duration,
            $movie->release_year,
            $movie->genre,
            $movie->director
        ]);
    }
    public function remove(Movie $movie){
        
    }
    // Méthodes update , delete , find , etc similaires
}
?>