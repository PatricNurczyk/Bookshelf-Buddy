import React from "react";
import Popup from "./Popup";
import axios from "axios";
import "../stylesheets/book.css"
import { useState, useEffect } from "react";

function Book({item, index, forceUpdate}) {

    
    const [image, setImage] = useState();
    const [trigger, setTrigger] = useState(false);
    const [currPage, setCurrPage] = useState(0);

    useEffect(() => {
        setCurrPage(item.current_page);
    },[item]);

    const handlePageChange = (event) => {
        const { name, value } = event.target;
        if (value > item.total_pages){
            setCurrPage(item.total_pages);
        }
        if (value < 0){
            setCurrPage(0);
        }
        setCurrPage(value);
        console.log(item.book_id);
    };

    const updatePages = async (event) => {
        event.preventDefault();
        if (currPage > item.total_pages){
            setCurrPage(item.total_pages);
        }
        if (currPage < 0){
            setCurrPage(0);
        }

        try{
          const response = await axios.post('http://localhost:8080/updatePages', {
            id : item.book_id,
            currentPage : currPage
          });
          console.log('Book Updated Successfully:', response.data);
        } catch (error) {
          console.log(error)
        }
        setTrigger(false);
        forceUpdate();
      };

    const fetchImage = async () => {
        const res = await fetch("http://localhost:8080/cover/" + item.path_to_image);
        const imageBlob = await res.blob();
        const imageObjectURL = URL.createObjectURL(imageBlob);
        setImage(imageObjectURL);
    };

    useEffect(() => {
        fetchImage();
      }, []); 

    const handleDragStart = (event) => {
        event.dataTransfer.setData('text/plain', item.book_id);
        console.log("Dragging " + item.book_id);
    };

    return(
        <div className="book" draggable={true} onDragStart={handleDragStart}>
            <div className="book-container">
                <button
                    style={{ backgroundImage: "url('" + image + "'" }}
                    className="p-2 book" 
                    key={index}
                    onClick={() => setTrigger(true)}>
                    <progress className="custom-progress" value={currPage} max={item.total_pages} />
                </button>
                <div className="page-count">
                    <p>{currPage}/{item.total_pages}</p>
                </div>
            </div>
            <Popup title={item.title} trigger={trigger} onClose={setTrigger}>
            <form onSubmit={updatePages}>
                <div className="form-group">
                    <label htmlFor="pageCount">Current Page: </label>
                    <input
                    type="number"
                    className="form-control"
                    id="pageCount"
                    name="pageCount"
                    value={currPage}
                    onChange={handlePageChange}
                    />
                </div>
                <button type="submit" className="btn btn-success">
                    Set Pages
                </button>
                </form>
            </Popup>
        </div>
    );
}

export default Book;