import React, { useRef } from 'react';
import Lottie from 'lottie-react';
import Loading from './assets/loading.json';

const PartyMaker = ({ config, attendance, parties, unselectedMembers, currentDay, currentDateRef, columnClasses, createParties }) => (
  <div className='flex flex-col'>
    <h1 className='justify-center text-center uppercase text-4xl text-primary font-WorkSans py-6'>
      {config ? config.title : 'Guild Manager'}
    </h1>
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
              <div key={partyIndex} className='col-span-1'>
                <h3 className='text-center text-lg font-WorkSans py-2'>Party {party.id}</h3>
                {party.members.map((member, memberIndex) => {
                  const attended = attendance.some(entry => {
                    const entryDate = new Date(entry.date).toDateString();
                    const isAttended = entryDate === currentDay.toDateString() && entry.names.includes(member.name);
                    return isAttended;
                  });
                  return (
                    <div key={memberIndex} className='flex items-center p-2 m-1 border-[1px] border-primary'>
                      <span>{member.name} - {member.roles.join(', ')}</span>
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