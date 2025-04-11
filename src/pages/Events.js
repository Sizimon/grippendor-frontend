import React from 'react';
import Slider from 'react-slick';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Typewriter } from '../components';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Events.css';

const moment = require('moment');

// Sub-Component: Event Card
const EventCard = ({ event, formatDateTime, handleEventClick }) => (
  <div
    className='relative flex flex-col justify-between items-center text-white bg-zinc-950 m-4 p-6 rounded-lg shadow-lg h-[400px]'
    style={{
      backgroundImage: `url(${event.thumbnail_url})`,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
    }}
  >
    <div className='absolute inset-0 bg-black opacity-50 rounded-lg'></div> {/* Overlay */}
    <div className='relative flex flex-col justify-center items-center flex-grow'>
      <div className='flex flex-col justify-center items-center py-4'>
        <p>{formatDateTime(moment(event.event_date).unix())}</p>
        <h1 className='text-xl md:text-4xl font-bold text-primary text-center uppercase'>{event.name}</h1>
        <h2 className='text-lg'>{event.game_name}</h2> {/* Game Name | Need to change as game_name property is actually an ID not name. */}
      </div>
      <div className='flex justify-center items-center'>
        <p className='text-white'>
          <Typewriter header={event.summary} />
        </p>
      </div>
      <div className='flex mt-auto'>
        <button
          className='text-white transition delay-50 duration-200 ease-in-out hover:text-primary hover:scale-105 text-xl 4k:text-6xl uppercase font-WorkSans px-4'
          onClick={() => handleEventClick(event)}
        >
          READ EVENT DETAILS
        </button>
      </div>
    </div>
  </div>
);

// Sub-Component: Event Details Modal
const EventDetailsModal = ({ selectedEvent, formatDateTime, handleCloseModal, handleImageClick }) => {

  const settings = {
    arrows: false,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  }

  return (
    <motion.div
      className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className='bg-zinc-900 text-white p-4 rounded-lg shadow-lg w-9/10 md:w-full md:h-4/6 ap:h-5/6 max-h-screen overflow-y-auto flex flex-col justify-center'
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
      >
        <div className='flex flex-col items-center mb-4 mt-12 md:mt-0 w-full'>
          <p>{formatDateTime(moment(selectedEvent.event_date).unix())}</p>
          <h2 className='text-2xl font-bold text-primary'>{selectedEvent.name}</h2>
        </div>
        <div className='grid grid-flow-row grid-cols-1 ap:grid-cols-2 gap-4 px:4 md:px-12 w-full'>
          <div className='flex flex-col items-center md:p-4'>
            <p className='mb-4 text-center'>{selectedEvent.description}</p>
          </div>
          <div className='justify-center items-center w-full md:p-4 mb-8 self-center'>
            {typeof selectedEvent.image_urls === 'string' && JSON.parse(selectedEvent.image_urls).length > 0 ? (
              <Slider {...settings}>
                {JSON.parse(selectedEvent.image_urls).map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Event image ${index + 1}`}
                    className="cursor-pointer col-span-1 h-auto max-h-[300px] w-auto max-w-full object-contain p-4 self-center"
                    onClick={() => handleImageClick(url)}
                  />
                ))}
              </Slider>
            ) : (
              <p className="text-white col-span-3 text-4xl">No Images Available</p>
            )}
          </div>
        </div>
        {selectedEvent.debrief && <p className='mb-4'>{selectedEvent.debrief}</p>}
        <button
          className='bg-primary text-white px-4 py-2 rounded mt-4 mb-12 md:mb-0 w-1/5 self-center'
          onClick={handleCloseModal}
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  )
};

// Sub-Component: Image Modal
const ImageModal = ({ selectedImage, handleCloseImageModal }) => (
  <motion.div
    className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50'
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={handleCloseImageModal}
  >
    <motion.img
      src={selectedImage}
      alt='Full size'
      className='rounded-lg shadow-lg w-9/10 h-auto md:w-4/5 md:h-4/5 object-contain'
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0.8 }}
    />
  </motion.div>
);


const Events = ({ events, formatDateTime }) => {
  const [showUpcoming, setShowUpcoming] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const sortedEvents = events ? [...events].sort((a, b) => new Date(b.event_date) - new Date(a.event_date)) : [];
  const filteredEvents = showUpcoming
    ? sortedEvents.filter(event => !event.debrief)
    : sortedEvents.filter(event => event.debrief);


  // Handlers
  const handleEventClick = (event) => setSelectedEvent(event);
  const handleCloseModal = () => setSelectedEvent(null);
  const handleImageClick = (url) => setSelectedImage(url);
  const handleCloseImageModal = () => setSelectedImage(null);

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

      {/* Event List Component */}
      <div className='grid grid-flow-row grid-cols-1 md:grid-cols-2 gap-4 p-4'>
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event, index) => (
            <EventCard
              key={index}
              event={event}
              formatDateTime={formatDateTime}
              handleEventClick={handleEventClick}
            />
          ))
        ) : (
          <div className='flex flex-col justify-center items-center text-white border-primary bg-zinc-900 py-12 col-span-2'>
            <h1 className='text-4xl font-bold'>No Events</h1>
            <h2 className='text-xl'>No events have been recorded.</h2>
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {selectedEvent && (
          <EventDetailsModal
            selectedEvent={selectedEvent}
            formatDateTime={formatDateTime}
            handleCloseModal={handleCloseModal}
            handleImageClick={handleImageClick}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {selectedImage && (
          <ImageModal
            selectedImage={selectedImage}
            handleCloseImageModal={handleCloseImageModal}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Events;