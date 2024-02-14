import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [userData, setUserData] = useState(
        {
            "username": "",
            "name": "",
            "email": "",
            "password": "",
            "phone_number": ""
        }
    );
    let navigate = useNavigate();
    function handleInput(e) {
        let newUserData = userData;
        newUserData[e.target.name] = e.target.value;
        setUserData(newUserData);
    }
    function handleRegister(e) {
        e.preventDefault();
        axios.post("/api/register", userData).then((res) => {
            console.log(res.data);
            navigate("/login"); 
        }).catch((e) => {
            console.log(e);
        });
    }
    return (
        <section
            className="vh-100"
            style={{
                paddingTop: 4.5 + "rem",
            }}
        >
            <div className="container-fluid h-custom">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-md-9 col-lg-6 col-xl-5">
                        <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                            className="img-fluid"
                            alt="Sample image"
                        />
                    </div>
                    <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                        <form onSubmit={handleRegister}>

                            <div className="form-outline mb-4">
                                <input
                                    type="username"
                                    id="form3Example1"
                                    className="form-control form-control-lg"
                                    placeholder="Enter name"
                                    name="username"
                                    onInput={handleInput}
                                />
                                <label className="form-label" htmlFor="form3Example3">
                                    Username
                                </label>
                            </div>

                            <div className="form-outline mb-4">
                                <input
                                    type="name"
                                    id="form3Example2"
                                    className="form-control form-control-lg"
                                    placeholder="Enter a valid username"
                                    name="name"
                                    onInput={handleInput}
                                />
                                <label className="form-label" htmlFor="form3Example3">
                                    Name
                                </label>
                            </div>

                            <div className="form-outline mb-4">
                                <input
                                    type="email"
                                    id="form3Example3"
                                    className="form-control form-control-lg"
                                    placeholder="Enter a valid email address"
                                    name="email"
                                    onInput={handleInput}
                                />
                                <label className="form-label" htmlFor="form3Example3">
                                    Email address
                                </label>
                            </div>

                            <div className="form-outline mb-3">
                                <input
                                    type="password"
                                    id="form3Example4"
                                    className="form-control form-control-lg"
                                    placeholder="Enter password"
                                    name="password"
                                    onInput={handleInput}
                                />
                                <label className="form-label" htmlFor="form3Example4">
                                    Password
                                </label>
                            </div>

                            <div className="form-outline mb-4">
                                <input
                                    type="phone_number"
                                    id="form3Example5"
                                    className="form-control form-control-lg"
                                    placeholder="Enter a valid phone number"
                                    name="phone_number"
                                    onInput={handleInput}
                                />
                                <label className="form-label" htmlFor="form3Example3">
                                    Phone Number
                                </label>
                            </div>


                            <div className="text-center text-lg-start mt-4 pt-2">
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-lg"
                                    style={{
                                        paddingLeft: 2.5 + "rem",
                                        paddingRight: 2.5 + "rem",
                                    }}
                                >
                                    Register
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Register
