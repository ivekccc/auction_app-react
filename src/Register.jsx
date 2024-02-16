import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
    const [userData, setUserData] = useState({
        "username": "",
        "name": "",
        "email": "",
        "password": "",
        "phone_number": ""
    });

    let navigate = useNavigate();

    function handleInput(e) {
        let newUserData = { ...userData };
        newUserData[e.target.name] = e.target.value;
        setUserData(newUserData);
    }

    function handleRegister(e) {
        e.preventDefault();
        axios.post("/api/register", userData)
            .then((res) => {
                console.log(res.data);
                navigate("/login");
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <section className="login-page">
            <div className="login-container">
                <div className="login-form">
                    <h2 className="login-title">Register</h2>
                    <form onSubmit={handleRegister}>
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control input-field"
                                placeholder="Enter username"
                                name="username"
                                onInput={handleInput}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control input-field"
                                placeholder="Enter your name"
                                name="name"
                                onInput={handleInput}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="email"
                                className="form-control input-field"
                                placeholder="Enter your email"
                                name="email"
                                onInput={handleInput}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                className="form-control input-field"
                                placeholder="Enter your password"
                                name="password"
                                onInput={handleInput}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="tel"
                                className="form-control input-field"
                                placeholder="Enter your phone number"
                                name="phone_number"
                                onInput={handleInput}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary btn-login">
                            Register
                        </button>
                    </form>
                    <p className="register-link">
                        Already have an account? <a href="/login">Login</a>
                    </p>
                </div>
            </div>
        </section>
    );
}

export default Register;
