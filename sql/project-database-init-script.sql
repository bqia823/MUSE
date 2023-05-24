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
    User_ID INT NOT NULL PRIMARY KEY,
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
    Article_ID INT NOT NULL PRIMARY KEY,
    Title VARCHAR(100),
    Content TEXT,
    Image VARCHAR(255),
    Date TIMESTAMP,
    Likes_Count INT,
    User_ID INT,
	Page INT,
    FOREIGN KEY (User_ID) REFERENCES User(User_ID)
);

CREATE TABLE Comment (
    Comment_ID INT NOT NULL PRIMARY KEY,
    Comment_Text TEXT,
    Comment_Time TIMESTAMP,
    Article_ID INT,
    User_ID INT,
    Parent_Comment_ID INT,
    FOREIGN KEY (Article_ID) REFERENCES Article(Article_ID),
    FOREIGN KEY (User_ID) REFERENCES User(User_ID),
    FOREIGN KEY (Parent_Comment_ID) REFERENCES Comment(Comment_ID)
);

CREATE TABLE Subscription (
    Subscriber_ID INT,
    Author_ID INT,
    PRIMARY KEY (Subscriber_ID, Author_ID),
    FOREIGN KEY (Subscriber_ID) REFERENCES User(User_ID),
    FOREIGN KEY (Author_ID) REFERENCES User(User_ID)
);


CREATE TABLE Notification (
    Notification_ID INT NOT NULL PRIMARY KEY,
    Content TEXT,
    Timestamp TIMESTAMP,
    Is_Read BOOLEAN,
    Sender_ID INT,
    Receiver_ID INT,
    NotificationType TEXT,
    FOREIGN KEY (Sender_ID) REFERENCES User(User_ID),
    FOREIGN KEY (Receiver_ID) REFERENCES User(User_ID)
);

CREATE TABLE Article_Like (
    User_ID INT,
    Article_ID INT,
    PRIMARY KEY (User_ID, Article_ID),
    FOREIGN KEY (User_ID) REFERENCES User(User_ID),
    FOREIGN KEY (Article_ID) REFERENCES Article(Article_ID)
);

-- Inserting data into User table
INSERT INTO User (User_ID, Username, Password, Real_Name, Date_Of_Birth, Brief_Description, Avatar, Is_Admin)
VALUES 
(1, 'Sarah', '12345', 'Qiao','1991-01-01', 'This is S', 'boy1.png', FALSE),
(2, 'Tianle', '12345', 'Pan', '1992-01-02', 'This is T', 'boy2.png', FALSE),
(3, 'Lei', '12345', 'Pei', '1993-01-03', 'This is L', 'boy3.png', FALSE),
(4, 'Colin', '12345', 'Shi', '1994-01-04', 'This is C', 'boy4.png', FALSE),
(5, 'Marie', '12345', 'A', '1995-01-05', 'This is M', 'girl2.png', FALSE),
(6, 'John', '67890', 'Smith', '1996-01-06', 'This is J', 'girl3.png', TRUE),
(7, 'Jane', '67890', 'Doe', '1997-01-07', 'This is Jane', 'girl4.png', TRUE),
(8, 'Alice', '67890', 'Wong', '1998-01-08', 'This is Alice', 'girl5.png', TRUE),
(9, 'Bob', '67890', 'Tan', '1999-01-09', 'This is B', 'girl1.png', TRUE),
(10, 'Charlie', '67890', 'Lim', '2000-01-10', 'This is C', 'boy1.png', TRUE);

-- Inserting data into Article table
INSERT INTO Article (Article_ID, Title, Content, Image, Date, Likes_Count, User_ID)
VALUES 
(1, 'Article 1', 'This is article 1', 'image1.jpg', '2023-01-01', 10, 1),
(2, 'Article 2', 'This is article 2', 'image2.jpg', '2023-01-02', 20, 2),
(3, 'Article 3', 'This is article 3', 'image3.jpg', '2023-01-03', 30, 3),
(4, 'Article 4', 'This is article 4', 'image4.jpg', '2023-01-04', 40, 4),
(5, 'Article 5', 'This is article 5', 'image5.jpg', '2023-01-05', 15, 1),
(6, 'Article 6', 'This is article 6', 'image6.jpg', '2023-01-06', 25, 2),
(7, 'Article 7', 'This is article 7', 'image7.jpg', '2023-01-07', 36, 3),
(8, 'Article 8', 'This is article 8', 'image8.jpg', '2023-01-08', 46, 4),
(9, 'Article 9', 'This is article 9', 'image9.jpg', '2023-01-09', 41, 4),
(10, 'Article 10', 'This is article 10', 'image10.jpg', '2023-01-10', 50, 5),
(11, 'Article 11', 'This is article 11', 'image11.jpg', '2023-01-11', 15, 10),
(12, 'Article 12', 'This is article 12', 'image12.jpg', '2023-01-12', 25, 6),
(13, 'Article 13', 'This is article 13', 'image13.jpg', '2023-01-13', 36, 3),
(14, 'Article 14', 'This is article 14', 'image14.jpg', '2023-01-14', 46, 9),
(15, 'Article 15', 'This is article 15', 'image15.jpg', '2023-01-15', 41, 7),
(16, 'Article 16', 'This is article 16', 'image16.jpg', '2023-01-16', 50, 5);

-- Inserting data into Comment table
INSERT INTO Comment (Comment_ID, Comment_Text, Comment_Time, Article_ID, User_ID, Parent_Comment_ID)
VALUES 
(1, 'This is a comment 1', '2023-01-02 12:00:00', 1, 1, 1),
(2, 'This is a comment 2', '2023-01-02', 5, 5, NULL),
(3, 'This is a comment 3', '2023-01-03', 2, 2, 4),
(4, 'This is a comment 4', '2023-01-04', 3, 3, 2),
(5, 'This is a comment 5', '2023-01-05', 4, 4, 3),
(6, 'This is a comment 6', '2023-01-02', 6, 6, NULL),
(7, 'This is a comment 7', '2023-01-03', 8, 8, 5 ),
(8, 'This is a comment 8', '2023-01-04', 7, 7, 6),
(9, 'This is a comment 9', '2023-01-05', 9, 9, 7),
(10, 'This is a comment 10', '2023-01-06', 10, 10, 9);

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
INSERT INTO Notification (Notification_ID, Content, Timestamp, Is_Read,  Sender_ID, Receiver_ID)
VALUES 
(1, 'This is a notification 1', '2023-01-03 12:00:00', FALSE, 1, 2),
(2, 'This is a notification 2', '2023-01-04 12:00:00', FALSE, 2, 3),
(3, 'This is a notification 3', '2023-01-05 12:00:00', FALSE, 3, 4),
(4, 'This is a notification 4', '2023-01-06 12:00:00', FALSE, 4, 5),
(5, 'This is a notification 5', '2023-01-07 12:00:00', FALSE, 5, 6),
(6, 'This is a notification 6', '2023-01-08 12:00:00', FALSE, 6, 7),
(7, 'This is a notification 7', '2023-01-09 12:00:00', FALSE, 7, 8),
(8, 'This is a notification 8', '2023-01-10 12:00:00', FALSE, 8, 9),
(9, 'This is a notification 9', '2023-01-11 12:00:00', FALSE, 9, 10),
(10, 'This is a notification 10', '2023-01-12 12:00:00', FALSE, 10, 1);

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