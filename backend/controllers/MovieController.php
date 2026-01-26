<?php
class MovieController {
    private $repository ;
    public function __construct () {
        $this -> repository = new MovieRepository () ; // repository créé par la suite
    }

    public function list () { // Méthode appelée par le fichier index . php
        echo json_encode ($this->repository->getAll()) ;
    }
    // Autres méthodes correspondant aux autres routes API .
}
?>