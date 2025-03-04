import React from 'react';
import { useRef, useEffect } from 'react';

const PastEvents = ({ events, formatDateTime }) => {
  const sortedEvents = events ? [...events].sort((a, b) => new Date(b.event_date) - new Date(a.event_date)) : [];

  return (
    <div className='flex flex-col bg-zinc-900'>
      <div className='grid grid-flow-row grid-cols-1 md:grid-cols-2 gap-4'>
        {sortedEvents.length > 0 ? (
          sortedEvents.map((event, index) => (
            <div key={index} className='flex flex-col justify-start items-center text-white flex-grow bg-zinc-950 m-4 md:m-12 p-2 md:p-6 min-h-[600px]'>
              <div className='flex flex-col justify-between items-center py-4'>
                <p>{formatDateTime(event.event_date)}</p>
                <h1 className='text-xl md:text-4xl font-bold text-primary text-center'>{event.name}</h1>
                </div>
              <div className='flex justify-center items-center min-h-[70%]'>
                <h2 className='text-base md:text-xl text-start'>{event.description}</h2>
              </div>
              <div className='mt-auto'>
                <button className='text-white transition delay-50 duration-200 ease-in-out hover:text-primary hover:scale-105 text-xl 4k:text-6xl uppercase font-WorkSans px-4'>READ EVENT DETAILS</button>
              </div>
            </div>
          ))
        ) : (
          <div className='flex flex-col justify-center items-center text-white flex-grow border-t-[1px] border-b-[1px] border-primary bg-zinc-900 py-12 h-screen'>
            <h1 className='text-4xl font-bold'>No Previous Events</h1>
            <h2 className='text-xl'>No previous events have been recorded.</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default PastEvents;