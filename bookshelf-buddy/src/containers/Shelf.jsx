import React, { useEffect, useState, useRef } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import { useAuth0 } from "@auth0/auth0-react";
import Stack from "react-bootstrap/Stack"
import Book from "./Book";
import axios from "axios";
import "../stylesheets/shelf.css"


function Shelf({category, user, addBookClick, updateTrigger, forceUpdate}) {

    const [books, setBooks] = useState([]);
    const droppableRef = useRef(null);

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

    const handleDrop = async (event) => {
        event.preventDefault();
        if (category.category !== "All Books"){
            const data = event.dataTransfer.getData('text/plain');
            console.log(data);
            try{
                const response = await axios.post('http://localhost:8080/updateCategory', {
                  book_id : data,
                  category_id : category.category_id
                });
                console.log('Book Updated Successfully:', response.data);
                forceUpdate();
            } catch (error) {
                console.log(error)
            }
        }
    };
    
    const handleDragOver = (event) => {
        event.preventDefault();
        const droppable = droppableRef.current;
        const scrollContainer = droppable.parentElement; // Grandparent is the scroll container
        const rect = scrollContainer.getBoundingClientRect();
        const offsetY = event.clientY - rect.top;
        console.log(offsetY);

        const scrollSpeed = 10;
        const scrollZoneHeight = 50;
        const scrollOffset = 5;

        if (offsetY < scrollZoneHeight) {
        scrollContainer.scrollTop -= scrollSpeed;
        } else if (offsetY > rect.height - scrollZoneHeight) {
        scrollContainer.scrollTop += scrollSpeed;
        }
    };


    return (
        <div ref={droppableRef} className="category-shelf" onDrop={handleDrop} onDragOver={handleDragOver}>
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
                <button className="add-icon" onClick={() => {addBookClick(category.category_id)}}></button>
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