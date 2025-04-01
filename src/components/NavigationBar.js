import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MenuButton from './MenuButton';

const NavigationBar = ({ config, guildId, isScrolled, handleSignOut }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
        setActive(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav
      className={`${isScrolled ? 'sticky top-0 bg-opacity-60' : 'top-0'} flex z-30 items-center justify-between px-4 md:py-[2.5vh] 4k:py-[2.5vh] 4k:px-[2.5vw] bg-zinc-900 w-full transition-all duration-300`}
    >
      <div className="text-white uppercase font-WorkSans px-4 text-base md:text-2xl bp:text-4xl 4k:text-8xl">
        {config?.icon ? (
          <img src={config.icon} alt="Guild Icon" className="h-[6vh] bp:h-[10vh] max-w-full" />
        ) : (
          <span>
            <span className="text-primary">G</span>ripendor
            <span className="text-primary">B</span>ot
          </span>
        )}
      </div>
      <div ref={dropdownRef} className="relative">
        <div className="bp:hidden flex justify-center items-center">
          <MenuButton menuOpen={menuOpen} setMenuOpen={setMenuOpen} active={active} setActive={setActive} />
        </div>
        <div
          id="dropdown"
          className={`absolute top-10 md:top-16 right-4 z-10 ${!menuOpen ? 'hidden' : 'block'} bg-zinc-900 divide-y divide-gray-100 shadow-sm w-44`}
        >
          <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
            <div className="font-WorkSans uppercase">Logged in as:</div>
            <div className="font-medium font-WorkSans truncate text-primary">{config ? `${config.title}` : 'GuildTracker'}</div>
            <div className="text-xs truncate text-primary">{guildId}</div>
          </div>
          <ul className="py-2 text-sm text-zinc-200" aria-labelledby="dropdownInformationButton">
            <li>
              <Link to={`/bot-dashboard/${guildId}`} className="text-white transition delay-50 duration-200 ease-in-out hover:text-primary font-WorkSans px-4 py-2 uppercase">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to={`/bot-dashboard/${guildId}/party-maker`} className="text-white transition delay-50 duration-200 ease-in-out hover:text-primary font-WorkSans px-4 py-2 uppercase">
                Party Maker
              </Link>
            </li>
            <li>
              <Link to={`/bot-dashboard/${guildId}/events`} className="text-white transition delay-50 duration-200 ease-in-out hover:text-primary font-WorkSans px-4 py-2 uppercase">
                Events
              </Link>
            </li>
          </ul>
          <div className="py-2">
            <p
              className="px-4 py-2 text-sm font-WorkSans uppercase text-zinc-200 hover:text-primary"
              onClick={handleSignOut}
            >
              Sign out
            </p>
          </div>
        </div>
      </div>
      <div className="hidden bp:flex bp:flex-row gap-4">
        <Link to={`/bot-dashboard/${guildId}`} className="text-white transition delay-50 duration-200 ease-in-out hover:text-primary hover:scale-105 text-xl 4k:text-6xl uppercase font-WorkSans px-4">
          Dashboard
        </Link>
        <Link to={`/bot-dashboard/${guildId}/party-maker`} className="text-white transition delay-50 duration-200 ease-in-out hover:text-primary hover:scale-105 text-xl 4k:text-6xl uppercase font-WorkSans px-4">
          Party Maker
        </Link>
        <Link to={`/bot-dashboard/${guildId}/events`} className="text-white transition delay-50 duration-200 ease-in-out hover:text-primary hover:scale-105 text-xl 4k:text-6xl uppercase font-WorkSans px-4">
          Events
        </Link>
      </div>
    </nav>
  );
};

export default NavigationBar;