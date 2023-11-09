CREATE DATABASE Week_Flow;
USE Week_Flow;

-- User Table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  age INT,
  gender ENUM('male', 'female'),
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);

-- Week Table
CREATE TABLE weeks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  week_order INT,
  rank INT,
  user_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Day Table
CREATE TABLE days (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  date DATE,
  rank INT,
  week_id INT,
  FOREIGN KEY (week_id) REFERENCES weeks(id)
);

-- Task Table
CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  description VARCHAR(255),
  state VARCHAR(255),
  degree VARCHAR(255),
  day_id INT,
  FOREIGN KEY (day_id) REFERENCES days(id)
);

-- Archive Table
CREATE TABLE archive (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  task_description VARCHAR(255),
  task_degree VARCHAR(255),
  task_date DATE
);