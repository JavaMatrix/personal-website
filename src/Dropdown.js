import './Dropdown.css'
import React from 'react'

function Dropdown(props) {
    const [isOverLink, setOverLink] = React.useState(false);
    const [isOverMenu, setOverMenu] = React.useState(false);

    function handleHoverLink() {
        setOverLink(true);
    }

    function handleUnhoverLink() {
        setOverLink(false);
    }

    function handleHoverMenu() {
        setOverMenu(true);
    }

    function handleUnhoverMenu() {
        setOverMenu(false);
    }

    const aClassName = (isOverLink || isOverMenu) ? "nav-header nav-header-virt-hover" : "nav-header";

    return (
        <div className="dropdown" onMouseEnter={handleHoverLink} onMouseLeave={handleUnhoverLink} onTouchStart={handleHoverLink} aria-haspopup="true">
            <p className={aClassName} aria-haspopup="true">{props.header + ""}</p>
            {
                isOverLink || isOverMenu ?
                    <div className="dropdown-menu" onMouseEnter={() => handleHoverMenu()} onMouseLeave={() => handleUnhoverMenu()}>
                        {props.children}
                    </div> :
                    ""
            }
        </div >
    );
}

export default Dropdown;