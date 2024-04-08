import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Stack from "react-bootstrap/Stack"
import "../stylesheets/shelf.css"


function Shelf({category = "Category", user}) {

    const [books, setBooks] = useState([]);

    useEffect(() => {
        if (user !== undefined) {
            if (category === "All Books"){
                let url = 'http://localhost:8080/books?email=' + user;
                console.log(url);
                fetch(url)
                .then(res => res.json())
                .then(data => setBooks(data))
                .catch(error => console.error(error));
            }
        }
    },[user,category]);


    return (
        <div className="category-shelf">
            <span className="category">{category}</span>
            <Stack direction="horizontal" gap={3}>
            {books.length > 0 ? (
                    books.map((item, index) => (
                        <div className="p-2" key={index}>
                            <img className="smallBook" src={"/books/" + item.path_to_image} />
                            <progress className="custom-progress" value={item.current_page} max={item.total_pages}/>
                            <p>{item.title}</p>
                        </div>
                    ))
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