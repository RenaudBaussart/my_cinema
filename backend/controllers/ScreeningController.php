<?php
require_once __DIR__ . '/../repositories/ScreeningRepository.php';
require_once __DIR__ . '/../class/Response.php';
class ScreeningController{
    private $repository;
    public function __construct(){
        $this->repository = new ScreeningRepository();
    }
    #region Create
    public function addScreening(Screening $screening): void{
        try{
            $this->repository->add(screening: $screening);
            $response = new Response(responseType: "success", responseMessage: "Le screening a été ajouté avec succès !");
        } catch (Exception $e){
            $response = new Response(responseType: "error", responseMessage: "Impossible d'ajouter le screening : " . $e->getMessage());
        }
        echo json_encode(value: $response);
    }
    #endregion
    #region Read
    public function list(): void{
        $screening = $this->repository->getAll();
        $response = new Response(responseType: "success", responseMessage: $screening);
        echo json_encode(value: $response);
    }
    #endregion 
    #region Update
    public function updateScreening(Screening $screening): void{
        try{
            $this->repository->update(screening: $screening);
            $response = new Response(responseType: "success", responseMessage: "Le screening a été modifié avec succès !");
        } catch (Exception $e){
            $response = new Response(responseType: "error", responseMessage: "Impossible de modifier le screening : " . $e->getMessage());
        }
        echo json_encode(value: $response);
    }
    #endregion
    #region Delete
    public function deleteScreening(Screening $screening): void{
        $repoReturn = $this->repository->remove(screening: $screening);
        $response = "";
        if($repoReturn === true){
            $response = new Response(responseType: "success", responseMessage: "Screening supprimé !");
        }
        else{
            $response = new Response(responseType: "error", responseMessage: "Ce screening n'existe pas en base de données.");
        }
        echo json_encode(value: $response);
    }
    
}
?>