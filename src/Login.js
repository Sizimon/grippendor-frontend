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
      const response = await axios.post('https://szymonsamus.dev/bot-backend/login', { guildId, password }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.data.success) {
        setAuth({ guildId, token: response.data.token });
        navigate(`/bot-dashboard/${guildId}`);
      } else {
        setError('Invalid guildId or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(`Error: ${err.response ? err.response.data.message : err.message}`);
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
        className='p-2 xs:p-8 w-[80vw] md:w-[50vw] ap:w-[30vw] 4k:h-[30vh] 4k:w-[20vw] shadow-lg bg-zinc-900 bg-opacity-90 justify-center items-start flex flex-col gap-4'
      >
        <h2 className='font-WorkSans text-2xl xs:text-4xl md:text-5xl bp:text-6xl ap:text-6xl 4k:text-9xl text-white self-center py-[2vh]'><span className="text-teal-300">G</span>uild<span className='text-teal-300'>T</span>racker</h2>
        {error && <p className="error">{error}</p>}
        <div className='w-full flex flex-col items-start justify-between'>
          <label className='text-white text-xs xs:text-base md:text-xl bp:text-2xl 4k:text-6xl'>Guild ID</label>
          <input
            type="text"
            className='p-2 w-full bg-zinc-800 bg-opacity-75 rounded-full outline-none text-white text-xs xs:text-base md:text-xl bp:text-2xl 4k:text-6xl placeholder-zinc-400'
            value={guildId}
            onChange={(e) => setGuildId(e.target.value)}
            placeholder='GuildID'
            title='Copy your discord server ID and use it as your guild ID to login.'
            required />
        </div>
        <div className='w-full flex flex-col items-start justify-between pb-[2vh]'>
          <label className='text-white text-xs xs:text-base md:text-xl bp:text-2xl 4k:text-6xl'>Password</label>
          <input
            type="password"
            className='p-2 w-full bg-zinc-800 bg-opacity-75 rounded-full outline-none text-white text-xs xs:text-base md:text-xl bp:text-2xl 4k:text-6xl placeholder-zinc-400'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Password'
            title='Use the password provided during bot setup to login, or contact your server admin for the password.'
            required />
        </div>
        <button 
        type="submit"
        className='p-2 4k:p-6 w-[20vw] md:w-[10vw] 4k:w-[5vw] font-WorkSans xs:text-lg md:text-2xl bp:text-3xl 4k:text-7xl rounded-md self-center transition delay-50 duration-200 ease-in-out bg-zinc-950 text-white hover:text-teal-300 hover:bg-zinc-800 hover:scale-105 hover:translate-y-1'
        >Login</button>
      </form>
    </div>
  );
};

export default Login;