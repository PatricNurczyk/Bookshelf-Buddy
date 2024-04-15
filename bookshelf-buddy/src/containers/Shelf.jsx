import React, { useEffect, useState } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import { useAuth0 } from "@auth0/auth0-react";
import Stack from "react-bootstrap/Stack"
import Book from "./Book";
import "../stylesheets/shelf.css"


function Shelf({category, user, addBookClick, updateTrigger, forceUpdate}) {

    const [books, setBooks] = useState([]);

    useEffect(() => {
        if (user !== undefined) {
            if (category.category === "All Books"){
                let url = 'http://localhost:8080/books?email=' + user;
                console.log(url);
                fetch(url)
                .then(res => res.json())
                .then(data => setBooks(data))
                .catch(error => console.error(error));
            }
            else{
                let url = 'http://localhost:8080/books_category?c_id=' + category.category_id;
                console.log(url);
                fetch(url)
                .then(res => res.json())
                .then(data => setBooks(data))
                .catch(error => console.error(error));
            }
        }
    },[user,category,updateTrigger]);


    return (
        <div className="category-shelf">
            <span className="category">{category.category}</span>
            <Stack direction="horizontal" gap={4}>
            {books.length > 0 ? (
                    books.map((item, index) => (
                        <Book item={item} index={index} forceUpdate={forceUpdate}/>
                    ))
            ) : (
                <div></div>
            )}
            {category.category === "All Books" ? (
                <button className="add-btn" onClick={() => {addBookClick(category.category_id)}}></button>
            ) : (
                <div></div>
            )}
            
            </Stack>
        </div>
    )
}


/*

*/

export default Shelf