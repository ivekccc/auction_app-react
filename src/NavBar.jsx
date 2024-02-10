import React from 'react'
import ikonica from "./img/ikonica-removebg-preview.png"
import userIcon from "./img/Sample_User_Icon-removebg-preview.png"

function NavBar() {

    return (
        <div className='navBar'>
            <a href="">Auction App</a>
            <img src={ikonica} alt="ikonica" className='ikonica' />
            <h1 className='navBarH1'>Best Auction Site</h1>
            <div className='loginDiv'>
                <img src={userIcon} alt="" className='userIcon' />
                <a href="" className='login'>
                    Login
                </a>
            </div>
        </div>
    )
}

export default NavBar
