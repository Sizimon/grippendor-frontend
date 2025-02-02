import React, { useState, useEffect } from 'react';
import DPS from './assets/images/DPS.png';
import TANK from './assets/images/TANK.png';
import HEALER from './assets/images/HEALER.png';

const PartyMaker = ({ config, names, currentDay, currentDateRef, columnClasses }) => {
  const [parties, setParties] = useState([]);
  const [unselectedMembers, setUnselectedMembers] = useState([]);
  const [created, setCreated] = useState(false);

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

  useEffect(() => {
    if (created === true && names.length > 0 && config) {
      createParties();
    }
  }, [created])

  return (
    <div className='flex flex-col'>
    {created ? (
      <div className='flex flex-col'>
      <div
        {...(currentDay.toDateString() === new Date().toDateString() ? { ref: currentDateRef } : null)}
        className={columnClasses}
      >
        <h2 className='uppercase text-center text-lg font-WorkSans py-4 border-primary border-b-[1px]'>
          <span className='text-primary'>
            {currentDay.toDateString().slice(0, 3)}
          </span> {currentDay.toDateString().slice(3)}
        </h2>
        <div className='grid grid-flow-row grid-cols-1 md:grid-cols-2 bp:grid-cols-3 w-full px-10'>
          {parties.map((party, partyIndex) => (
            <div key={partyIndex} className='col-span-1 bg-zinc-900 rounded-lg m-4 p-4'>
              <h3 className='text-center text-lg font-WorkSans py-2'>Party {party.id}</h3>
              {party.members.map((member, memberIndex) => (
                <div key={memberIndex} className='flex items-center p-2 m-1 border-[1px] border-primary'>
                  <span>{member.name} - </span>
                  {member.roles.includes('DPS') && <img src={DPS} alt="DPS" className="w-6 h-6 ml-2" />}
                  {member.roles.includes('Tank') && <img src={TANK} alt="Tank" className="w-6 h-6 ml-2" />}
                  {member.roles.includes('Healer') && <img src={HEALER} alt="Healer" className="w-6 h-6 ml-2" />}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
    ) : (
    <div className='flex justify-center px-4 pt-[35vh] bg-zinc-900'>
      <button onClick={() => setCreated(!created)} className='text-white uppercase font-WorkSans'>Create Parties</button>
    </div>
    )}
    {unselectedMembers.length > 0 && (
      <div className='flex flex-col bg-zinc-900 p-4 justify-center items-center'>
        <h2 className='text-primary text-xl font-WorkSans uppercase'>Unselected Role</h2>
        <div className='grid grid-flow-row grid-cols-8'>
          {unselectedMembers.map(member => (
            <div key={member.name} className='bg-zinc-800 rounded-lg m-4 p-2 row-span-4 text-center'>
              <span className='text-white'>{member.name}</span>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
  )
}

export default PartyMaker;