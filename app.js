/**
 * Main application file.
 * 
 * NOTE: This file contains many required packages, but not all of them - you may need to add more!
 */

// Setup Express
const express = require("express");
const session = require('express-session');  
const authRoutes = require('./routes/auth-routes');
const app = express();
const port = 3000;

// Setup Handlebars
const handlebars = require("express-handlebars");
app.engine("handlebars", handlebars({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// Setup body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'your secret',
    resave: false,
    saveUninitialized: false
}));

app.use('/', authRoutes);
// Setup cookie-parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Make the "public" folder available statically
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

// Use the toaster middleware
app.use(require("./middleware/toaster-middleware.js"));

// Setup routes
app.use(require("./routes/application-routes.js"));
app.use(require("./routes/auth-route.js"));
app.use(require("./routes/articleView-route.js"));
app.use(require("./routes/create-article-routes.js"));
app.use(require("./routes/edit-article-routes.js"));
app.use(require("./routes/marie-routes.js"));
app.use(require("./routes/notification-routes.js"));
app.use(require("./routes/follows-routes.js"));
app.use(require("./routes/subscribers-routes.js"));
// Start the server running.
app.listen(port, function () {
    console.log(`App listening on port ${port}!`);
});
