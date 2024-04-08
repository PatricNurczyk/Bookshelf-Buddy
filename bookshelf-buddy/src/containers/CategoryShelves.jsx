import React, { useEffect, useState } from "react";
import Shelf from "./Shelf"
import Stack from "react-bootstrap/Stack"
import "../stylesheets/scroll_cont.css"


function CategoryShelves({user}) {

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
                <Shelf category="All Books" user={user}/>
                {category.length > 0 ? (
                    category.map((item, index) => (
                        <Shelf category={item.category} user={user}/>
                    ))
                ) : (
                    <div></div>
                )}
            </Stack>
        </div>
    );
}

export default CategoryShelves;