<?php
require_once __DIR__ . '/controllers/MovieController.php';
require_once __DIR__ .'/controllers/RoomController.php';
require_once __DIR__ .'/controllers/ScreeningController.php';
require_once __DIR__ . '/model/Movie.php';
require_once __DIR__ . '/model/Room.php';
$request = $_GET ['action'] ?? ''; // Récupération du paramètre d'URL action indiquant la route API
$movieController = new MovieController();
$roomController = new RoomController();
$screeningController = new ScreeningController();
switch ($request) {
    #region movies
case 'add_movie':
    $movie = new Movie();
    $movie->title = $_POST['title'] ?? '';
    $movie->description = $_POST['description'] ?? '';
    $movie->duration = (int)($_POST['duration'] ?? 0);
    $movie->release_year = (int)($_POST['release_year'] ?? 0);
    $movie->genre = $_POST['genre'] ?? '';
    $movie->director = $_POST['director'] ?? '';
    $movie->is_deleted = 0;
    $movieController->addMovie(movie: $movie);
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
        $movieController->updateMovie(id: (int)$id, updatedMovie: $movieUpdate);
    }
    break;
case 'delete_movie':
    $id = $_GET['id'] ?? null;
    if($id){
        $movie = new Movie();
        $movie->id = $id;
        $movieController->deleteMovie(movie: $movie);
    }
    else{
        echo json_encode(value: new response(responseType: "error", responseMessage: "ID maquant"));
    }
    break;
    #endregion
    #region rooms
case 'add_room':
    $room = new Room();
    $room->name = $_POST['name'] ?? '';
    $room->capacity = (int)($_POST['capacity'] ?? 0);
    $room->type = $_POST['type'] ?? '';
    $roomController->addRoom(room: $room);
    break;
case 'list_rooms':
    $roomController->list();
    break;
case 'update_room':
    $id = $_GET['id'] ?? null;
    if($id){
        $roomUpdate = new Room();
        $roomUpdate->name = $_POST['name'] ?? '';
        $roomUpdate->capacity = (int)($_POST['capacity'] ?? 0);
        $roomUpdate->type = $_POST['type'] ?? '';
        $roomUpdate->id = (int)$id;
        $roomController->updateRoom(room: $roomUpdate);
    }
    else{
        echo json_encode(value: new response(responseType: "error", responseMessage: "ID maquant"));
    }
    break;
case 'delete_room':
    $id = $_GET['id'] ?? null;
    if($id){
        $room = new Room();
        $room->id = $id;
        $roomController->deleteRoom(room: $room);
    }
    else{
        echo json_encode(value: new response(responseType: "error", responseMessage: "ID maquant"));
    }
    break;
    #endregion
    #region screenings
    case "add_screening":
        $screening = new Screening();
        $screening->is_deleted = 0;
        $screening->start_time = $_POST['start_time'] ?? '';
        $screening->room_id = (int)($_POST['room_id'] ?? 0);
        $screening->movie_id = (int)($_POST['movie_id'] ?? 0);
        $screeningController->addScreening(screening: $screening);
        break;
default:
    echo json_encode(value: ["error" => "Action not found"]);
    break;
}
?>