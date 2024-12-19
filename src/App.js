import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link, useLocation, useParams } from 'react-router-dom';
import Home from './Home';
import PartyMaker from './PartyMaker';
import WeeklyView from './WeeklyView';
import Banner from './assets/images/Banner.png';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:guildId/*" element={<AppContent />} />
      </Routes>
    </Router>
  );
}

const AppContent = () => {
  const { guildId } = useParams();
  const [attendance, setAttendance] = useState([]);
  const [names, setNames] = useState([]);
  const [config, setConfig] = useState(null);
  const [parties, setParties] = useState([]);
  const [unselectedMembers, setUnselectedMembers] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [currentDayIndex, setCurrentDayIndex] = useState(new Date().getDay() - 1);
  const currentDateRef = useRef(null);

  useEffect(() => {
    const fetchAttendance = () => {
      console.log('Fetching attendance...');
      axios.get(`http://localhost:5001/attendance/${guildId}`, {
        headers: {
          'x-api-key': process.env.API_KEY || 'qu9ul8',
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
    const intervalId = setInterval(fetchAttendance, 10000); // Poll every 5 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [guildId]);

  useEffect(() => {
    console.log('Fetching names...');
    axios.get(`http://localhost:5001/names`, {
      headers: {
        'x-api-key': process.env.API_KEY || 'qu9ul8',
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
        'x-api-key': process.env.API_KEY || 'qu9ul8',
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
  }, [guildId]);

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
        className='h-44 flex flex-col'
        style={{
          backgroundImage: `url(${Banner})`,
          backgroundSize: 'cover',
        }}>
        <nav 
          className='flex justify-center px-4 bg-zinc-900 bg-opacity-60'
        >
          <Link to={`/${guildId}`} className='text-white uppercase font-WorkSans px-4'>Dashboard</Link>
          <Link to={`/${guildId}/party-maker`} className='text-white uppercase font-WorkSans px-4'>Party Maker</Link>
          <Link to={`/${guildId}/weekly`} className='text-white uppercase font-WorkSans px-4'>Weekly Display</Link>
        </nav>
        <div className='flex flex-grow justify-center h-fit items-center'>
          <h1 className='justify-center text-center uppercase text-4xl text-primary font-WorkSans bg-zinc-900 p-4 bg-opacity-75 rounded'>
            {config ? `${config.title} - ${getPageTitle()}` : 'Guild Manager'}
          </h1>
        </div>
      </div>
      <Routes>
        <Route path="/" element={<Home config={config} />} />
        <Route 
          path="party-maker" 
          element={<PartyMaker config={config} names={names} parties={parties} unselectedMembers={unselectedMembers} currentDay={currentDay} currentDateRef={currentDateRef} columnClasses={columnClasses} createParties={createParties} />} 
        />
        <Route path="weekly" element={<WeeklyView names={names} attendance={attendance} weekDates={weekDates} config={config} />} />
      </Routes>
    </div>
  );
};

export default App;