import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

// Typewriter Component

const LETTER_DELAY = 0.05;
const BOX_FADE_DURATION = 0.1;

const Typewriter = ({ header }) => {
  if (!header) {
    return null;
  }

  const words = header.split(' '); // Split header into words
  let cumulativeDelay = 0; // Initialize cumulative delay

  return (
    <h2 className='text-base md:text-xl text-start'>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className='inline-block mr-1'>
          {word.split('').map((letter, letterIndex) => {
            const delay = cumulativeDelay * LETTER_DELAY;
            cumulativeDelay += 1; // Increment cumulative delay for each letter
            return (
              <motion.span
                key={letterIndex}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{
                  delay: delay,
                  duration: BOX_FADE_DURATION,
                  ease: 'easeInOut',
                }}
                className='relative'
              >
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{
                    delay: delay,
                    times: [0, 1, 1],
                    duration: BOX_FADE_DURATION,
                    ease: 'easeInOut',
                  }}
                  className='absolute bottom-[3px] left-[1px] right-0 top-[3px] bg-white'
                />
                {letter}
              </motion.span>
            );
          })}
        </span>
      ))}
    </h2>
  );
};

/* END */

const PastEvents = ({ events, formatDateTime }) => {
  const [showUpcoming, setShowUpcoming] = useState(true);

  const sortedEvents = events ? [...events].sort((a, b) => new Date(b.event_date) - new Date(a.event_date)) : [];

  const filteredEvents = showUpcoming ? sortedEvents.filter(event => !event.debrief) : sortedEvents.filter(event => event.debrief);

  return (
    <div className='flex flex-col bg-zinc-900 min-h-screen'>
      <div className='flex justify-center space-x-4 p-4'>
        <button
          className={`px-4 py-2 transition delay-50 duration-200 ease-in-out hover:text-primary hover:scale-105 ${showUpcoming ? 'text-white uppercase border-b-[1px] border-primary' : 'text-white uppercase'}`}
          onClick={() => setShowUpcoming(true)}
        >
          Upcoming Events
        </button>
        <button
          className={`px-4 py-2 transition delay-50 duration-200 ease-in-out hover:text-primary hover:scale-105 ${!showUpcoming ? 'text-white uppercase border-b-[1px] border-primary' : 'text-white uppercase'}`}
          onClick={() => setShowUpcoming(false)}
        >
          Past Events
        </button>
      </div>
      <div className='grid grid-flow-row grid-cols-1 md:grid-cols-2 gap-4 p-4'>
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event, index) => (
            <div key={index} className='flex flex-col justify-between items-center text-white bg-zinc-950 m-4 p-6 rounded-lg shadow-lg h-[400px]'>
              <div className='flex flex-col justify-center items-center flex-grow'>
                <div className='flex flex-col justify-center items-center py-4'>
                  <p>{formatDateTime(event.event_date)}</p>
                  <h1 className='text-xl md:text-4xl font-bold text-primary text-center'>{event.name}</h1>
                  <h2 className='text-lg'>{event.type}</h2>
                </div>
                <div className='flex justify-center items-center'>
                  <Typewriter header={event.summary} />
                </div>
                <div className='flex mt-auto'>
                  <button className='text-white transition delay-50 duration-200 ease-in-out hover:text-primary hover:scale-105 text-xl 4k:text-6xl uppercase font-WorkSans px-4'>
                    READ EVENT DETAILS
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className='flex flex-col justify-center items-center text-white border-primary bg-zinc-900 py-12 col-span-2'>
            <h1 className='text-4xl font-bold'>No Events</h1>
            <h2 className='text-xl'>No events have been recorded.</h2>
          </div>
        )}
      </div>
    </div>
  );
};
// return (
//   <div className='flex flex-col bg-zinc-900'>
//     <div className='grid grid-flow-row grid-cols-1 md:grid-cols-2 gap-2'>
//       {sortedEvents.length > 0 ? (
//         sortedEvents.map((event, index) => (
//           <div key={index} className='flex flex-col justify-between items-center text-white flex-grow bg-zinc-950 m-4 md:m-6 p-2 md:p-6 min-h-[400px]'>
//             <div className='flex flex-col justify-center items-center py-4'>
//               <p>{formatDateTime(event.event_date)}</p>
//               <h1 className='text-xl md:text-4xl font-bold text-primary text-center'>{event.name}</h1>
//               <h2 className='text-lg'>{event.type}</h2>
//             </div>
//             <div className='flex justify-center items-center'>
//               <Typewriter header={event.summary} />
//               {/* <h2 className='text-base md:text-xl text-start'>{event.summary}</h2> */}
//             </div>
//             <div className='flex mt-auto'>
//               <button className='text-white transition delay-50 duration-200 ease-in-out hover:text-primary hover:scale-105 text-xl 4k:text-6xl uppercase font-WorkSans px-4'>READ EVENT DETAILS</button>
//             </div>
//           </div>
//         ))
//       ) : (
//         <div className='flex flex-col justify-center items-center text-white flex-grow border-t-[1px] border-b-[1px] border-primary bg-zinc-900 py-12 h-screen'>
//           <h1 className='text-4xl font-bold'>No Previous Events</h1>
//           <h2 className='text-xl'>No previous events have been recorded.</h2>
//         </div>
//       )}
//     </div>
//   </div>
// );

export default PastEvents;