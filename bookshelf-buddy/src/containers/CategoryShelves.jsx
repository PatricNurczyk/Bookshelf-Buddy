import React from "react";
import Shelf from "./Shelf"
import Stack from "react-bootstrap/Stack"
import "../stylesheets/scroll_cont.css"


function CategoryShelves() {

    return (
        <div className="scroll-container">
            <Stack>
                <Shelf/>
                <Shelf/>
                <Shelf/>
                <Shelf/>
                <Shelf/>
                <Shelf/>
                <Shelf/>
                <Shelf/>
                <Shelf/>
                <Shelf/>
                <Shelf/>
                <Shelf/>
            </Stack>
        </div>
    );
}

export default CategoryShelves;