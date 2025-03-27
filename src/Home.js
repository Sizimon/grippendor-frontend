import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Home = ({ config }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-zinc-900 text-white py-[5vh]">
      <div
        className="bg-zinc-900 px-[1vw] md:px-[2vw] md:py-[2vh] text-center w-[100vw] md:w-[80vw]">
        <div className='grid grid-flow-row grid-cols-1 md:grid-cols-2'>
          <DashboardCard
            config={config}
          />
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({ config }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className='flex flex-col items-center bg-zinc-950 h-full'
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
      <div className='flex flex-row'>
        {config?.icon ? (
          <div className='flex items-center gap-4'>
            <img src={config?.icon} alt="Guild Icon" className='h-[10vh] max-w-full' />
            <h2 className='text-base md:text-2xl bp:text-4xl 4k:text-8xl'>{config?.title || 'Dashboard'}</h2>
          </div>
        ) : (
          <h2 className='text-base md:text-2xl bp:text-4xl 4k:text-8xl'>{config?.title || 'Dashboard'}</h2>
        )}
      </div>
      <div>
        <p>
          Gripendor Bots' mission is to simplify event creation & party making features across different game titles,
          empowering users and their communities with sophisticated performance metrics all handled via an easy to use and time efficient system.
        </p>
      </div>
      <div className='flex flex-col mt-4'>
        <h2 className='text-lg md:text-xl bp:text-2xl 4k:text-4xl font-bold'>Planned Features</h2>
        <ol className='list-decimal list-inside'>
          <li>Stat Tracking | Ability for the bot to track player statistics given a specific setup.</li>
          <li>Warthunder Integration | Plans to add Warthunder tracking functionality.</li>
        </ol>
      </div>
    </motion.div>
  );
};

export default Home;