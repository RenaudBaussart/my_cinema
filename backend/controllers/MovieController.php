<?php
require_once __DIR__ . '/../repositories/MovieRepository.php';
require_once __DIR__ . '/../class/Response.php';
class MovieController {
    private $repository ;
    public function __construct () {
        $this->repository = new MovieRepository() ; // repository créé par la suite
    }
    #region Create
    public function addMovie(Movie $movie){
        try {
        $this->repository->add(movie: $movie);
        $response = new Response(responseType: "success", responseMessage: "Le film a été ajouté avec succès !");
    } catch (Exception $e) {
        $response = new Response(responseType: "error", responseMessage: "Impossible d'ajouter le film : " . $e->getMessage());
    }
    echo json_encode(value: $response);
    }
    #endregion
    #region Read
    public function list (): void { // Méthode appelée par le fichier index . php
        $movies = $this->repository->getAllUndeleted();
        $response = new Response(responseType: "success", responseMessage: $movies);
        echo json_encode(value: $response);
    }
    #endregion
    #region Update
    public function updateMovie(int $id, Movie $updatedMovie): void {
    $existingMovie = $this->repository->getById(id: $id);

    if ($existingMovie) {
        $existingMovie->title = $updatedMovie->title;
        $existingMovie->description = $updatedMovie->description;
        $existingMovie->duration = $updatedMovie->duration;
        $existingMovie->release_year = $updatedMovie->release_year;
        $existingMovie->genre = $updatedMovie->genre;
        $existingMovie->director = $updatedMovie->director;
        $success = $this->repository->update(movie: $existingMovie);
        if ($success) {
            $response = new Response(responseType: "success", responseMessage: "Film mis à jour avec succès");
        } else {
            $response = new Response(responseType: "error", responseMessage: "Échec de la mise à jour du film");
        }
    } else {
        $response = new Response(responseType: "error", responseMessage: "Film introuvable");
    }
        echo json_encode(value: $response);
    }
    
    #endregion
    #region Delete
    public function deleteMovie(Movie $movie): void {
        $repoReturn = $this->repository->remove(movie: $movie) ;
        $response = "";
        if($repoReturn === true){
            $response = new Response(responseType: "success", responseMessage: "Film supprimé !");
        }
        else{
            $response = new Response(responseType: "error", responseMessage: "ce film n'existe pas en base de données.");
        }
        echo json_encode(value: $response);
    }
    #endregion
    
}
?>