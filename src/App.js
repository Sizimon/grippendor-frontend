import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link, useLocation, useParams, Navigate, useNavigate } from 'react-router-dom';
import Home from './Home';
import PartyMaker from './PartyMaker';
import Events from './Events';
import Login from './Login';
import Banner from './assets/images/banner-spf.png';
import MenuButton from './MenuButton';

function App() {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const storedAuth = sessionStorage.getItem('auth')
    if (storedAuth) {
      setAuth(JSON.parse(storedAuth));
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/bot-dashboard/login" element={<Login setAuth={setAuth} />} />
        <Route path="/bot-dashboard" element={auth ? <Navigate to={`/${auth.guildId}`} /> : <Navigate to="/bot-dashboard/login" />} />
        <Route path="/bot-dashboard/:guildId/*" element={auth ? <AppContent auth={auth} setAuth={setAuth} /> : <Navigate to="/bot-dashboard/login" />} />
      </Routes>
    </Router>
  );
}

const AppContent = ({ auth, setAuth }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { guildId } = useParams();
  const [userData, setUserData] = useState([]);
  const [events, setEvents] = useState([]);
  const [eventUserData, setEventUserData] = useState([]);
  const [config, setConfig] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Hamburger States
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState(false);

  // TRIAL WIP (NOT TESTED CHANGES!!!) -----------------------------------------
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
        setActive(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen, active]);
  // END Hamburger States -------------------------------------------------------

  // FETCHES 

  useEffect(() => {
    console.log('Fetching configuration data...');
    axios.get(`https://szymonsamus.dev/bot-backend/config/${guildId}`, {
      headers: {
        'Authorization': `Bearer ${auth.token}`,
      },
    })
      .then(response => {
        console.log('Configuration data fetched:', response.data);
        setConfig(response.data);
        if (response.data.color) {
          document.documentElement.style.setProperty('--color-primary', response.data.color);
        }
      })
      .catch(error => {
        console.error(error);
      });

    console.log('Fetching Guild Users...');
    axios.get(`https://szymonsamus.dev/bot-backend/userdata/${guildId}`, {
      headers: {
        'Authorization': `Bearer ${auth.token}`,
      },
    })
      .then(response => {
        console.log('Guild usernames fetched:', response.data);
        if (response.data) {
          setUserData(response.data);
        }
      })
      .catch(error => {
        console.error(error);
      });

    axios.get(`https://szymonsamus.dev/bot-backend/eventdata/${guildId}`, {
      headers: {
        'Authorization': `Bearer ${auth.token}`,
      },
    })
      .then(response => {
        const data = response.data;
        console.log('Events:', data.events);
        setEvents(data.events);
        console.log('Latest Event User Data:', data.latestEventUserData);
        setEventUserData(data.latestEventUserData);
      })
      .catch(error => {
        console.error(error);
      });
  }, [guildId, auth.token]);

  // END FETCHES

  // EVENT HANDLING
  const latestEvent = events[events.length - 1];
  const previousEvent = events[events.length - 2];
  // END

  // FORMATTING DATES
  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return new Intl.DateTimeFormat('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZoneName: 'short',
    }).format(date);
  }

  const handleSignOut = () => {
    sessionStorage.removeItem('auth');
    setAuth(null);
    navigate('/bot-dashboard/login');
  };

  return (
    <div className='flex flex-col bg-zinc-900'>
      <nav
        className={`${isScrolled ? 'sticky top-0 bg-opacity-60' : 'top-0'
          } flex z-30 items-center justify-between px-4 md:py-[2.5vh] 4k:py-[2.5vh] 4k:px-[2.5vw] bg-zinc-900 w-full transition-all duration-300`}
      >
        <div className='text-white uppercase font-WorkSans px-4 text-base md:text-2xl bp:text-4xl 4k:text-8xl'>
          <span className='text-primary'>G</span>uild<span className='text-primary'>T</span>racker
        </div>
        <div className='bp:hidden flex justify-center items-center'>
          <MenuButton
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            active={active}
            setActive={setActive}
          />
        </div>
        <div ref={dropdownRef} id="dropdown" className={`absolute top-10 md:top-16 right-4 z-10 ${!menuOpen ? 'hidden' : 'block'} bg-zinc-900 divide-y divide-gray-100 shadow-sm w-44`}>
          <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
            <div className='font-WorkSans uppercase'>Logged in as:</div>
            <div className="font-medium font-WorkSans truncate text-primary">{config ? `${config.title}` : 'GuildTracker'}</div>
            <div className="text-xs truncate text-primary">{guildId}</div>
          </div>
          <ul className="py-2 text-sm text-zinc-200" aria-labelledby="dropdownInformationButton">
            <li>
              <Link to={`/bot-dashboard/${guildId}`} className='text-white transition delay-50 duration-200 ease-in-out hover:text-primary font-WorkSans px-4 py-2 uppercase'>Dashboard</Link>
            </li>
            <li>
              <Link to={`/bot-dashboard/${guildId}/party-maker`} className='text-white transition delay-50 duration-200 ease-in-out hover:text-primary font-WorkSans px-4 py-2 uppercase'>Party Maker</Link>
            </li>
            <li>
              <Link to={`/bot-dashboard/${guildId}/events`} className='text-white transition delay-50 duration-200 ease-in-out hover:text-primary font-WorkSans px-4 py-2 uppercase'>Events</Link>
            </li>
          </ul>
          <div className="py-2">
            <p 
            className="px-4 py-2 text-sm font-WorkSans uppercase text-zinc-200 hover:text-primary"
            onClick={() => handleSignOut()}
            >Sign out</p>
          </div>
        </div>
        <div className='hidden bp:flex bp:flex-row gap-4'>
          <Link to={`/bot-dashboard/${guildId}`} className='text-white transition delay-50 duration-200 ease-in-out hover:text-primary hover:scale-105 text-xl 4k:text-6xl uppercase font-WorkSans px-4'>Dashboard</Link>
          <Link to={`/bot-dashboard/${guildId}/party-maker`} className='text-white transition delay-50 duration-200 ease-in-out hover:text-primary hover:scale-105 text-xl 4k:text-6xl uppercase font-WorkSans px-4'>Party Maker</Link>
          <Link to={`/bot-dashboard/${guildId}/events`} className='text-white transition delay-50 duration-200 ease-in-out hover:text-primary hover:scale-105 text-xl 4k:text-6xl uppercase font-WorkSans px-4'>Events</Link>
        </div>
      </nav>
      <div
        className='h-[20vh] ap:h-[30vh]'
        style={{
          backgroundImage: `url(${Banner})`,
          backgroundSize: 'cover',
        }} />
      <Routes>
        <Route path="/" element={<Home auth={auth} config={config} userData={userData} latestEvent={latestEvent} previousEvent={previousEvent} formatDateTime={formatDateTime} guildId={guildId} />} />
        <Route
          path="party-maker"
          element={<PartyMaker auth={auth} config={config} eventUserData={eventUserData} latestEvent={latestEvent} formatDateTime={formatDateTime} events={events} />}
        />
        <Route path="events" element={<Events auth={auth} events={events} formatDateTime={formatDateTime} config={config} />} />
      </Routes>
    </div>
  );
};

export default App;