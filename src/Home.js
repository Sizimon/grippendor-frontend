import React, {useState} from 'react';
import { Link } from 'react-router-dom'; 
import { motion } from 'framer-motion';

const Home = ({ config }) => {
  const CardDetails = [
    {
      title: 'Most Activity',
      description: 'Most active members.',
    },
    {
      title: 'Most Kills',
      description: 'Best Killers.',
    },
    {
      title: 'Priority Bounty Targets',
      description: 'Your Bounty Targets.',
    },
    {
      title: 'Supplies Delivered',
      description: 'Most Supplies Delivered',
    },
  ]

  return (
    <div className="flex flex-col items-center justify-center h-full bg-zinc-800 text-white py-[5vh]">
      <div
        className="bg-zinc-900 px-[1vw] md:px-[2vw] md:py-[2vh] text-center w-[100vw] md:w-[80vw]">
        <div className='grid grid-flow-row grid-cols-1 md:grid-cols-2'>
          {CardDetails.map((card, index) => (
            <DashboardCard
              key={index}
              title={card.title}
              description={card.description}
            />
          ))}
        </div>
        <div className="flex-row justify-center gap-4 hidden bp:flex">
          <Link to="/party-maker" className="block uppercase bg-zinc-800 border-[1px] border-zinc-900 hover:border-[1px] hover:border-primary text-white font-bold py-2 px-4 rounded-xl">
            Party Maker
          </Link>
          <Link to="/weekly" className="block uppercase bg-zinc-800 border-[1px] border-zinc-900 hover:border-[1px] hover:border-primary text-white font-bold py-2 px-4 rounded-xl">
            Weekly Display
          </Link>
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({ title, description }) => {
  const [isHovered, setIsHovered] = useState(false);


  return (
    <motion.div 
            className='flex flex-col items-center bg-zinc-950 h-[50vh] md:h-[25vh] ap:h-[50vh] 4k:h-[40vh]  p-4 m-4 4k:px-[2.5vw] 4k:py-[2.5vh]'
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
                <h2 className='text-2xl 4k:text-7xl font-bold'>{title}</h2>
                <p className="text-base md:text-xl 4k:text-5xl">{description}</p>
            </motion.div>
  );
};

export default Home;