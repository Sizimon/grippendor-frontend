import React, { useRef } from 'react';
import Lottie from 'lottie-react';
import Loading from './assets/loading.json';
import DPS from './assets/images/DPS.png';
import TANK from './assets/images/TANK.png';
import HEALER from './assets/images/HEALER.png';

const PartyMaker = ({ config, attendance, parties, unselectedMembers, currentDay, currentDateRef, columnClasses, createParties }) => (
  <div className='flex flex-col'>
    <div className='flex justify-center px-4 bg-zinc-900'>
      <button onClick={createParties} className='text-white uppercase font-WorkSans'>Create a party +</button>
    </div>
    <div className='flex flex-col'>
      {attendance.length > 0 ? (
        <div
          {...(currentDay.toDateString() === new Date().toDateString() ? { ref: currentDateRef } : null)}
          className={columnClasses}
        >
          <h2 className='uppercase text-center text-lg font-WorkSans py-4 border-primary border-b-[1px]'>
            <span className='text-primary'>
              {currentDay.toDateString().slice(0, 3)}
            </span> {currentDay.toDateString().slice(3)}
          </h2>
          <div className='grid grid-flow-row grid-cols-4 w-full px-10'>
            {parties.map((party, partyIndex) => (
              <div key={partyIndex} className='col-span-1 bg-zinc-900 rounded-lg m-4 p-4'>
                <h3 className='text-center text-lg font-WorkSans py-2'>Party {party.id}</h3>
                {party.members.map((member, memberIndex) => {
                  const attended = attendance.some(entry => {
                    const entryDate = new Date(entry.date).toDateString();
                    const isAttended = entryDate === currentDay.toDateString() && entry.names.includes(member.name);
                    return isAttended;
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
            ))}
          </div>
        </div>
      ) : (
        <div className='bg-zinc-800 h-screen flex flex-col justify-center items-center'>
          <Lottie animationData={Loading} style={{ width: 200, height: 200 }} />
        </div>
      )}
    </div>
    {unselectedMembers.length > 0 && (
      <div className='unselected-members'>
        <h2 className='text-white'>Unselected Role</h2>
        <div className='members'>
          {unselectedMembers.map(member => (
            <div key={member.name} className='member'>
              <span className='text-white'>{member.name}</span>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

export default PartyMaker;