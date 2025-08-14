// filepath: src/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Hero from '../assets/images/HeroImage.webp';

const Login = ({ setAuth }) => {
  const [guildId, setGuildId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('https://szymonsamus.dev/grippendor-backend/login', {
        guildId,
        password
      });
      if (response.data.success) {
        // Set auth state - no need to store token in localStorage
        setAuth({ guildId });
        // Navigate will happen automatically due to the auth state change
      } else {
        setError('Invalid credentials');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
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
        className='p-2 xs:p-8 w-4/5 md:w-1/2 ap:w-1/3 4k:h-1/3 4k:w-1/5 max-w-full shadow-lg bg-zinc-900 bg-opacity-90 justify-center items-start flex flex-col gap-4'
      >
        <h2 className='font-WorkSans text-2xl xs:text-4xl md:text-5xl 4k:text-9xl text-white self-center pt-8'><span className="text-teal-300">G</span>ripendor<span className='text-teal-300'>B</span>ot</h2>
        <a className='text-lg text-teal-300 no-underline hover:underline mb-8 cursor-pointer self-center' href="https://discord.com/oauth2/authorize?client_id=1306969234261147718" target="_blank">Add the bot to your server!</a>
        {error && <p className="error text-teal-300 text-xl uppercase">{error}</p>}
        <div className='w-full flex flex-col items-start justify-between'>
          <label className='text-white text-xs xs:text-base md:text-xl bp:text-2xl 4k:text-6xl'>Guild ID &nbsp;<a className='no-underline hover:underline text-sm text-teal-300' href="https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID" target="_blank">How to find guildID</a></label>
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