// filepath: src/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import Hero from './assets/images/HeroImage.webp';

const Login = ({ setAuth }) => {
  const [guildId, setGuildId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/login', { guildId, password }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.data.success) {
        setAuth({ guildId, token: response.data.token });
        navigate(`/${guildId}`);
      } else {
        setError('Invalid guildId or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="login-container h-screen flex justify-center items-center"
    style={{
      backgroundImage: `url(${Hero})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}>
      <form 
      onSubmit={handleLogin}
      className='p-16 w-5/8 bg rounded-lg shadow-lg bg-zinc-900 bg-opacity-80 justify-center items-start flex flex-col gap-4'
      >
        <h2 className='font-WorkSans text-4xl text-white self-center'><span className="text-teal-300">G</span>uild<span className='text-teal-300'>T</span>racker</h2>
        {error && <p className="error">{error}</p>}
        <div className='w-full flex items-center justify-between'>
          <label className='text-white'>Guild ID:</label>
          <input 
          type="text" 
          className='p-2 bg-zinc-900 bg-opacity-75 rounded-md outline-none text-white placeholder-zinc-400'
          value={guildId} 
          onChange={(e) => setGuildId(e.target.value)}
          placeholder='Enter your Guild ID'
          required />
        </div>
        <div className='w-full flex items-center justify-between'>
          <label className='text-white'>Password:</label>
          <input
          type="password" 
          className='p-2  bg-zinc-900 bg-opacity-75 rounded-md outline-none text-white placeholder-zinc-400'
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder='Enter your password'
          required />
        </div>
        <button 
        type="submit"
        className='p-2 w-20 text-lg font-WorkSans bg-zinc-950 text-white rounded-md self-center hover:text-teal-300 hover:bg-zinc-800 transition-transform transform hover:scale-105'
        >Login</button>
      </form>
    </div>
  );
};

export default Login;