import React from 'react';
import { Link } from 'react-router-dom'; // Replace with the path to your guild icon

const Home = ({ config }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-800 text-white">
      <div className="bg-zinc-900 p-8 rounded-lg shadow-lg text-center w-9/12">
        <h1 className="justify-start text-start text-4xl font-bold mb-4">{config ? config.title : 'Guild Name'}</h1>
        <div className='grid grid-flow-row grid-cols-3'>
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
        <div className='grid grid-flow-row grid-cols-4'>
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
        <div className="flex flex-row justify-center gap-4">
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