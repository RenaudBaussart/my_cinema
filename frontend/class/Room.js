import {CustomApiResponse} from "./CustomApiResponse.js";
import {ModalArchitect} from "../component/Modalarchitect.js";
export class Room{
    id;
    name;
    capacity;
    type;
    active;
    created_at;
    updated_at;

    constructor(id, name, capacity, type, active, created_at, updated_at){
        this.id = id;
        this.name = name;
        this.capacity = capacity;
        this.type = type;
        this.active = active;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    static async getRoomsList(){
        const response = await fetch('http://localhost:8000?action=list_rooms', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(response);
        const data = await CustomApiResponse.convertJson( await response.json());
        if(data.getType() !== "success"){
            throw new Error("Erreur lors de la récupération de la liste des salles : " + data.getMessage());
        }
        else{
            return data.getMessage().map(roomData => new Room(
                roomData.id,
                roomData.name,
                roomData.capacity,
                roomData.type,
                roomData.active,
                roomData.created_at,
                roomData.updated_at
            ));
        }

    }
    static generateRoomView(roomsArray){
        const listViewContainer = document.getElementById("main_li");
        listViewContainer.innerHTML = "";
        roomsArray.forEach(room => {
            const roomElement = document.createElement("div");
            roomElement.className = "room_list_item";
            roomElement.innerHTML = `
                <h2>${room.name}</h2>
                <p>Capacité: ${room.capacity}</p>
                <p>Type: ${room.type}</p>
                <p>Active: ${room.active ? 'Oui' : 'Non'}</p>
                <div class="room-actions">
                    <button class="edit-room" id="edit_${room.id}">Éditer</button>
                    <button class="delete-room" id="del_${room.id}">Supprimer</button>
                </div>
            `;
            listViewContainer.appendChild(roomElement);
            let editButton = document.getElementById(`edit_${room.id}`);
            let delButton = document.getElementById(`del_${room.id}`);

            editButton.addEventListener("click", () => {
                console.log("Edit room with ID:", room.id);
                const modal = new ModalArchitect();
                modal.modifyRoom(room);
            });

            delButton.addEventListener("click", async () => {
                try {
                    await Room.deleteRoom(room.id);
                    alert("Salle supprimée avec succès.");
                } catch (error) {
                    alert("Erreur lors de la suppression de la salle :" + error.message);
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
        addButtonElement.id = "add_room_button";
        addButtonElement.textContent = "Ajouter une salle";
        addButtonElement.addEventListener("click", () => {
            const modal = new ModalArchitect();
            modal.createRoom();
        })
        listContainerElement.appendChild(addButtonElement);
    }
    static async init(){
        const rooms = await Room.getRoomsList();
        Room.generateRoomView(rooms);
    }
    static async deleteRoom(roomId){
        const response = await fetch(`http://localhost:8000?action=delete_room&id=${roomId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await CustomApiResponse.convertJson( await response.json());
        console.log(data);
        if(data.getType() !== "success"){
            throw new Error("Erreur lors de la suppression de la salle : " + data.getMessage());
        }
        else{
            Room.init();
        }
    }
static async updateRoom(form){
    const formData = new FormData(form);
    const id = formData.get('id');
    const response = await fetch(`http://localhost:8000?action=update_room&id=${id}`, {
        method: 'POST',
        body: formData
    });
        const data = await CustomApiResponse.convertJson( await response.json());
        if(data.getType() !== "success"){
            throw new Error("Erreur lors de la mise à jour de la salle : " + data.getMessage());
        }
        else{
            Room.init();
            ModalArchitect.closeModify();
        }
    }

static async addRoom(form){
    const formData = new FormData(form);
    const response = await fetch(`http://localhost:8000?action=add_room`, {
        method: 'POST',
        body: formData
    });
        const data = await CustomApiResponse.convertJson( await response.json());
        if(data.getType() !== "success"){
            throw new Error("Erreur lors de l'ajout de la salle : " + data.getMessage());
        }else{
            Room.init();
            ModalArchitect.closeAdd();
        }
    }
}