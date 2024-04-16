import React, { useEffect, useState } from "react";
import Shelf from "./Shelf"
import Stack from "react-bootstrap/Stack"
import Popup from "./Popup";
import axios from "axios";
import "../stylesheets/scroll_cont.css"


function CategoryShelves({newCat, user, addBookClick}) {

    const [category, setCategory] = useState([]);
    const [catForm, setCatForm] = useState('');
    const [forceUpdate, setForceUpdate] = useState(false);
    const [trigger, setTrigger] = useState(false);

    const handleForceUpdate = () => {
        setForceUpdate((prevForceUpdate) => !prevForceUpdate);
    };

    const catChange = (event) => {
        const { name, value } = event.target;
        setCatForm(value);
    };

    const addCategory = async (event) => {
        event.preventDefault();
        await newCat(catForm);
        setCatForm('');
        setTrigger(false);
        handleForceUpdate();
      };

    useEffect(() => {
        if (user !== undefined) {
            let url = 'http://localhost:8080/category?email=' + user;
            console.log(url);
            fetch(url)
            .then(res => res.json())
            .then(data => setCategory(data))
            .catch(error => console.error(error));
            console.log(category);
        }
    },[user, forceUpdate]);

    return (
        <div className="scroll-container">
            <Stack>
                <Shelf category={{category: "All Books", category_id: 0}} user={user} addBookClick={addBookClick} updateTrigger={forceUpdate} forceUpdate={handleForceUpdate}/>
                {category.length > 0 ? (
                    category.map((item, index) => (
                        <Shelf category={item} user={user} onAddClick={addBookClick} updateTrigger={forceUpdate} forceUpdate={handleForceUpdate}/>
                    ))
                ) : (
                    <div></div>
                )}
            </Stack>
            <h3>Add New Category</h3>
            <button onClick={() => setTrigger(true)} className="add-btn"></button>
            <Popup title="Add New Category" trigger={trigger} onClose={setTrigger}>
                <form onSubmit={addCategory}>
                    <div className="form-group">
                    <label htmlFor="Category">Category Name: </label>
                    <input
                        type="text"
                        className="form-control"
                        id="category"
                        name="category"
                        value={catForm}
                        onChange={catChange}
                    />
                    </div>
                    <button type="submit" className="btn btn-success">
                    Add Category
                    </button>
                </form>
            </Popup>
        </div>
    );
}

export default CategoryShelves;