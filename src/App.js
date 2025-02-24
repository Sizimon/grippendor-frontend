import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link, useLocation, useParams, Navigate } from 'react-router-dom';
import Home from './Home';
import PartyMaker from './PartyMaker';
import WeeklyView from './WeeklyView';
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
        <Route path="/login" element={<Login setAuth={setAuth} />} />
        <Route path="/" element={auth ? <Navigate to={`/${auth.guildId}`} /> : <Navigate to="/login" />} />
        <Route path="/:guildId/*" element={auth ? <AppContent auth={auth} /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

const getWeekDates = (start = new Date()) => {
  const dates = [];
  const dayOfWeek = (start.getDay() + 6) % 7; // Adjust to make Monday the start of the week
  const startOfWeek = new Date(start); // Clone the start date

  // Adjust the start date to the previous Monday
  startOfWeek.setDate(start.getDate() - dayOfWeek);

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    dates.push(date);
  }
  return dates;
};

const AppContent = ({ auth }) => {
  const location = useLocation();
  const { guildId } = useParams();
  const [attendance, setAttendance] = useState([]);
  const [userData, setUserData] = useState([]);
  const [events, setEvents] = useState([]);
  const [eventUserData, setEventUserData] = useState([]);
  const [config, setConfig] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const startDate = new Date();
  const currentDayIndex = (new Date().getDay() + 6) % 7;
  const currentDateRef = useRef(null);
  const weekDates = getWeekDates(startDate);
  const today = new Date().toDateString();
  const currentDay = weekDates[currentDayIndex];

  const columnClasses = `flex flex-col justify-start items-center text-white flex-grow border-t-[1px] border-b-[1px] border-primary ${currentDay && currentDay.toDateString() === today ? 'bg-zinc-800' : 'bg-zinc-900'} py-12 h-screen`;

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
  // const getPageTitle = () => {
  //   switch (location.pathname) {
  //     case `/${guildId}/party-maker`:
  //       return 'Party Maker';
  //     case `/${guildId}/weekly`:
  //       return 'Weekly Display';
  //     default:
  //       return 'Dashboard';
  //   }
  // };

  // Hamburger States
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState(false);

  // FETCHES 

  useEffect(() => {
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

    console.log('Fetching Guild Users...');
    axios.get(`http://localhost:5001/userdata/${guildId}`, {
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

    axios.get(`http://localhost:5001/eventdata/${guildId}`, {
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

  // END FETCHES

  return (
    <div className='flex flex-col bg-zinc-900'>
      <nav
        className={`${isScrolled ? 'sticky top-0 bg-opacity-60' : 'top-0'
          } flex items-center justify-between px-4 md:py-[2.5vh] 4k:py-[2.5vh] 4k:px-[2.5vw] bg-zinc-900 w-full transition-all duration-300`}
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
        <div id="dropdown" className={`absolute top-10 md:top-16 right-4 z-10 ${!menuOpen ? 'hidden' : 'block'} bg-zinc-900 divide-y divide-gray-100 rounded-lg shadow-sm w-44`}>
          <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
            <div className='font-WorkSans uppercase'>Logged in as:</div>
            <div className="font-medium font-WorkSans truncate text-primary">{config ? `${config.title}` : 'GuildTracker'}</div>
            <div className="text-xs truncate text-primary">{guildId}</div>
          </div>
          <ul className="py-2 text-sm text-zinc-200" aria-labelledby="dropdownInformationButton">
            <li>
              <Link to={`/${guildId}`} className='text-white transition delay-50 duration-200 ease-in-out hover:text-primary font-WorkSans px-4 py-2'>Dashboard</Link>
            </li>
            <li>
              <Link to={`/${guildId}/party-maker`} className='text-white transition delay-50 duration-200 ease-in-out hover:text-primary font-WorkSans px-4 py-2'>Party Maker</Link>
            </li>
            <li>
              <Link to={`/${guildId}/weekly`} className='text-white transition delay-50 duration-200 ease-in-out hover:text-primary font-WorkSans px-4 py-2'>Weekly Display</Link>
            </li>
          </ul>
          <div className="py-2">
            <a href="#" className="px-4 py-2 text-sm font-WorkSans uppercase text-zinc-200 hover:text-primary">Sign out</a>
          </div>
        </div>
        <div className='hidden bp:flex bp:flex-row gap-4'>
          <Link to={`/${guildId}`} className='text-white transition delay-50 duration-200 ease-in-out hover:text-primary hover:scale-105 text-xl 4k:text-6xl uppercase font-WorkSans px-4'>Dashboard</Link>
          <Link to={`/${guildId}/party-maker`} className='text-white transition delay-50 duration-200 ease-in-out hover:text-primary hover:scale-105 text-xl 4k:text-6xl uppercase font-WorkSans px-4'>Party Maker</Link>
          <Link to={`/${guildId}/weekly`} className='text-white transition delay-50 duration-200 ease-in-out hover:text-primary hover:scale-105 text-xl 4k:text-6xl uppercase font-WorkSans px-4'>Weekly Display</Link>
        </div>
      </nav>
      <div
        className='h-[20vh] ap:h-[30vh]'
        style={{
          backgroundImage: `url(${Banner})`,
          backgroundSize: 'cover',
        }} />
      <Routes>
        <Route path="/" element={<Home auth={auth} config={config} userData={userData} events={events} />} />
        <Route
          path="party-maker"
          element={<PartyMaker auth={auth} config={config} userData={userData} eventUserData={eventUserData} currentDay={currentDay} currentDateRef={currentDateRef} columnClasses={columnClasses} />}
        />
        <Route path="weekly" element={<WeeklyView auth={auth} userData={userData} attendance={attendance} weekDates={weekDates} currentDateRef={currentDateRef} config={config} />} />
      </Routes>
    </div>
  );
};

export default App;