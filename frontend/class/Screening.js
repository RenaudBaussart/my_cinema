import {CustomApiResponse} from "./CustomApiResponse.js";
import {ModalArchitect} from "../component/ModalArchitect.js";
export class Screening{
    id;
    movie_id;
    room_id;
    start_time;
    created_at;
    movie_title;
    room_name;

    constructor(id, movie_id, room_id, start_time, created_at, movie_title, room_name){
        this.id = id;
        this.movie_id = movie_id;
        this.room_id = room_id;
        this.start_time = start_time;
        this.created_at = created_at;
        this.movie_title = movie_title;
        this.room_name = room_name;
    }

    static async getScreeningsList(){
        const response = await fetch('http://localhost:8000?action=list_screening', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(response);
        const data = await CustomApiResponse.convertJson( await response.json());
        if(data.getType() !== "success"){
            throw new Error("Erreur lors de la récupération de la liste des projections : " + data.getMessage());
        }
        else{
            return data.getMessage().map(screeningData => new Screening(
                screeningData.id,
                screeningData.movie_id,
                screeningData.room_id,
                screeningData.start_time,
                screeningData.created_at,
                screeningData.movie_title,
                screeningData.room_name
            ));
        }

    }
    static generateScreeningView(screeningsArray){
        const listViewContainer = document.getElementById("main_li");
        listViewContainer.innerHTML = "";
        screeningsArray.forEach(screening => {
            const screeningElement = document.createElement("div");
            screeningElement.className = "projection_list_item";
            screeningElement.innerHTML = `
                <h2>${screening.movie_title}</h2>
                <p>Salle: ${screening.room_name}</p>
                <p>Heure de début: ${screening.start_time}</p>
                <div class="projection-actions">
                    <button class="edit-projection" id="edit_${screening.id}">Éditer</button>
                    <button class="delete-projection" id="del_${screening.id}">Supprimer</button>
                </div>
            `;
            listViewContainer.appendChild(screeningElement);
            let editButton = document.getElementById(`edit_${screening.id}`);
            let delButton = document.getElementById(`del_${screening.id}`);

            editButton.addEventListener("click", () => {
                console.log("Edit screening with ID:", screening.id);
                const modal = new ModalArchitect();
                modal.modifyScreening(screening);
            });

            delButton.addEventListener("click", async () => {
                try {
                    await Screening.deleteScreening(screening.id);
                    alert("Projection supprimée avec succès.");
                } catch (error) {
                    alert("Erreur lors de la suppression de la projection :" + error.message);
                }
            });
        });

        const listContainerElement = document.getElementById("list_container");
        const existingMovieButton = document.getElementById("add_movie_button");
        if (existingMovieButton) {
            existingMovieButton.remove();
        }
        const existingRoomButton = document.getElementById("add_room_button");
        if (existingRoomButton) {
            existingRoomButton.remove();
        }
        const existingProjectionButton = document.getElementById("add_projection_button");
        if (existingProjectionButton) {
            existingProjectionButton.remove();
        }
        let addButtonElement = document.createElement("button");
        addButtonElement.id = "add_projection_button";
        addButtonElement.textContent = "Ajouter une projection";
        addButtonElement.addEventListener("click", () => {
            const modal = new ModalArchitect();
            modal.createScreening();
        })
        listContainerElement.appendChild(addButtonElement);
    }
    static async init(){
        const screenings = await Screening.getScreeningsList();
        Screening.generateScreeningView(screenings);
    }
    static async deleteScreening(screeningId){
        const response = await fetch(`http://localhost:8000?action=delete_screening&id=${screeningId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await CustomApiResponse.convertJson( await response.json());
        console.log(data);
        if(data.getType() !== "success"){
            throw new Error("Erreur lors de la suppression de la projection : " + data.getMessage());
        }
        else{
            Screening.init();
        }
    }
static async updateScreening(form){
    const formData = new FormData(form);
    const id = formData.get('id');
    const response = await fetch(`http://localhost:8000?action=update_screening&id=${id}`, {
        method: 'POST',
        body: formData
    });
        const data = await CustomApiResponse.convertJson( await response.json());
        if(data.getType() !== "success"){
            throw new Error("Erreur lors de la mise à jour de la projection : " + data.getMessage());
        }
        else{
            Screening.init();
            ModalArchitect.closeModify();
        }
    }

static async addScreening(form){
    const formData = new FormData(form);
    const response = await fetch(`http://localhost:8000?action=add_screening`, {
        method: 'POST',
        body: formData
    });
        const data = await CustomApiResponse.convertJson( await response.json());
        if(data.getType() !== "success"){
            throw new Error("Erreur lors de l'ajout de la projection : " + data.getMessage());
        }else{
            Screening.init();
            ModalArchitect.closeAdd();
        }
    }
}