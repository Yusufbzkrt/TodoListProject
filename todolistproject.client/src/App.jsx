import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login'; // Login bileþenini içe aktar
import Register from './Components/Register';
import Dashboard from './Components/Dashboard';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/Dashboard" element={<Dashboard />} />
                <Route path="/Login" element={<Login />} />
            </Routes>
        </Router>
    );
}

export default App;
