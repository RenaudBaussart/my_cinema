<?php
require_once __DIR__ . '/controllers/MovieController.php';
require_once __DIR__ . '/model/Movie.php';
$request = $_GET ['action'] ?? ''; // Récupération du paramètre d'URL action indiquant la route API
$movieController = new MovieController();
switch ($request ) {
case 'add_movie':
    $movie = new Movie();
    $movie->title = $_POST['title'] ?? '';
    $movie->description = $_POST['description'] ?? '';
    $movie->duration = (int)($_POST['duration'] ?? 0);
    $movie->release_year = (int)($_POST['release_year'] ?? 0);
    $movie->genre = $_POST['genre'] ?? '';
    $movie->director = $_POST['director'] ?? '';
    $movie->is_deleted = 0;
    $movieController->addMovie($movie);
    break;
case 'list_movies':
    $movieController->list();
    break;
case 'update_movie':
    $id = $_GET['id'] ?? null;
    if ($id) {
        $movieUpdate = new Movie();
        $movieUpdate->title = $_POST['title'] ?? '';
        $movieUpdate->description = $_POST['description'] ?? '';
        $movieUpdate->duration = $_POST['duration'] ?? 0;
        $movieUpdate->release_year = $_POST['release_year'] ?? 0;
        $movieUpdate->genre = $_POST['genre'] ?? '';
        $movieUpdate->director = $_POST['director'] ?? '';
        $movieController->updateMovie((int)$id, $movieUpdate);
    }
    break;
case 'delete_movie':
    $id = $_GET['id'] ?? null;
    if($id){
        $movie = new Movie();
        $movie->id = $id;
        $movieController->deleteMovie($movie);
    }
    else{
        echo json_encode(new response("error", "ID maquant"));
    }
    break;
default:
    echo json_encode(value: ["error" => "Action not found"]);
    break;
}
?>