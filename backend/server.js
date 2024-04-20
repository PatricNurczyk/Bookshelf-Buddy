const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const path = require('path');
const multer = require('multer');

const app = express();
app.use(cors());
var logged_user_id = -1

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(bodyParser.json());

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
    const sql = "SELECT books.book_id, title,current_page,total_pages,path_to_image FROM users INNER JOIN books ON users.user_id = books.user_id WHERE users.email = '" + re.query.email + "'";
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
    const sql = "SELECT books.book_id, title,current_page,total_pages,path_to_image FROM books INNER JOIN book_category ON books.book_id = book_category.book_id WHERE category_id=" + re.query.c_id;
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

app.get("/goals", (re, res) => {
    console.log("Grabbing Goals")
    const sql = "SELECT * FROM users INNER JOIN goals ON users.user_id = goals.user_id WHERE users.email='" + re.query.email + "'";
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

app.post('/addGoal', (req, res) => {

    const {user_id, goal_name, total, comp_date} = req.body;

    
    const sql = "INSERT INTO goals (user_id,goal_name,goal_total,goal_progress,goal_date) VALUES (" + user_id + ",'" + goal_name + "'," + total + ",0,'" + comp_date + "')";
    db.query(sql, (err, data) =>{
        if (err) return res.json(err);
        return res.status(200).json({ message: 'File uploaded successfully' });
    });
    
});

app.post('/updatePages', (req, res) => {
    const { uid, id, currentPage, total_pages } = req.body;
    const sql = "UPDATE books SET current_page = " + currentPage + " WHERE book_id = " + id;
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        if (currentPage >= total_pages) {
            const goal = "SELECT goal_id, goal_progress FROM goals INNER JOIN users ON goals.user_id = users.user_id WHERE users.user_id=" + uid;
            db.query(goal, (err, goalsData) => {
                if (err) return res.json(err);
                let updatesCompleted = 0;
                for (let i = 0; i < goalsData.length; ++i) {
                    let temp = goalsData[i].goal_progress + 1;
                    const update = "UPDATE goals SET goal_progress = " + temp + " WHERE goal_id = " + goalsData[i].goal_id;
                    db.query(update, (err, _) => {
                        if (err) {
                            return res.json(err);
                        }
                        updatesCompleted++;
                        // Check if all updates are completed
                        if (updatesCompleted === goalsData.length) {
                            return res.status(200).json({ message: 'Book Successfully Updated' });
                        }
                    });
                }
            });
        } else {
            return res.status(200).json({ message: 'Book Successfully Updated' });
        }
    });
});


app.post('/addCategory', (req, res) => {
    const { id, category} = req.body;
    const sql = "INSERT INTO categories (user_id, category) VALUES (" + id + ",'" + category + "')";
    db.query(sql, (err, data) =>{
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.post('/updateCategory', (req, res) => {
    const { book_id, category_id } = req.body;
    const sql = "INSERT INTO book_category (book_id, category_id) VALUES (" + book_id + "," + category_id + ")";
    db.query(sql, (err, data) =>{
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.post("/deleteBook", (req,res) => {
    const {id} = req.body;
    console.log("Deleting Book" + id);
    const sql_multi = "DELETE FROM book_category WHERE book_id =" + id;
    db.query(sql_multi, (err, data) =>{
        if (err) return res.json(err);
    });
    const sql = "DELETE FROM books WHERE book_id =" + id;
    db.query(sql, (err, data) =>{
        if (err) return res.json(err);
        return res.status(200).json({ message: 'Book Successfully Deleted' });
    });
});

app.post("/deleteCat", (req,res) => {
    const {id} = req.body;
    console.log("Deleting Category" + id);
    const sql_multi = "DELETE FROM book_category WHERE category_id =" + id;
    db.query(sql_multi, (err, data) =>{
        if (err) return res.json(err);
    });
    const sql = "DELETE FROM categories WHERE category_id =" + id;
    db.query(sql, (err, data) =>{
        if (err) return res.json(err);
        return res.status(200).json({ message: 'Category Successfully Deleted' });
    });
});

app.post("/deleteGoal", (req,res) => {
    const {id} = req.body;
    console.log("Deleting Goal" + id);
    const sql = "DELETE FROM goals WHERE goal_id =" + id;
    db.query(sql, (err, data) =>{
        if (err) return res.json(err);
        return res.status(200).json({ message: 'Goal Successfully Deleted' });
    });
});

app.listen(8080, () => {
    console.log("Listening");
});