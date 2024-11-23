import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Lottie from 'lottie-react';
import Loading from './assets/loading.json';

function App() {
  const [attendance, setAttendance] = useState([]);
  const [names, setNames] = useState([]);
  const [config, setConfig] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [currentDayIndex, setCurrentDayIndex] = useState(new Date().getDay() - 1);
  const [showWeekly, setShowWeekly] = useState(false);


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

  const handlePreviousDay = () => {
    setCurrentDayIndex((prevIndex) => (prevIndex > 0 ? prevIndex -1 : 6));
  };

  const handleNextDay = () => {
    setCurrentDayIndex((prevIndex) => (prevIndex < 6 ? prevIndex + 1 : 0));
  };

  const toggleView = () => {
    setShowWeekly((prevShowWeekly) => !prevShowWeekly);
  }

  const currentDay = weekDates[currentDayIndex];
  const today = currentDay.toDateString();
  const isToday = currentDay.toDateString() === today;
  const columnClasses = `flex flex-col justify-start items-center text-white flex-grow border-r border-white ${isToday ? 'bg-zinc-800' : ''} py-12`;

  const parties = [
    'Party 1',
    'Party 2',
    'Party 3',
    'Party 4',
    'Party 5',
    'Party 6',
    'Party 7',
    'Party 8',
    'Party 9',
    'Party 10',
  ]

  return (
    <div className='flex flex-col bg-primary'>
      <h1 className='justify-center text-center uppercase text-2xl text-secondary font-WorkSans py-6'>WEBBERS : Attendance Log</h1>
      <div className='flex justify-center px-4 bg-primary'>
        <button onClick={toggleView} className='text-white uppercase font-WorkSans'>{showWeekly ? 'Show Day' : 'Show Week'}</button>
      </div>
      <div className='flex justify-between px-4 bg-primary'>
        <button onClick={handlePreviousDay} className='text-white uppercase font-WorkSans'>Previous</button>
        <button onClick={handleNextDay} className='text-white uppercase font-WorkSans'>Next</button>
      </div>
      <div className='flex flex-col'>
        {attendance.length > 0 ? (
          showWeekly ? ( 
            weekDates.map((date, index) => {
            const isToday = date.toDateString() === today;
            const columnClasses = `flex flex-col justify-start items-center text-white flex-grow border-r border-white ${isToday ? 'bg-zinc-800' : ''} py-12`;

            return (
              <div
                {...(isToday ? { ref: currentDateRef } : (null))}
                key={index}
                className={columnClasses}
              >
                <h2
                  className='uppercase text-center text-lg font-WorkSans py-4 border-secondary border-b-[1px]'
                >
                  <span className='text-secondary'>
                    {date.toDateString().slice(0, 3)}
                  </span> {date.toDateString().slice(3)}
                </h2>
                <div className='grid grid-flow-row grid-cols-4 w-full px-10'>
                {parties.map((party, partyIndex) => (
                      <div key={partyIndex} className='col-span-1'>
                        <h3 className='text-center text-lg font-WorkSans py-2'>{party}</h3>
                        {names.slice(partyIndex * 6, (partyIndex + 1) * 6).map((name, nameIndex) => {
                          const attended = attendance.some(entry => {
                            const entryDate = new Date(entry.date).toDateString();
                            const isAttended = entryDate === date.toDateString() && entry.names.includes(name);
                            return isAttended;
                          });
                          return (
                            <div key={nameIndex} className='flex items-center p-2 m-1 border-[1px] border-secondary'>
                              <span>{name}</span>
                              <span className={`w-4 h-4 border-[1px] m-2 rounded-full ${attended ? 'bg-green-600' : 'border-gray-500'}`}></span>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                </div>
              </div>
            );
          })
        ) : (
          <div
              {...(isToday ? { ref: currentDateRef } : (null))}
              className={columnClasses}
            >
              <h2
                className='uppercase text-center text-lg font-WorkSans py-4 border-secondary border-b-[1px]'
              >
                <span className='text-secondary'>
                  {currentDay.toDateString().slice(0, 3)}
                </span> {currentDay.toDateString().slice(3)}
              </h2>
              <div className='grid grid-flow-row grid-cols-4 w-full px-10'>
              {parties.map((party, partyIndex) => (
                  <div key={partyIndex} className='col-span-1'>
                    <h3 className='text-center text-lg font-WorkSans py-2'>{party}</h3>
                    {names.slice(partyIndex * 6, (partyIndex + 1) * 6).map((name, nameIndex) => {
                      const attended = attendance.some(entry => {
                        const entryDate = new Date(entry.date).toDateString();
                        const isAttended = entryDate === currentDay.toDateString() && entry.names.includes(name);
                        return isAttended;
                      });
                      return (
                        <div key={nameIndex} className='flex items-center p-2 m-1 border-[1px] border-secondary'>
                          <span>{name}</span>
                          <span className={`w-4 h-4 border-[1px] m-2 rounded-full ${attended ? 'bg-green-600' : 'border-gray-500'}`}></span>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
        )
        ) : (
          <div className='bg-zinc-800 h-screen flex flex-col justify-center items-center'>
            <Lottie animationData={Loading} style={{ width: 200, height: 200 }} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
