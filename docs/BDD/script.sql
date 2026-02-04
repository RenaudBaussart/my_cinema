CREATE TABLE rooms(
   id INT AUTO_INCREMENT,
   name VARCHAR(100) NOT NULL,
   capacity INT NOT NULL,
   type VARCHAR(100),
   active TINYINT(1) NOT NULL DEFAULT 1,
   created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
   updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   PRIMARY KEY(id)
);

CREATE TABLE movies(
   id INT AUTO_INCREMENT,
   title VARCHAR(100) NOT NULL,
   description VARCHAR(500),
   duration INT NOT NULL,
   release_year INT NOT NULL,
   genre VARCHAR(100),
   director VARCHAR(100),
   is_deleted TINYINT(1) NOT NULL DEFAULT 0,
   created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
   updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   PRIMARY KEY(id)
);

CREATE TABLE screenings(
   id INT AUTO_INCREMENT,
   is_deleted TINYINT(1) NOT NULL DEFAULT 0,
   start_time DATETIME NOT NULL,
   created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
   room_id INT NOT NULL,
   movie_id INT NOT NULL,
   PRIMARY KEY(id),
   FOREIGN KEY(room_id) REFERENCES rooms(id),
   FOREIGN KEY(movie_id) REFERENCES movies(id)
);

CREATE TABLE users(
   id INT AUTO_INCREMENT,
   username VARCHAR(50) NOT NULL,
   password VARCHAR(255) NOT NULL,
   role VARCHAR(50) NOT NULL DEFAULT 'user',
   created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
   updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   PRIMARY KEY(id)
);


INSERT INTO rooms (name, capacity, type, active) VALUES 
('Salle IMAX 1', 250, 'IMAX', 1),
('Salle 3D Luxe', 100, '3D', 1),
('Petite Salle Standard', 50, 'Standard', 1);

INSERT INTO movies (title, description, duration, release_year, genre, director) VALUES 
('Inception', 'Un voleur spécialisé dans l extraction...', 148, 2010, 'Sci-Fi', 'Christopher Nolan'),
('Avatar 2', 'L histoire de la famille Sully...', 192, 2022, 'Aventure', 'James Cameron');

INSERT INTO screenings (movie_id, room_id, start_time) VALUES 
(1, 1, '2026-02-01 20:30:00'),
(2, 2, '2026-02-01 14:00:00');

INSERT INTO users (username, pass, role) VALUES 
('admin', 'adminpassword', 'admin'),
('user1', 'user1password', 'user');
