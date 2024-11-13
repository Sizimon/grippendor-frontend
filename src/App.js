import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Lottie from 'lottie-react';
import Loading from './assets/loading.json';

function App() {
  const [attendance, setAttendance] = useState([]);
  const [startDate, setStartDate] = useState(new Date());

  const names = [
    'Hissingen',
    'Napocalypse',
    'Ripii',
    'vonCloud',
    'Ewaldi',
    'LordLucky',
    'TOMYLO',
    'AvgCasualPlayer',
    'Dayko',
    'vvvv4',
    'MasterNipp',
    'Ahm3d',
    'Silwa',
    'Dwho',
    'PizzaThePasta',
    'RBxx',
    'Kartong',
    'Riassz',
    'IBMKI',
    'Hasrudiin',
    'SuraAO',
    'Elper',
    'SuddenX',
    'Shantra',
    'Mikuren',
    'Daajm',
    'Girlham',
    'FornaxHere',
    'MajorInsult',
    'Burnzylawd',
    'Flinga',
    'Nightmare3',
    'Atamooni',
    'Natsuuma',
    'Zdarof',
    'magedogus',
    'iAdvocate',
    'GoldenSparrow',
    'Flaapy',
    'Endofdaze',
    'prettywoman',
    'Shyvah',
    'Joheline',
    'vaLuMeiii',
    'Muzmi',
  ]

  useEffect(() => {
    // console.log('Fetching attendance...');
    axios.get('http://localhost:5001/attendance')
      .then(response => {
        // console.log('Attendance fetched:', response.data);
        setAttendance(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  console.log(attendance);

  function getMonthDates(start = new Date()) {
    const firstDay = new Date(start.getFullYear(), start.getMonth(), 1);
    const lastDay = new Date(start.getFullYear(), start.getMonth() + 1, 0);
    const dates = [];
    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }
    return dates;
  }

  const monthDates = getMonthDates(startDate);
  const currentDateRef = useRef(null);

  return (
    <div className='flex flex-col bg-primary'>
      <h1 className='justify-center text-center uppercase text-2xl text-secondary font-WorkSans py-6'>Attendance Log</h1>
      <div className='flex flex-col'>
        {attendance.length > 0 ? (
          monthDates.map((date, index) => {
            const today = date.toDateString();
            const isToday = date.toDateString() === today;
            const columnClasses = `flex flex-col justify-start items-center text-white flex-grow border-r border-white ${isToday ? 'bg-zinc-800' : ''}`;

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
                <div className='grid grid-flow-row grid-cols-5'>
                  {names.map((name, nameIndex) => {
                    const attended = attendance.some(entry => {
                      const entryDate = new Date(entry.date).toDateString();
                      const isAttended = entryDate === date.toDateString() && entry.names.includes(name);
                      // console.log(`Checking attendance for ${name} on ${date.toDateString()}: ${isAttended}`);
                      return isAttended;
                    });
                    return (
                      <div key={nameIndex} className='col-span-1 flex items-center p-4 m-2 border-[1px] border-secondary'>
                        <span>{name}</span>
                        <span className={`w-4 h-4 border-[1px] m-2 rounded-full ${attended ? 'bg-green-600' : 'border-gray-500'}`}></span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
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
