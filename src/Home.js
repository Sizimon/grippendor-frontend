import React from 'react';
import { Link } from 'react-router-dom'; // Replace with the path to your guild icon

const Home = ({ config }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-zinc-800 text-white py-[5vh]">
      <div className="bg-zinc-900 px-[1vw] md:px-[2vw] md:py-[2vh] rounded-lg shadow-lg text-center w-[90vw] md:w-[80vw] bp:w-[60vw]">
        {/* <h1 className="justify-center text-center text-4xl font-bold mb-4">{config ? config.title : 'Guild Name'}</h1> */}
        <div className='grid grid-flow-row grid-cols-1 md:grid-cols-3'>
            <div className='flex flex-col items-center bg-zinc-950 rounded-lg p-4 m-4'>
                <h2 className='text-2xl font-bold'>Most Activity</h2>
                <p>Most active members.</p>
            </div>
            <div className='flex flex-col items-center bg-zinc-950 rounded-lg p-4 m-4'>
                <h2 className='text-2xl font-bold'>Most Kills</h2>
                <p>Best Killers.</p>
            </div>
            <div className='flex flex-col items-center bg-zinc-950 rounded-lg p-4 m-4'>
                <h2 className='text-2xl font-bold'>Priority Bounty Targets</h2>
                <p>Your Bounty Targets.</p>
            </div>
        </div>
        <div className='grid grid-flow-row grid-cols-1'>
            <div className='flex flex-col items-center bg-zinc-950 rounded-lg p-4 m-4'>
                <h2 className='text-2xl font-bold'>Construction Crafters</h2>
                <p>TBD</p>
            </div>
            <div className='flex flex-col items-center bg-zinc-950 rounded-lg p-4 m-4'>
                <h2 className='text-2xl font-bold'>Mystisism Crafters</h2>
                <p>TBD</p>
            </div>
            <div className='flex flex-col items-center bg-zinc-950 rounded-lg p-4 m-4'>
                <h2 className='text-2xl font-bold'>Weaponsmithing Crafters</h2>
                <p>TBD</p>
            </div>
            <div className='flex flex-col items-center bg-zinc-950 rounded-lg p-4 m-4'>
                <h2 className='text-2xl font-bold'>Alchemy Crafters</h2>
                <p>TBD</p>
            </div>
        </div>
        <div className="flex-row justify-center gap-4 hidden bp:flex">
          <Link to="/party-maker" className="block uppercase bg-zinc-800 border-[1px] border-zinc-900 hover:border-[1px] hover:border-primary text-white font-bold py-2 px-4 rounded">
            Party Maker
          </Link>
          <Link to="/weekly" className="block uppercase bg-zinc-800 border-[1px] border-zinc-900 hover:border-[1px] hover:border-primary text-white font-bold py-2 px-4 rounded">
            Weekly Display
          </Link>
          {/* Add more options as needed */}
        </div>
      </div>
    </div>
  );
};

export default Home;