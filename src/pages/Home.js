import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Home = ({ config }) => {
  return (
    <div className="flex flex-col items-center text-center justify-center h-full bg-zinc-900 text-white">
      <div className='grid grid-flow-row grid-cols-1'>
        <DashboardCard
          config={config}
        />
      </div>
    </div>
  );
};

const DashboardCard = ({ config }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className='flex flex-col items-center bg-zinc-950 h-full py-4 px-8 bp:py-8 bp:px-16'
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
            <img src={config?.icon} alt="Guild Icon" className='h-[6vh] bp:h-[10vh] max-w-full' />
            <h2 className='text-3xl bp:text-4xl md:text-5xl 4k:text-8xl text-primary'>{config?.title || 'Dashboard'}</h2>
          </div>
        ) : (
          <h2 className=' text-3xl bp:text-4xl md:text-5xl 4k:text-8xl'>{config?.title || 'Dashboard'}</h2>
        )}
      </div>
      <div className='py-3'>
        <p className='tracking-widest text-base bp:text-lg md:text-xl'>
          Gripendor Bots' mission is to simplify event creation & party making features across different game titles,
          empowering users and their communities with sophisticated performance metrics all handled via an easy to use and time efficient system.
        </p>
      </div>
      <div className='flex flex-col py-3'>
        <h2 className='text-xl bp:text-2xl md:text-3xl 4k:text-6xl text-primary'>Planned Features</h2>
        <ol className='list-decimal list-inside tracking-wider text-base bp:text-lg md:text-xl'>
          <li>Dynamic Party Making | Allow users to create their own partymaking presets.</li>
          <li>Stat Tracking | Ability for the bot to track player statistics given a specific setup.</li>
          <li>Warthunder Integration | Plans to add Warthunder tracking functionality.</li>
        </ol>
      </div>
    </motion.div>
  );
};

export default Home;