const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const path = require('path');
const multer = require('multer');

const app = express();
app.use(cors());
var logged_user_id = -1

app.use('/images', express.static(path.join(__dirname, 'images')));

// Multer configuration for file upload
const storage = multer.diskStorage({
destination: function (req, file, cb) {
    cb(null, 'images/'); // Directory where files will be stored
},
filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + (Math.round(Math.random() * 1E9) + "_");
    cb(null, uniqueSuffix + file.originalname);
},
});
  
const upload = multer({ storage: storage });

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
    const sql = "SELECT user_id FROM users WHERE email = '" + email + "'";
    db.query(sql, (err, data) =>{
        if (err) return res.json(err);
        if (data.length === 0){
            const create = "INSERT INTO users (email) VALUES ('" + email + "')"
            db.query(create, (err, data)=>{
                if (err) return res.json(err);
                db.query(sql, (err, data)=>{
                    if (err) return res.json(err);
                    return res.json(data);
                });
            });
        }
        return res.json(data);
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

// Endpoint to return an image
app.get('/cover/:imageName', (req, res) => {
    console.log("Getting Cover");
    const { imageName } = req.params;
    const imagePath = path.join(__dirname, 'images', imageName);
    res.sendFile(imagePath);
});

app.get("/books_category", (re, res) => {
    console.log("Grabbing Category Specific Books");
    const sql = "SELECT title,current_page,total_pages,path_to_image FROM books INNER JOIN book_category ON books.book_id = book_category.book_id WHERE category_id=" + re.query.c_id;
    db.query(sql, (err, data) =>{
        if (err) return res.json(err);
        return res.json(data);
    });
})

app.get("/category", (re, res) => {
    console.log("Grabbing Categories")
    const sql = "SELECT category_id,category FROM users INNER JOIN categories ON users.user_id = categories.user_id WHERE users.email='" + re.query.email + "'";
    db.query(sql, (err, data) =>{
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.post('/addBook', upload.single('image'), (req, res) => {
    const file = req.file;
    if (!file) {
      return res.status(400).send('No file uploaded.');
    }
  
    const { title, pageCount, id} = req.body;
  
    
    const sql = "INSERT INTO books (user_id,title,current_page,total_pages,path_to_image) VALUES (" + id + ",'" + title + "',0," + pageCount + ",'" + file.filename + "')";
    db.query(sql, (err, data) =>{
        if (err) return res.json(err);
        return res.status(200).json({ filename: file.filename, title, pageCount,id, message: 'File uploaded successfully' });
    });
    
  });

app.listen(8080, () => {
    console.log("Listening");
});