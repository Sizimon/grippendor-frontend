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
  <div className="flex flex-col justify-center text-white uppercase font-WorkSans text-center mb-4">
    <h2 className="text-white text-3xl border-b-primary border-b-[1px] mb-1">SELECT EVENT</h2>
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


const PartyMaker = ({ events, formatDateTime, guildId, auth, presets }) => {
  const [parties, setParties] = useState([]);
  const [unselectedMembers, setUnselectedMembers] = useState([]);
  const [created, setCreated] = useState(false);
  const [eventUserData, setEventUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isHovered, setIsHovered] = useState(false);

  // Preset states
  const [filteredPresets, setFilteredPresets] = useState([]);
  const [selectedPreset, setSelectedPreset] = useState(null);

  // Filter events with no debrief (Events that have not finished)
  const currentEvents = events.filter(event => !event.debrief || !event.debried === '');
  console.log(currentEvents);

  // State for selected event
  const [selectedEvent, setSelectedEvent] = useState(currentEvents.length > 0 ? currentEvents[0] : null);

  // Fetches the event user data whenever the user selects a new event from the list.
  useEffect(() => {
    console.log('Selected Event:', selectedEvent);
    if (selectedEvent) {
      const matchingPresets = presets.filter(preset => preset.game_role_id === selectedEvent.game_name);
      setFilteredPresets(matchingPresets);
      fetchEventUserData(selectedEvent.id);
    }
  }, [selectedEvent, presets]);

  const handlePresetSelect = (preset) => {
    setSelectedPreset(preset);
  };

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
      console.log(eventUserData);
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

  // Party making logic
  // This function creates parties based on the selected event and preset.
  const createParties = (event) => {
    if (!event || !eventUserData || !selectedPreset) {
      console.warn('No event, user data or preset selected.');
      return;
    }

    const { roles } = selectedPreset.data;
    console.log('Roles:', roles);
    const newParties = [];
    const usedMembers = new Set();

    const getMembersForRole = (roleId, count) => {
      const members = eventUserData.filter(
        (member) => !usedMembers.has(member.user_id) && member.roles && member.roles.includes(roleId)
      );
      console.log(members)
      return members.slice(0, count);
    }

    while (true) {
      const partyMembers = [];
      let canFormParty = true;

      roles.forEach(({ roleId, roleName, count }) => {
        const members = getMembersForRole(roleId, count);
        if (members.length < count) {
          canFormParty = false;
        } else {
          members.forEach((member) => {
            usedMembers.add(member.user_id);
            console.log('Member added to usedMembers:', member);
            partyMembers.push({ ...member, role: roleName });
            console.log('Party member:', member);
            console.log('Party members:', partyMembers);
          });
        }
      });

      if (!canFormParty) break;

      newParties.push({
        id: newParties.length + 1,
        members: partyMembers,
      });
    }

    setParties(newParties);
    console.log('Created Party:', newParties);
    setUnselectedMembers(eventUserData.filter((member) => !usedMembers.has(member.user_id)));
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
                {filteredPresets.length > 0 ? (
                  <div className="flex flex-col items-center text-white mt-4">
                    <h3 className="text-lg font-bold">Available Presets</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      {filteredPresets.map((preset) => {
                        let roles = [];
                        try {
                          const data = typeof preset.data === 'string' ? JSON.parse(preset.data) : preset.data;
                          roles = data?.roles || [];
                        } catch (error) {
                          console.error('Failed to parse roles:', error);
                        }

                        return (
                          <div
                            key={preset.id}
                            className={`p-4 rounded-lg cursor-pointer ${selectedPreset?.id === preset.id ? 'bg-primary' : 'bg-zinc-800'}`}
                            onClick={() => handlePresetSelect(preset)}
                          >
                            <h4 className="text-center font-semibold">{preset.preset_name}</h4>
                            <p className="text-sm text-center">Party Size: {preset.party_size}</p>
                            <p className="text-sm text-center">Roles: </p>
                            <ul className='text-sm text-center'>
                              {roles.map((role, index) => (
                                <li key={index}
                                  className="text-sm text-center">
                                  {role.roleName} : {role.count}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-white mt-4">
                    <h3 className="text-lg font-bold">No Presets Available</h3>
                    <p className="text-sm text-center mt-2">
                      You can create a preset using the Discord bot. Use the command <code>/create-preset</code> to get started.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
            <button
              onClick={() => createParties(selectedEvent)}
              className='text-white uppercase font-WorkSans transition delay-50 duration-200 ease-in-out hover:text-primary text-2xl mt-4'
              disabled={!selectedPreset}
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