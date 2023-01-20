import React from "react";
import classes from "./all.module.css";

function About() {
    return (
        <div className="about">
            <div className="container">
                <div className={`row ${classes.container}`}>
                    <div className="col-lg-5">
                        <h1 className={classes.par}>About</h1>
                        <p className={classes.par}>
                            Проект по симуляции количества посетителей за 7 дней.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;
