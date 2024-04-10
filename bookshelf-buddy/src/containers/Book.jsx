import React from "react";
import "../stylesheets/book.css"
import { useState, useEffect } from "react";

function Book({item, index}) {

    const [image, setImage] = useState();

    const fetchImage = async () => {
        const res = await fetch("http://localhost:8080/cover/" + item.path_to_image);
        const imageBlob = await res.blob();
        const imageObjectURL = URL.createObjectURL(imageBlob);
        setImage(imageObjectURL);
    };

    useEffect(() => {
        fetchImage();
      }, []); 

    return(
        <div>
            <div
            style={{backgroundImage: "url('" + image + "'" }} 
            className="p-2 book" key={index}>
                <progress className="custom-progress" value={item.current_page} max={item.total_pages}/>
                <p>{item.current_page}/{item.total_pages}</p>
            </div>
        </div>
    );
}

export default Book;