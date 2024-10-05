import React from 'react'
import { Link } from 'react-router-dom'
import styleNavbar from './Navbar.module.css'

export default function Navbar() {
    return (
        <>
            <div className={styleNavbar.navbar}>
                <div className={styleNavbar.logo}>
                    <h1>FARMHELP</h1>
                </div>

                <div className={styleNavbar.links}>
                        <Link to="/" className={styleNavbar.navElement}>Measurements</Link>
                        <Link to="/predict" className={styleNavbar.navElement}>Prediction</Link>
                </div>

            </div>
        </>
    )
}

