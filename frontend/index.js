import { Movie } from "./class/movie.js";
import { Room } from "./class/Room.js";
import { Screening } from "./class/Screening.js";
document.addEventListener("DOMContentLoaded", () => {
    // Default to movies on load
    Movie.init();

    document.getElementById("movie_button").addEventListener("click", () => {
        Movie.init();
    });

    document.getElementById("room_button").addEventListener("click", () => {
        Room.init();
    });

    document.getElementById("screening_button").addEventListener("click", () => {
        Screening.init();
    });
});