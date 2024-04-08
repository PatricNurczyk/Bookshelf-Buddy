const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
var logged_user_id = -1

const db = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "bookshelf_admin",
    database : "bookshelf_buddy"
});

app.get("/", (re, res)=>{
    return res.json("Backend");
});

app.get("/login_check", (re, res) =>{
    let email =  re.query.email;
    console.log("Checking Login with Database")
    const sql = "SELECT * FROM users WHERE email = '" + email + "'";
    db.query(sql, (err, data) =>{
        if (err) return res.json(err);
        if (data.length === 0){
            const create = "INSERT INTO users (email) VALUES ('" + email + "')"
            db.query(create, (err, data)=>{
                if (err) return res.json(err);
                return res.json("Success");
            });
        }
        return res.json("Already Exists");
    });
});

app.get("/users", (re, res) => {
    const sql = "SELECT * FROM users";
    db.query(sql, (err, data) =>{
        if (err) return res.json(err);
        return res.json(data);
    })
});

app.get("/books", (re, res) => {
    console.log("Grabbing All Books")
    const sql = "SELECT title,current_page,total_pages,path_to_image FROM users INNER JOIN books ON users.user_id = books.user_id WHERE users.email = '" + re.query.email + "'";
    db.query(sql, (err, data) =>{
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.get("/category", (re, res) => {
    console.log("Grabbing Categories")
    const sql = "SELECT category_id,category FROM users INNER JOIN categories ON users.user_id = categories.user_id WHERE users.email='" + re.query.email + "'";
    db.query(sql, (err, data) =>{
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.listen(8080, () => {
    console.log("Listening");
});