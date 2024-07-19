// src/components/Register.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import API_BASE_URL from '../config';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../styles.css';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nickname: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      console.log('Registration successful:', response.data);
      toast.success('Registration successful');
      // Redirect to login after successful registration
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error.response?.data?.message || error.message);
      setError(error.response?.data?.message || 'Registration failed');
      toast.error('Registration failed: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div>
      <header className="App-header">
        <div className="logo large">
          <span className="my">my</span>
          <span className="f">F</span>
          <span className="a">A</span>
          <span className="heart-v"></span>
          <span className="e">E</span>
          <span className="s">S</span>
        </div>
      </header>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" name="nickname" value={formData.nickname} onChange={handleChange} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <button type="submit">Register</button>
        {error && <p>{error}</p>}
      </form>
      <p className="center-links">Already have an account? <Link to="/login">Login here</Link></p>
    </div>
  );
};

export default Register;