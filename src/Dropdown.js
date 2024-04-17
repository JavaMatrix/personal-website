import './Dropdown.css'
import React from 'react'

function Dropdown(props) {
    const [isOpen, setOpen] = React.useState(false);
    console.log(isOpen)
    return (
        <span class="dropdown">
            <a href="." className="nav-header">{props.header + ""}</a>
            {
                isOpen ?
                    <div></div> :
                    ""}
        </span>
    );
}

export default Dropdown;