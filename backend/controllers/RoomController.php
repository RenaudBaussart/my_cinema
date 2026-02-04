<?php
require_once __DIR__ . '/../repositories/RoomRepository.php';
require_once __DIR__ . '/../class/Response.php';
Class RoomController{
    private $repository;
    public function __construct(){
        $this->repository = new RoomRepository();
    }
    #region Create
    public function addRoom(Room $room): void{
        try{
            $this->repository->add(room: $room);
            $response = new Response(responseType: "success", responseMessage: "La salle a été ajoutée avec succès !");
        } catch (Exception $e){
            $response = new Response(responseType: "error", responseMessage: "Impossible d'ajouter la salle : " . $e->getMessage());
        }
        echo json_encode(value: $response);
    }
    #endregion
    #region Read
    public function list(): void{
        $rooms = $this->repository->getAllActive();
        $response = new Response(responseType: "success", responseMessage: $rooms);
        echo json_encode(value: $response);
    }
    #endregion 
    #region Update
    public function updateRoom(Room $room): void{
        try{
            $repoReturn = $this->repository->update(room: $room);
            if($repoReturn === true){
                $response = new Response(responseType: "success", responseMessage: "La salle a été modifiée avec succès !");
            } else {
                $response = new Response(responseType: "error", responseMessage: "Cette salle n'existe pas en base de données.");
            }
        } catch (Exception $e){
            $response = new Response(responseType: "error", responseMessage: "Impossible de modifier la salle : " . $e->getMessage());
        }
        echo json_encode(value: $response);
    }
    #endregion
    #region Delete
    public function deleteRoom(Room $room): void{
        $repoReturn = $this->repository->remove(room: $room);
        $response = "";
        if($repoReturn === true){
            $response = new Response(responseType: "success", responseMessage: "Salle supprimée !");
        }
        else{
            $response = new Response(responseType: "error", responseMessage: "Cette salle n'existe pas en base de données.");
        }
        echo json_encode(value: $response);
    }

}
?>