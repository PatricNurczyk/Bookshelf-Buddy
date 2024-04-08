USE `bookshelf_buddy`;

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'bookshelf_admin';

DROP TABLE IF EXISTS book_category;
DROP TABLE IF EXISTS book_goals;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS users;
CREATE TABLE users (
user_id INT AUTO_INCREMENT PRIMARY KEY,
email VARCHAR(50)
);


CREATE TABLE books (
book_id INT AUTO_INCREMENT PRIMARY KEY,
user_id INT,
title VARCHAR(100),
current_page INT,
total_pages INT,
path_to_image VARCHAR(100),
FOREIGN KEY (user_id) REFERENCES users(user_id)
);


CREATE TABLE categories (
category_id INT AUTO_INCREMENT PRIMARY KEY,
user_id INT,
category VARCHAR(50),
FOREIGN KEY (user_id) REFERENCES users(user_id)
);


CREATE TABLE book_category(
book_id INT,
category_id INT,
PRIMARY KEY (book_id, category_id),
FOREIGN KEY (book_id) REFERENCES books(book_id),
FOREIGN KEY (category_id) REFERENCES categories(category_id)
);


CREATE TABLE goals(
goal_id INT PRIMARY KEY AUTO_INCREMENT,
user_id INT,
goal_name VARCHAR(100),
goal_total INT,
goal_progress INT,
FOREIGN KEY (user_id) REFERENCES users(user_id)
);