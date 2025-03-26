import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Home = ({ userData, events, config }) => {

  // Most Activity Sorter
  const sortedNames = userData.sort((a, b) => b.counter - a.counter);
  const topAttendance = sortedNames.slice(0, 5);
  // End Most Activity Sorter

  console.log(events)

  const CardDetails = [
    {
      title: 'Most Active',
      description: 'Most active members. (WORK IN PROGRESS)',
      content: topAttendance,
    },
    {
      title: 'Most Kills',
      description: 'Most kills in all events. (WORK IN PROGRESS)',
    },
    {
      title: 'Most Teamkills / Civilian Kills',
      description: 'Most teamkills or civilian kills in all events. (WORK IN PROGRESS)',
    },
    {
      title: 'Mission Points Available',
      description: 'Total Mission Points Available For Missions (WORK IN PROGRESS)',
    },
  ]

  return (
    <div className="flex flex-col items-center justify-center h-full bg-zinc-900 text-white py-[5vh]">
      <div
        className="bg-zinc-900 px-[1vw] md:px-[2vw] md:py-[2vh] text-center w-[100vw] md:w-[80vw]">
        <div className='grid grid-flow-row grid-cols-1 md:grid-cols-2'>
          {CardDetails.map((card, index) => (
            <DashboardCard
              key={index}
              title={card.title}
              description={card.description}
              content={card.content}
              time={card.time}
              partymaker={card.partymaker}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({ title, description, content, time, partymaker }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className='flex flex-col items-center bg-zinc-950 h-[50vh] md:h-[25vh] ap:h-[50vh] 4k:h-[40vh] p-4 m-4 4k:px-[2.5vw] 4k:py-[2.5vh]'
      style={{
        boxShadow: '0 0 4px var(--color-primary)',
      }}
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
      {time && (
        <p className='font-Roboto font-thin text-base md:text-xl 4k:text-5xl pb-6'>{time}</p>
      )}
      <h2 className='font-WorkSans uppercase text-2xl 4k:text-7xl font-bold'>{title}</h2>
      <p className="font-Roboto font-thin text-base md:text-xl 4k:text-5xl">{description}</p>
      {partymaker && (
        <div className='flex items-center justify-center w-full mt-auto'>
          {partymaker}
        </div>
      )}
      {content && (
        <div className='flex flex-col items-center justify-center h-full w-full'>
          <ul className='flex flex-col items-center w-full'>
            {content.map((member, index) => (
              <motion.li
                key={index}
                style={{
                  boxShadow: index === 0 ? '0 0 4px var(--color-primary)' : '0 0 4px white',
                }}
                whileHover={index !== 0 ? {
                  boxShadow: '0 0 10px white',
                } : {}}
                animate={{
                  boxShadow: index === 0 ? [
                    '0 0 4px var(--color-primary)',
                    '0 0 20px var(--color-primary)',
                    '0 0 10px var(--color-primary)',
                  ] : null,
                }}
                transition={{
                  duration: 1,
                  ease: 'easeInOut',
                  repeat: index === 0 ? Infinity : 0,
                  repeatType: 'reverse',
                }}
                className='flex flex-row w-full p-2 m-2 justify-between items-start text-sm md:text-base 4k:text-3xl rounded-xl'>
                <p>{index + 1}. {member.name}</p>
                <p>{member.counter}</p>
              </motion.li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
};

export default Home;