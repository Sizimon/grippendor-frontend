import React from 'react';
import DPS from './assets/images/DPS.png';
import TANK from './assets/images/TANK.png';
import HEALER from './assets/images/HEALER.png';

const WeeklyDisplay = ({ names, attendance, weekDates, config }) => {
  const today = new Date().toDateString();

  return (
    <div className='flex flex-col bg-zinc-900'>
      <div className='flex flex-col'>
        {weekDates.map((date, index) => {
          const isToday = date.toDateString() === today;
          const columnClasses = `flex flex-col justify-start items-center text-white flex-grow ${isToday ? 'bg-zinc-800' : 'bg-zinc-900'} py-12 border-t-[1px] border-primary`;

          return (
            <div key={index} className={columnClasses}>
              <h2 className='uppercase text-center text-lg font-WorkSans py-4 border-primary border-b-[1px]'>
                <span className='text-primary'>
                  {date.toDateString().slice(0, 3)}
                </span> {date.toDateString().slice(3)}
              </h2>
              <div className='grid grid-flow-row grid-cols-4 w-full px-10'>
                {names.map((member, memberIndex) => {
                  const attended = attendance.some(entry => {
                    const entryDate = new Date(entry.date).toDateString();
                    return entryDate === date.toDateString() && entry.names.includes(member.name);
                  });
                  return (
                    <div key={memberIndex} className='flex items-center p-2 m-1 border-[1px] border-primary'>
                      <span>{member.name} - </span>
                      {member.roles.includes('DPS') && <img src={DPS} alt="DPS" className="w-6 h-6 ml-2" />}
                      {member.roles.includes('Tank') && <img src={TANK} alt="Tank" className="w-6 h-6 ml-2" />}
                      {member.roles.includes('Healer') && <img src={HEALER} alt="Healer" className="w-6 h-6 ml-2" />}
                      <span className={`w-4 h-4 border-[1px] m-2 rounded-full ${attended ? 'bg-green-600' : 'border-gray-500'}`}></span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyDisplay;