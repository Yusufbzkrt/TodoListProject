import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import axios from "axios";
import './Register.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Register() {
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        email: "",
        password: "",
    });

    useEffect(() => {
        setFormData({
            name: "",
            surname: "",
            email: "",
            password: "",
        });

        return () => { };
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        const registerRequest = {
            name: formData.name,
            surname: formData.surname,
            email: formData.email,
            password: formData.password,
        };

        console.log("Register Request:", registerRequest); 

        try {
            const response = await axios.post('https://localhost:7120/api/Auth/register', registerRequest, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.status === 200) {
                setMessage("Kayýt baþarýlý! Giriþ yapmak için yönlendiriliyorsunuz.");
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            } else {
                setMessage(response.data.message || "Kayýt sýrasýnda bir hata oluþtu.");
            }
        } catch (error) {
            console.error("Register Error:", error);
            setMessage(error.response?.data?.message || "Bir hata oluþtu. Lütfen tekrar deneyin.");
        }
    };

    return (
        <div className="page">
            <div className="container">
                <div className="left">
                    <div className="register">
                        <i className="fas fa-user-plus"></i> Register</div>
                    <div className="eula">
                        If you are already a member,{' '}
                        <Link to="/">click to log in.</Link>
                    </div>
                </div>
                <div className="right">
                    <div className="form">
                        <form onSubmit={handleRegister}>
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                            <label htmlFor="surname">Surname</label>
                            <input
                                type="text"
                                id="surname"
                                name="surname"
                                value={formData.surname}
                                onChange={handleInputChange}
                            />
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                            <input type="submit" id="submit" value="Submit" />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
