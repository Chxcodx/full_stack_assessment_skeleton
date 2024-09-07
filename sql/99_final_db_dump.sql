USE home_db;

-- Drop existing tables if they exist to avoid conflicts
DROP TABLE IF EXISTS user_home_relation;
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS home;

-- Create the user table
CREATE TABLE `user` (
   `id` INT AUTO_INCREMENT PRIMARY KEY,
   `username` VARCHAR(100) NOT NULL,
   `email` VARCHAR(100) NOT NULL
);

-- Create the home table
CREATE TABLE `home` (
   `id` INT AUTO_INCREMENT PRIMARY KEY,
   `street_address` VARCHAR(255) NOT NULL,
   `state` VARCHAR(50) NOT NULL,
   `zip` VARCHAR(10) NOT NULL,
   `sqft` FLOAT NOT NULL,
   `beds` INT NOT NULL,
   `baths` INT NOT NULL,
   `list_price` FLOAT NOT NULL
);

-- Create a relationship table to link users and homes
CREATE TABLE user_home_relation (
    user_id INT,
    home_id INT,
    PRIMARY KEY(user_id, home_id),
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (home_id) REFERENCES home(id)
);

-- Insert data from the existing user_home table into the new tables
INSERT INTO user (username, email)
SELECT DISTINCT username, email FROM user_home;

INSERT INTO home (street_address, state, zip, sqft, beds, baths, list_price)
SELECT DISTINCT street_address, state, zip, sqft, beds, baths, list_price FROM user_home;

-- Populate the relationship table
INSERT INTO user_home_relation (user_id, home_id)
SELECT u.id, h.id
FROM user_home uh
JOIN user u ON uh.username = u.username
JOIN home h ON uh.street_address = h.street_address;

-- Drop user_home table 
DROP TABLE user_home;
