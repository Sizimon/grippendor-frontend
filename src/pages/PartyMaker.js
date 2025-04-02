import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { CustomDropdown } from '../components';
const moment = require('moment');

// Sub-Component: No Events Message
const NoEvents = () => {
  <div className='flex flex-col justify-center items-center px-4 bg-zinc-900 py-44'>
    <h1 className='text-white text-2xl'>No events currently exist.</h1>
  </div>
}
// ---

// Sub-Component: Event Selection Dropdown
const EventSelection = ({ currentEvents, selectedEvent, handleEventChange, formatDateTime }) => (
  <div className="flex flex-col justify-center text-white uppercase font-WorkSans text-center">
    <CustomDropdown
      options={currentEvents}
      selectedOption={selectedEvent}
      onOptionSelect={handleEventChange}
      formatDateTime={formatDateTime}
    />
  </div>
);
// ---

// Sub-Component: Party List
const PartyList = ({ parties }) => (
  <div className="grid grid-flow-row grid-cols-1 md:grid-cols-2 bp:grid-cols-3 w-full px-10">
    {parties.length !== 0 ? (
      parties.map((party, partyIndex) => (
        <div key={partyIndex} className="col-span-1 bg-zinc-900 rounded-lg m-4 p-4">
          <h3 className="text-center text-lg font-WorkSans py-2">Party {party.id}</h3>
          {party.members.map((member, memberIndex) => (
            <div key={memberIndex} className="flex items-center p-2 m-1">
              <span>{member.name} - {member.role}</span>
            </div>
          ))}
        </div>
      ))
    ) : (
      <div className="col-span-1 md:col-span-2 bp:col-span-3 text-center text-lg font-WorkSans py-4">
        <h2 className="uppercase text-primary text-2xl">You do not have enough available members to create a party.</h2>
      </div>
    )}
  </div>
);
// ---


const PartyMaker = ({ events, formatDateTime, guildId, auth }) => {
  const [parties, setParties] = useState([]);
  const [unselectedMembers, setUnselectedMembers] = useState([]);
  const [created, setCreated] = useState(false);
  const [eventUserData, setEventUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isHovered, setIsHovered] = useState(false);
  
  // Filter events with no debrief (Events that have not finished)
  const currentEvents = events.filter(event => !event.debrief || !event.debried === '');
  console.log(currentEvents);

  // State for selected event
  const [selectedEvent, setSelectedEvent] = useState(currentEvents.length > 0 ? currentEvents[0] : null);
  console.log(selectedEvent);

  // Fetches the event user data whenever the user selects a new event from the list.
  useEffect(() => {
    console.log('Selected Event:', selectedEvent);
    if (selectedEvent) {
      fetchEventUserData(selectedEvent.id);
    }
  }, [selectedEvent]);

  // API to communicate with backend and fetch eventUserData
  const fetchEventUserData = async (eventId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://szymonsamus.dev/bot-backend/eventuserdata/${guildId}/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      setEventUserData(response.data.eventUserData);
    } catch (error) {
      console.error('Error fetching event user data:', error);
      setError('Failed to fetch event user data.');
    } finally {
      setLoading(false);
    }
  };

  const handleEventChange = (event) => {
    // const selectedEventId = Number(event.target.value);
    // const eventDetails = currentEvents.find(e => e.id === selectedEventId);
    setSelectedEvent(event);
  }

  // Revamp in future to take premade presets that users declare.
  const createParties = (event) => {
    if (!event || !eventUserData) {
      console.warn('No event selected or user data available.');
      return;
    }

    console.log('eventUserData:', eventUserData);
    const teamLeaders = eventUserData.filter(member => member.roles && member.roles.includes('Team Leader'));
    const medics = eventUserData.filter(member => member.roles && member.roles.includes('Medic'));
    const fillers = eventUserData.filter(member => member.roles && ['Engineer', 'Rifleman', 'Grenadier', 'Autorifleman', 'Marksman'].some(role => member.roles.includes(role)));
    const unselected = eventUserData.filter(member => !member.roles || (!member.roles.includes('Team Leader') && !member.roles.includes('Medic') && !['Engineer', 'Grenadier', 'Rifleman', 'Autorifleman', 'Marksman'].some(role => member.roles.includes(role))));

    const newParties = [];
    const usedMembers = new Set();

    const removeFromAllArrays = (member) => {
      const removeFromArray = (array, member) => {
        const index = array.findIndex(m => m.user_id === member.user_id);
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

      let teamLeader = teamLeaders.find(member => !usedMembers.has(member.user_id) && !member.roles.includes('Medic'));
      if (!teamLeader) {
        if (medics.length > 1) {
          teamLeader = teamLeaders.find(member => !usedMembers.has(member.user_id) && member.roles.includes('Medic'));
        }
      }

      const medic = medics.find(member => !usedMembers.has(member.user_id));

      if (teamLeader && medic) {
        usedMembers.add(teamLeader.user_id);
        removeFromAllArrays(teamLeader);
        partyMembers.push({ ...teamLeader, role: 'Team Leader' });

        usedMembers.add(medic.user_id);
        removeFromAllArrays(medic);
        partyMembers.push({ ...medic, role: 'Medic' });

        const filler1 = fillers.find(member => !usedMembers.has(member.user_id));
        if (filler1) {
          usedMembers.add(filler1.user_id);
          removeFromAllArrays(filler1);
          const filler1Role = filler1.roles.find(role => ['Engineer', 'Rifleman', 'Grenadier', 'Autorifleman', 'Marksman'].includes(role));
          partyMembers.push({ ...filler1, role: filler1Role });
        }

        const filler2 = fillers.find(member => !usedMembers.has(member.user_id));
        if (filler2) {
          usedMembers.add(filler2.user_id);
          removeFromAllArrays(filler2);
          const filler2Role = filler2.roles.find(role => ['Engineer', 'Rifleman', 'Grenadier', 'Autorifleman', 'Marksman'].includes(role));
          partyMembers.push({ ...filler2, role: filler2Role });
        }

        console.log(usedMembers);

        if (partyMembers.length === 4) {
          const party = {
            id: newParties.length + 1,
            members: partyMembers
          };
          newParties.push(party);
        } else {
          break;
        }
      } else {
        break;
      }
    }

    setParties(newParties);
    setUnselectedMembers(unselected);
    setCreated(!created);
  };

  if (!events) {
    return <NoEvents />;
  }
  // END !!!

  return (
    <div className='flex flex-col'>
      <AnimatePresence>
        {created ? (
          <motion.div
            key="created"
            className='flex flex-col flex-grow'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <div className='flex flex-col justify-start items-center text-white flex-grow bg-zinc-900 py-12'>
              <h2 className='flex flex-col uppercase text-center text-lg font-WorkSans py-12 px-12'>
                <span className='text-primary text-4xl'>{selectedEvent ? selectedEvent.name : 'No Upcoming Events'}</span>
                <span>{selectedEvent ? `${selectedEvent.summary}` : ''}</span>
                <span>{selectedEvent ? formatDateTime(moment(selectedEvent.event_date).unix()) : ''}</span>
              </h2>
              <PartyList parties={parties} />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="not-created"
            className='flex flex-col justify-center items-center px-4 bg-zinc-900 py-44'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <EventSelection
              currentEvents={currentEvents}
              selectedEvent={selectedEvent}
              handleEventChange={handleEventChange}
              formatDateTime={formatDateTime}
            />
            {loading && <p className="text-white">Loading event user data...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {selectedEvent && eventUserData && (
              <motion.div
                className='flex flex-col justify-center items-center bg-zinc-950 text-white p-12 mb-4 rounded-lg'
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                animate={isHovered ? {
                  boxShadow: [
                    '0 0 4px var(--color-primary)',
                    '0 0 20px var(--color-primary)',
                    '0 0 10px var(--color-primary)',
                  ],
                } : {
                  boxShadow: '0 0 4px var(--color-primary)',
                }}
                transition={{
                  duration: 3,
                  ease: 'easeInOut',
                  repeat: isHovered ? Infinity : 0,
                  repeatType: 'reverse',
                }}
              >
                <h2 className="text-xl font-bold">{selectedEvent.name}</h2>
                <p>{formatDateTime(moment(selectedEvent.event_date).unix())}</p>
                <p>{selectedEvent.summary}</p>
              </motion.div>
            )}
            <button
              onClick={() => createParties(selectedEvent)}
              className='text-white uppercase font-WorkSans transition delay-50 duration-200 ease-in-out hover:text-primary text-2xl mt-4'
            >
              Create Parties For Selected Event
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div >
  )
}

export default PartyMaker;