<?php
require_once __DIR__ . '/../repositories/MovieRepository.php';
require_once __DIR__ . '/../class/Response.php';
class MovieController {
    private $repository ;
    public function __construct () {
        $this -> repository = new MovieRepository () ; // repository créé par la suite
    }
    #region Create
    public function addMovie(Movie $movie){
        try {
        $this->repository->add($movie);
        $response = new Response("success", "Le film a été ajouté avec succès !");
    } catch (Exception $e) {
        $response = new Response("error", "Impossible d'ajouter le film : " . $e->getMessage());
    }
    echo json_encode($response);
    }
    #endregion
    #region Read
    public function list () { // Méthode appelée par le fichier index . php
        $movies = $this->repository->getAll();
        $response = new Response("success", $movies);
        echo json_encode($response);
    }
    #endregion
    #region Update
    public function updateMovie(int $id, Movie $updatedMovie) {
    $existingMovie = $this->repository->getById($id);

    if ($existingMovie) {
        $existingMovie->title = $updatedMovie->title;
        $existingMovie->description = $updatedMovie->description;
        $existingMovie->duration = $updatedMovie->duration;
        $existingMovie->release_year = $updatedMovie->release_year;
        $existingMovie->genre = $updatedMovie->genre;
        $existingMovie->director = $updatedMovie->director;
        $success = $this->repository->update($existingMovie);
        if ($success) {
            $response = new Response("success", "Film mis à jour avec succès");
        } else {
            $response = new Response("error", "Échec de la mise à jour du film");
        }
    } else {
        $response = new Response("error", "Film introuvable");
    }
        echo json_encode($response);
    }
    
    #endregion
    #region Delete
    public function deleteMovie(Movie $movie) {
        $repoReturn = $this->repository->remove($movie) ;
        $response;
        if($repoReturn === true){
            $response = new Response("success", "Film supprimé !");
        }
        else{
            $response = new Response("error", "ce film n'existe pas en base de données.");
        }
        echo json_encode($response);
    }
    #endregion
    
}
?>