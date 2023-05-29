/*
 * Upon submission, this file should contain the SQL script to initialize your database.
 * It should contain all DROP TABLE and CREATE TABLE statments, and any INSERT statements
 * required.
 */

DROP TABLE IF EXISTS Article_Like;
DROP TABLE IF EXISTS Notification;
DROP TABLE IF EXISTS Subscription;
DROP TABLE IF EXISTS Comment;
DROP TABLE IF EXISTS Article;
DROP TABLE IF EXISTS User;

CREATE TABLE User (
    User_ID INTEGER NOT NULL PRIMARY KEY,
    Username VARCHAR(100),
    Password VARCHAR(100),
    Real_Name VARCHAR(100),
    Date_Of_Birth DATE,
    Brief_Description TEXT,
    Avatar VARCHAR(255),
    Is_Admin BOOLEAN,
    authToken varchar(128)
);

CREATE TABLE Article (
    Article_ID INTEGER NOT NULL PRIMARY KEY,
    Title VARCHAR(100),
    Content TEXT,
    Image VARCHAR(255),
    Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Likes_Count INTEGER,
    User_ID INTEGER,
	Page INTEGER,
    FOREIGN KEY (User_ID) REFERENCES User(User_ID)
);

CREATE TABLE Comment (
    Comment_ID INTEGER NOT NULL PRIMARY KEY,
    Comment_Text TEXT,
    Comment_Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Article_ID INTEGER,
    User_ID INTEGER,
    Parent_Comment_ID INTEGER,
    FOREIGN KEY (Article_ID) REFERENCES Article(Article_ID),
    FOREIGN KEY (User_ID) REFERENCES User(User_ID),
    FOREIGN KEY (Parent_Comment_ID) REFERENCES Comment(Comment_ID)
);

CREATE TABLE Subscription (
    Subscriber_ID INTEGER,
    Author_ID INTEGER,
    PRIMARY KEY (Subscriber_ID, Author_ID),
    FOREIGN KEY (Subscriber_ID) REFERENCES User(User_ID),
    FOREIGN KEY (Author_ID) REFERENCES User(User_ID)
);


CREATE TABLE Notification (
    Notification_ID INTEGER NOT NULL PRIMARY KEY,
    Content TEXT,
    Timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Is_Read BOOLEAN,
    Sender_ID INTEGER,
    Receiver_ID INTEGER,
    NotificationType TEXT,
    Article_ID INTEGER,
    FOREIGN KEY (Sender_ID) REFERENCES User(User_ID),
    FOREIGN KEY (Receiver_ID) REFERENCES User(User_ID),
    FOREIGN KEY (Article_ID) REFERENCES Article(Article_ID)
);

CREATE TABLE Article_Like (
    User_ID INTEGER,
    Article_ID INTEGER,
    PRIMARY KEY (User_ID, Article_ID),
    FOREIGN KEY (User_ID) REFERENCES User(User_ID),
    FOREIGN KEY (Article_ID) REFERENCES Article(Article_ID)
);

-- Inserting data into User table
INSERT INTO User (Username, Password, Real_Name, Date_Of_Birth, Brief_Description, Avatar, Is_Admin)
VALUES 
( 'Sarah', '12345', 'Qiao','1991-01-01', 'This is S', 'boy1.png', FALSE),
( 'Tianle', '12345', 'Pan', '1992-01-02', 'This is T', 'boy2.png', FALSE),
( 'Lei', '12345', 'Pei', '1993-01-03', 'This is L', 'boy3.png', FALSE),
( 'Colin', '12345', 'Shi', '1994-01-04', 'This is C', 'boy4.png', FALSE),
( 'Marie', '12345', 'A', '1995-01-05', 'This is M', 'girl2.png', FALSE),
( 'John', '67890', 'Smith', '1996-01-06', 'This is J', 'girl3.png', TRUE),
( 'Jane', '67890', 'Doe', '1997-01-07', 'This is Jane', 'girl4.png', TRUE),
( 'Alice', '67890', 'Wong', '1998-01-08', 'This is Alice', 'girl5.png', TRUE),
( 'Bob', '67890', 'Tan', '1999-01-09', 'This is B', 'girl1.png', TRUE),
( 'Charlie', '67890', 'Lim', '2000-01-10', 'This is C', 'boy1.png', TRUE);

-- Inserting data into Article table
INSERT INTO Article (Title, Content, Image, Likes_Count, User_ID)
VALUES 
( 'Article 1', 'This is article 1', 'image1.png', 10, 1),
( 'Article 2', 'This is article 2', 'image2.png', 20, 2),
( 'Article 3', 'This is article 3', 'image3.png', 30, 3),
( 'Article 4', 'This is article 4', 'image4.png', 40, 4),
('Article 5', 'This is article 5', 'image5.png', 15, 1),
( 'Article 6', 'This is article 6', 'image6.png', 25, 2),
( 'Article 7', 'This is article 7', 'image7.png', 36, 3),
( 'Article 8', 'This is article 8', 'image8.png', 46, 4),
( 'Article 9', 'This is article 9', 'image9.png', 41, 4),
('Article 10', 'This is article 10', 'image10.png', 50, 5),
( 'Article 11', 'This is article 11', 'image11.png', 15, 10),
( 'Article 12', 'This is article 12', 'image12.png', 25, 6),
( 'Article 13', 'This is article 13', 'image13.png', 36, 3),
( 'Article 14', 'This is article 14', 'image14.png', 46, 9),
( 'Article 15', 'This is article 15', 'image15.png', 41, 7),
( 'Article 16', 'This is article 16', 'image16.png', 50, 5);

-- Inserting data into Comment table
INSERT INTO Comment ( Comment_Text, Comment_Time, Article_ID, User_ID, Parent_Comment_ID)
VALUES 
( 'This is a comment 1', '2023-04-10 12:30:00 ', 1, 2, NULL),
( 'This is a comment 2', '2023-04-10 12:40:00 ', 1, 3, NULL),
( 'This is a comment 3', '2023-04-10 13:30:00 ', 2, 3, NULL),
( 'This is a comment 4', '2023-04-10 14:30:00 ', 3, 4, NULL),
( 'This is a comment 5', '2023-04-10 15:30:00 ', 4, 5, NULL),
( 'This is a comment 6', '2023-04-10 12:30:00 ', 5, 5, NULL),
( 'This is a comment 7', '2023-04-12 07:30:00 ', 6, 1, NULL),
( 'This is a comment 8', '2023-04-12 19:30:00 ', 8, 7, NULL),
( 'This is a comment 9', '2023-04-15 12:30:00 ', 7, 8, NULL),
( 'This is a comment 11', '2023-04-17 12:30:00 ', 1, 3, 1),
( 'This is a comment 12', '2023-04-18 12:30:00 ', 1, 4, 1),
( 'This is a comment 13', '2023-04-19 12:30:00 ', 2, 1, 3),
( 'This is a comment 14', '2023-04-21 12:30:00 ', 3, 2, 4),
( 'This is a comment 15', '2023-04-30 12:30:00 ', 4, 3, 5);

-- Inserting data into Subscription table
INSERT INTO Subscription (Subscriber_ID, Author_ID)
VALUES 
(1, 2),
(2, 3),
(3, 4),
(4, 5),
(5, 6),
(6, 7),
(7, 8),
(8, 9),
(9, 10),
(10, 1);

-- Inserting data into Notification table
INSERT INTO Notification ( Content, Is_Read, Sender_ID, Receiver_ID, NotificationType, Article_ID)
VALUES 
( 'This is a notification 1', FALSE, 1, 2, 'Follow', NULL),
( 'This is a notification 2', FALSE, 2, 3, 'Follow', NULL),
( 'This is a notification 3', FALSE, 3, 4, 'Follow', NULL),
( 'This is a notification 4', FALSE, 4, 5, 'Follow', NULL),
( 'This is a notification 5', FALSE, 5, 6, 'Follow', NULL),
( 'This is a notification 6', FALSE, 6, 7, 'Follow', NULL),
( 'This is a notification 7', FALSE, 7, 8, 'Follow', NULL),
( 'This is a notification 8', FALSE, 8, 9, 'Follow', NULL),
( 'This is a notification 9', FALSE, 9, 10, 'Follow', NULL),
('This is a notification 10', FALSE, 10, 1, 'Follow', NULL);

-- Inserting data into Article_Like table
INSERT INTO Article_Like (User_ID, Article_ID)
VALUES 
(1, 2),
(2, 3),
(3, 4),
(4, 5),
(5, 6),
(6, 7),
(7, 8),
(8, 9),
(9, 10),
(10, 1);

