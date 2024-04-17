import './Dropdown.css'
import React from 'react'

function Dropdown(props) {
    const [isOverLink, setOverLink] = React.useState(false);
    const [isOverMenu, setOverMenu] = React.useState(false);

    function handleHoverLink() {
        console.log('hover')
        setOverLink(true);
    }

    function handleUnhoverLink() {
        setOverLink(false);
    }

    function handleHoverMenu() {
        console.log('hovermenu')
        setOverMenu(true);
    }

    function handleUnhoverMenu() {
        setOverMenu(false);
    }

    const aClassName = (isOverLink || isOverMenu) ? "nav-header nav-header-virt-hover" : "nav-header";

    return (
        <div className="dropdown" onMouseEnter={handleHoverLink} onMouseLeave={handleUnhoverLink}>
            <a href={props.link ?? "."} className={aClassName}>{props.header + ""}</a>
            {
                isOverLink || isOverMenu ?
                    <div className="dropdown-menu" onMouseEnter={() => handleHoverMenu()} onMouseLeave={() => handleUnhoverMenu()}><a href="http://example.com/">wow</a></div> :
                    ""}
        </div>
    );
}

export default Dropdown;