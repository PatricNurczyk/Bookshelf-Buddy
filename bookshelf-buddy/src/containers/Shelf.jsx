import React from "react";
import Stack from "react-bootstrap/Stack"
import "../stylesheets/shelf.css"


function Shelf({category = "Category"}) {
    return (
        <div className="category-shelf">
            <span className="category">{category}</span>
            <Stack direction="horizontal" gap={3}>
                <div className="p-2">First item</div>
                <div className="p-2">Second item</div>
                <div className="p-2">Third item</div>
            </Stack>
        </div>
    )
}

export default Shelf