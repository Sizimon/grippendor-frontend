import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link, useLocation, useParams, Navigate } from 'react-router-dom';
import Home from './Home';
import PartyMaker from './PartyMaker';
import WeeklyView from './WeeklyView';
import Login from './Login';
import Banner from './assets/images/Banner.png';
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
        <Route path="/login" element={<Login setAuth={setAuth} />} />
        <Route path="/" element={auth ? <Navigate to={`/${auth.guildId}`} /> : <Navigate to="/login" />} />
        <Route path="/:guildId/*" element={auth ? <AppContent auth={auth} /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

const AppContent = ({ auth }) => {
  const { guildId } = useParams();
  const [attendance, setAttendance] = useState([]);
  const [names, setNames] = useState([]);
  const [config, setConfig] = useState(null);
  const [parties, setParties] = useState([]);
  const [unselectedMembers, setUnselectedMembers] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [currentDayIndex, setCurrentDayIndex] = useState(new Date().getDay() - 1);
  const currentDateRef = useRef(null);

  // Hamburger States
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const fetchAttendance = () => {
      console.log('Fetching attendance...');
      axios.get(`http://localhost:5001/attendance/${guildId}`, {
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      })
        .then(response => {
          console.log('Attendance fetched:', response.data);
          setAttendance(response.data);
        })
        .catch(error => {
          console.error(error);
        });
    };

    fetchAttendance();
    const intervalId = setInterval(fetchAttendance, 60000); // Poll every 10 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [guildId, auth.token]);

  useEffect(() => {
    console.log('Fetching names...');
    axios.get(`http://localhost:5001/names/${guildId}`, {
      headers: {
        'Authorization': `Bearer ${auth.token}`,
      },
    })
      .then(response => {
        console.log('Names fetched:', response.data);
        setNames(response.data);
      })
      .catch(error => {
        console.error(error);
      });

    console.log('Fetching configuration data...');
    axios.get(`http://localhost:5001/config/${guildId}`, {
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
  }, [guildId, auth.token]);

  useEffect(() => {
    if (names.length > 0 && config) {
      createParties();
    }
  }, [names, config]);

  const createParties = () => {
    const dps = names.filter(member => member.roles && member.roles.includes('DPS'));
    const tanks = names.filter(member => member.roles && member.roles.includes('Tank'));
    const healers = names.filter(member => member.roles && member.roles.includes('Healer'));
    const unselected = names.filter(member => !member.roles || (!member.roles.includes('DPS') && !member.roles.includes('Tank') && !member.roles.includes('Healer')));

    const newParties = [];
    while (dps.length >= 2 && tanks.length >= 1 && healers.length >= 1) {
      newParties.push({
        id: newParties.length + 1,
        members: [
          dps.pop(),
          dps.pop(),
          tanks.pop(),
          healers.pop(),
        ],
      });
    }
    setParties(newParties);
    setUnselectedMembers(unselected);
  };

  const getWeekDates = (start = new Date()) => {
    const dates = [];
    for (let i = 1; i < 8; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() - start.getDay() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates(startDate);
  const today = new Date().toDateString();
  const currentDay = weekDates[currentDayIndex];
  const columnClasses = `flex flex-col justify-start items-center text-white flex-grow border-t-[1px] border-b-[1px] border-primary ${currentDay.toDateString() === today ? 'bg-zinc-800' : 'bg-zinc-900'} py-12 h-screen`;

  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case `/${guildId}/party-maker`:
        return 'Party Maker';
      case `/${guildId}/weekly`:
        return 'Weekly Display';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className='flex flex-col bg-zinc-900'>
      <div
        className='h-[20vh] flex flex-col'
        style={{
          backgroundImage: `url(${Banner})`,
          backgroundSize: 'cover',
        }}>
        <nav
          className='flex items-center justify-between px-4 md:py-2 bp:py-0 bg-zinc-900 bg-opacity-60'
        >
          <div className='text-white uppercase font-WorkSans px-4 text-base md:text-2xl bp:text-3xl'><span className='text-primary'>G</span>uild<span className='text-primary'>T</span>racker</div>
          <div className='bp:hidden flex justify-center items-center'>
            <MenuButton
              menuOpen={menuOpen}
              setMenuOpen={setMenuOpen}
              active={active}
              setActive={setActive}
            />
          </div>
          <div id="dropdown" className={`absolute top-10 md:top-16 right-4 z-10 ${!menuOpen ? 'hidden' : 'block'} bg-zinc-900 divide-y divide-gray-100 rounded-lg shadow-sm w-44`}>
            <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
              <div className='font-WorkSans uppercase'>Logged in as:</div>
              <div className="font-medium font-WorkSans truncate text-primary">{config ? `${config.title}`: 'GuildTracker'}</div>
              <div className="text-xs truncate text-primary">{guildId}</div>
            </div>
            <ul className="py-2 text-sm text-zinc-200" aria-labelledby="dropdownInformationButton">
              <li>
                <Link to={`/${guildId}`} className='text-white hover:text-primary font-WorkSans px-4 py-2'>Dashboard</Link>
              </li>
              <li>
                <Link to={`/${guildId}/party-maker`} className='text-white hover:text-primary font-WorkSans px-4 py-2'>Party Maker</Link>
              </li>
              <li>
                <Link to={`/${guildId}/weekly`} className='text-white hover:text-primary font-WorkSans px-4 py-2'>Weekly Display</Link>
              </li>
            </ul>
            <div className="py-2">
              <a href="#" className="px-4 py-2 text-sm font-WorkSans uppercase text-zinc-200 hover:text-primary">Sign out</a>
            </div>
          </div>
          <div className='hidden bp:flex bp:flex-row gap-4'>
            <Link to={`/${guildId}`} className='text-white transition delay-100 duration-200 hover:text-primary hover:scale-105 text-xl uppercase font-WorkSans px-4'>Dashboard</Link>
            <Link to={`/${guildId}/party-maker`} className='text-white transition delay-100 duration-200 hover:text-primary hover:scale-105 text-xl uppercase font-WorkSans px-4'>Party Maker</Link>
            <Link to={`/${guildId}/weekly`} className='text-white transition delay-100 duration-200 hover:text-primary hover:scale-105 text-xl uppercase font-WorkSans px-4'>Weekly Display</Link>
          </div>
          {/* <MenuButton
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            active={active}
            setActive={setActive}
          />
          <div className={`flex flex-col md:flex-row gap-4 ${menuOpen ? 'flex' : 'hidden'}`}>
            <Link to={`/${guildId}`} className='text-white uppercase font-WorkSans px-4'>Dashboard</Link>
            <Link to={`/${guildId}/party-maker`} className='text-white uppercase font-WorkSans px-4'>Party Maker</Link>
            <Link to={`/${guildId}/weekly`} className='text-white uppercase font-WorkSans px-4'>Weekly Display</Link>
          </div>  */}
        </nav>
        <div className='flex flex-grow justify-center h-fit items-center'>
          <h1 className='justify-center text-center uppercase text-2xl md:text-4xl bp:text-5xl text-primary font-WorkSans bg-zinc-900 p-4 bg-opacity-75 rounded'>
            {config ? `${config.title} - ${getPageTitle()}` : 'Guild Manager'}
          </h1>
        </div>
      </div>
      <Routes>
        <Route path="/" element={<Home auth={auth} config={config} />} />
        <Route
          path="party-maker"
          element={<PartyMaker auth={auth} config={config} names={names} parties={parties} unselectedMembers={unselectedMembers} currentDay={currentDay} currentDateRef={currentDateRef} columnClasses={columnClasses} createParties={createParties} />}
        />
        <Route path="weekly" element={<WeeklyView auth={auth} names={names} attendance={attendance} weekDates={weekDates} config={config} />} />
      </Routes>
    </div>
  );
};

export default App;