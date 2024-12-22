import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import anime from 'animejs'; // anime.js'i içe aktar



const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();


    useEffect(() => {
        let current = null;

        const emailField = document.querySelector('#email');
        const passwordField = document.querySelector('#password');
        const submitField = document.querySelector('#submit');

        // Email alaný odaklandýðýnda
        emailField?.addEventListener('focus', function () {
            if (current) current.pause();
            current = anime({
                targets: 'path',
                strokeDashoffset: {
                    value: 0,
                    duration: 700,
                    easing: 'easeOutQuart',
                },
                strokeDasharray: {
                    value: '240 1386',
                    duration: 700,
                    easing: 'easeOutQuart',
                },
            });
        });

        // Þifre alaný odaklandýðýnda
        passwordField?.addEventListener('focus', function () {
            if (current) current.pause();
            current = anime({
                targets: 'path',
                strokeDashoffset: {
                    value: -336,
                    duration: 700,
                    easing: 'easeOutQuart',
                },
                strokeDasharray: {
                    value: '240 1386',
                    duration: 700,
                    easing: 'easeOutQuart',
                },
            });
        });

        // Submit butonu odaklandýðýnda
        submitField?.addEventListener('focus', function () {
            if (current) current.pause();
            current = anime({
                targets: 'path',
                strokeDashoffset: {
                    value: -730,
                    duration: 700,
                    easing: 'easeOutQuart',
                },
                strokeDasharray: {
                    value: '530 1386',
                    duration: 700,
                    easing: 'easeOutQuart',
                },
            });
        });

        return () => {
            emailField?.removeEventListener('focus', () => { });
            passwordField?.removeEventListener('focus', () => { });
            submitField?.removeEventListener('focus', () => { });
        };
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        const loginRequest = {
            email,
            password,
        };

        try {
            // API isteði
            const response = await fetch('https://localhost:7120/api/Auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginRequest),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Giriþ baþarýsýz');
                return;
            }

            if (!data.token) {
                setError('Token alýnamadý, lütfen tekrar deneyin.');
                return;
            }

            localStorage.setItem('token', data.token);

            console.log("Token:", localStorage.getItem('token'));
            console.log(response);
            navigate('/dashboard');
        } catch (error) {
            setError('Bir hata oluþtu, lütfen tekrar deneyin.');
            console.error('Error:', error);
        }
    };


    return (
        <div className="page">
            <div className="container">
                <div className="left">
                    <div className="login">
                        <i className="fas fa-sign-in-alt"></i>Login</div>
                    <div className="eula">
                        If you do not have a membership registration,{' '}
                        <Link to="/register">click to register now.</Link>
                    </div>
                </div>
                <div className="right">
                    <svg viewBox="0 0 320 300">
                        <defs>
                            <linearGradient
                                id="linearGradient"
                                x1="13"
                                y1="193.49992"
                                x2="307"
                                y2="193.49992"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop style={{ stopColor: '#ff00ff' }} offset="0" />
                                <stop style={{ stopColor: '#ff0000' }} offset="1" />
                            </linearGradient>
                        </defs>
                        <path d="m 40,90.00016 239.99984,-.2e-4 c 0,0 24.99263,0.79932 25.00016,35.00016 0.008,34.20084 -25.00016,35 -25.00016,35 h -239.99984 c 0,-0.0205 -25,4.01348 -25,38.5 0,34.48652 25,38.5 25,38.5 h 215 c 0,0 20,-0.99604 20,-25 0,-24.00396 -20,-25 -20,-25 h -190 c 0,0 -20,1.71033 -20,25 0,24.00396 20,25 20,25 h 168.57143" />
                    </svg>
                    <div className="form">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <input
                            type="submit"
                            id="submit"
                            value="Submit"
                            onClick={handleLogin}
                        />
                        {error && <div className="error">{error}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
