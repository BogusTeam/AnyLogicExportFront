import classes from "./all.module.css";
import React from "react";
import {NavLink} from "react-router-dom";

function Header() {
    return (
        <div className={`navigation ${classes.all}`}>
            <nav className="navbar navbar-expand navbar-dark bg-dark">
                <div className={`container ${classes.container}`}>
                    <NavLink className={`navbar-brand ${classes.par} ${classes.links}`} to="/">
                        Домашняя
                    </NavLink>
                    <NavLink className={`nav-link ${classes.par} ${classes.links}`} to="/about">
                        О проекте
                    </NavLink>
                </div>
            </nav>
        </div>
    );
}

export default Header;