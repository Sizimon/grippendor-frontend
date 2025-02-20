import React, { useState, useEffect } from 'react';
// import DPS from './assets/images/DPS.png';
// import TANK from './assets/images/TANK.png';
// import HEALER from './assets/images/HEALER.png';

const PartyMaker = ({ config, userData, currentDay }) => {
  const [parties, setParties] = useState([]);
  const [unselectedMembers, setUnselectedMembers] = useState([]);
  const [created, setCreated] = useState(false);

  const createParties = () => {
    const teamLeaders = userData.filter(member => member.roles && member.roles.includes('Team Leader'));
    const medics = userData.filter(member => member.roles && member.roles.includes('Medic'));
    const fillers = userData.filter(member => member.roles && ['Engineer', 'Rifleman', 'Grenadier', 'Autorifleman'].some(role => member.roles.includes(role)));
    const unselected = userData.filter(member => !member.roles || (!member.roles.includes('Team Leader') && !member.roles.includes('Medic') && !['Engineer', 'Grenadier', 'Rifleman', 'Autorifleman'].some(role => member.roles.includes(role))));

    const newParties = [];
    const usedMembers = new Set();

    const removeFromAllArrays = (member) => {
      const removeFromArray = (array, member) => {
        const index = array.findIndex(m => m.name === member.name);
        if (index !== -1) {
          array.splice(index, 1);
        }
      };
      removeFromArray(teamLeaders, member);
      removeFromArray(medics, member);
      removeFromArray(fillers, member);
    };

    while (teamLeaders.length >= 1 && medics.length >= 1 && fillers.length >= 2) {
      const partyMembers = [];

      const teamLeader = teamLeaders.find(member => !usedMembers.has(member.name));
      if (teamLeader) {
        usedMembers.add(teamLeader.name);
        removeFromAllArrays(teamLeader);
        partyMembers.push({ ...teamLeader, role: 'Team Leader' });
      }

      const medic = medics.find(member => !usedMembers.has(member.name));
      if (medic) {
        usedMembers.add(medic.name);
        removeFromAllArrays(medic);
        partyMembers.push({ ...medic, role: 'Medic' });
      }

      const filler1 = fillers.find(member => !usedMembers.has(member.name));
      if (filler1) {
        usedMembers.add(filler1.name);
        removeFromAllArrays(filler1);
        const filler1Role = filler1.roles.find(role => ['Engineer', 'Rifleman', 'Grenadier', 'Autorifleman'].includes(role));
        partyMembers.push({ ...filler1, role: filler1Role });
      }

      const filler2 = fillers.find(member => !usedMembers.has(member.name));
      if (filler2) {
        usedMembers.add(filler2.name);
        removeFromAllArrays(filler2);
        const filler2Role = filler2.roles.find(role => ['Engineer', 'Rifleman', 'Grenadier', 'Autorifleman'].includes(role));
        partyMembers.push({ ...filler2, role: filler2Role });
      }

      if (partyMembers.length === 4) {
        const party = {
          id: newParties.length + 1,
          members: partyMembers
        };
        newParties.push(party);
      } else {
        break;
      }
    }

    setParties(newParties);
    setUnselectedMembers(unselected);
  };

    useEffect(() => {
      if (created === true && userData.length > 0 && config) {
        createParties();
      }
    }, [created, userData, config]);

    return (
      <div className='flex flex-col'>
        {created ? (
          <div className='flex flex-col'>
            <div
              className='flex flex-col justify-start items-center text-white flex-grow border-t-[1px] border-b-[1px] border-primary bg-zinc-900 py-12 h-screen'
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
                        <span>{member.name} - {member.role} </span>
                        {/* {member.roles.includes('DPS') && <img src={DPS} alt="DPS" className="w-6 h-6 ml-2" />}
                  {member.roles.includes('Tank') && <img src={TANK} alt="Tank" className="w-6 h-6 ml-2" />}
                  {member.roles.includes('Healer') && <img src={HEALER} alt="Healer" className="w-6 h-6 ml-2" />} */}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className='flex justify-center px-4 pt-[35vh] bg-zinc-900'>
            <button
              onClick={() => setCreated(!created)}
              className='text-white uppercase font-WorkSans'
            >
              Create Parties
            </button>
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