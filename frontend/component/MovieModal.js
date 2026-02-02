export default class MovieModal {
    static instance = null;
    isOpen = false;

    constructor() {
        if (MovieModal.instance) {
            return MovieModal.instance;
        }
        MovieModal.instance = this;
    }

    modifyMovie(){
        
    }
    closeModify(){

    }
}