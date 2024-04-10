import React, { useEffect, useState } from "react";
import Shelf from "./Shelf"
import Stack from "react-bootstrap/Stack"
import "../stylesheets/scroll_cont.css"


function CategoryShelves({user, addBookClick}) {

    const [category, setCategory] = useState([]);

    useEffect(() => {
        if (user !== undefined) {
            let url = 'http://localhost:8080/category?email=' + user;
            console.log(url);
            fetch(url)
            .then(res => res.json())
            .then(data => setCategory(data))
            .catch(error => console.error(error));
        }
    },[user]);

    return (
        <div className="scroll-container">
            <Stack>
                <Shelf category={{category: "All Books", category_id: 0}} user={user} addBookClick={addBookClick}/>
                {category.length > 0 ? (
                    category.map((item, index) => (
                        <Shelf category={item} user={user} onAddClick={addBookClick}/>
                    ))
                ) : (
                    <div></div>
                )}
            </Stack>
            <h3>Add New Category</h3>
            <button className="add-btn"></button>
        </div>
    );
}

export default CategoryShelves;