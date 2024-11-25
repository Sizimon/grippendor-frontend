import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import PartyMaker from './PartyMaker';
import WeeklyView from './WeeklyView';


function App() {
  const [attendance, setAttendance] = useState([]);
  const [names, setNames] = useState([]);
  const [config, setConfig] = useState(null);
  const [parties, setParties] = useState([]);
  const [unselectedMembers, setUnselectedMembers] = useState([]);

  const [startDate, setStartDate] = useState(new Date());
  const [currentDayIndex, setCurrentDayIndex] = useState(new Date().getDay() - 1);


  useEffect(() => {
    console.log('Fetching attendance...');
    axios.get('http://localhost:5001/attendance', {
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

      console.log('Fetching names...');
      axios.get('http://localhost:5001/names', {
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
      })

      console.log('Fetching configuration data...');
      axios.get('http://localhost:5001/config', {
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
  }, []);

  useEffect(() => {
    if (names.length > 0) {
      createParties();
    }
  }, [names]);

  const createParties = () => {
    const dps = names.filter(member => member.roles.includes('DPS'));
    const tanks = names.filter(member => member.roles.includes('Tank'));
    const healers = names.filter(member => member.roles.includes('Healer'));
    const unselected = names.filter(member => !member.roles.includes('DPS') && !member.roles.includes('Tank') && !member.roles.includes('Healer'));

    const newParties = [];
    while (dps.length >= 2 && tanks.length >= 1 && healers.length >= 1) {
      newParties.push({
        id: newParties.length + 1,
        members: [
          dps.pop(),
          dps.pop(),
          tanks.pop(),
          healers.pop()
        ]
      });
    }
    setParties(newParties);
    setUnselectedMembers(unselected);
  };

  console.log(attendance);
  console.log(names);


  function getWeekDates(start = new Date()) {
    const dates = [];
    for (let i = 1; i < 8; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() - start.getDay() + i);
      dates.push(date);
    }
    return dates;
  }

  const weekDates = getWeekDates(startDate)
  const currentDateRef = useRef(null);

  const currentDay = weekDates[currentDayIndex];
  const today = currentDay.toDateString();
  const isToday = currentDay.toDateString() === today;
  const columnClasses = `flex flex-col justify-start items-center text-white flex-grow border-t-[1px] border-b-[1px] border-primary ${isToday ? 'bg-zinc-800' : 'bg-zinc-900'} py-12 h-screen`;

  return (
    <Router>
      <div className='flex flex-col bg-zinc-900'>
        <nav className='flex justify-center px-4 bg-zinc-900'>
          <Link to="/" className='text-white uppercase font-WorkSans px-4'>Party Maker</Link>
          <Link to="/weekly" className='text-white uppercase font-WorkSans px-4'>Weekly Display</Link>
        </nav>
        <Routes>
          <Route 
          path="/" 
          element={<PartyMaker config={config} attendance={attendance} parties={parties} unselectedMembers={unselectedMembers} currentDay={currentDay} currentDateRef={currentDateRef} columnClasses={columnClasses} createParties={createParties} />} 
          />
          <Route path="/weekly" element={<WeeklyView names={names} attendance={attendance} weekDates={weekDates} config={config} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
