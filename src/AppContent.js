import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Banner from './assets/images/banner-spf.png';
import { Typewriter, Footer, NavigationBar } from './components';
import { Home, Events, PartyMaker } from './pages';

const AppContent = ({ auth, setAuth }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { guildId } = useParams();

  // State variables
  const [userData, setUserData] = useState([]);
  const [events, setEvents] = useState([]);
  const [presets, setPresets] = useState([]);
  const [config, setConfig] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Page titles based on the current route
  const pageTitles = {
    '/': 'DASHBOARD',
    '/party-maker': 'PARTY MAKER',
    '/events': 'EVENTS',
  };
  const currentPage = pageTitles[location.pathname.replace(`/bot-dashboard/${guildId}`, '')] || 'DASHBOARD';
  console.log(currentPage)

  // Handle scroll event for sticky navigation
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch configuration
        const configResponse = await axios.get(`https://szymonsamus.dev/bot-backend/config/${guildId}`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        setConfig(configResponse.data);
        if (configResponse.data.color) {
          document.documentElement.style.setProperty('--color-primary', configResponse.data.color);
        }

        // Fetch user data
        const userResponse = await axios.get(`https://szymonsamus.dev/bot-backend/userdata/${guildId}`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        setUserData(userResponse.data);

        // Fetch events
        const eventsResponse = await axios.get(`https://szymonsamus.dev/bot-backend/eventdata/${guildId}`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        setEvents(eventsResponse.data);

        // Fetch presets
        const presetsResponse = await axios.get(`https://szymonsamus.dev/bot-backend/presets/${guildId}`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        setPresets(presetsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [guildId, auth.token]);

  // Format date and time
  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return new Intl.DateTimeFormat('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZoneName: 'short',
    }).format(date);
  };

  // Handle sign out
  const handleSignOut = () => {
    localStorage.removeItem('auth');
    setAuth(null);
    navigate('/bot-dashboard/login');
  };

  return (
    <div className="flex flex-col bg-zinc-900">
      {/* Navigation Bar */}
      <NavigationBar
        config={config}
        guildId={guildId}
        isScrolled={isScrolled}
        handleSignOut={handleSignOut}
      />

      {/* Page Header */}
      <div
        className="h-[20vh] ap:h-[30vh] flex items-center justify-center text-primary text-4xl md:text-6xl bp:text-8xl 4k:text-10xl font-bold"
        style={{
          backgroundImage: `url(${Banner})`,
          backgroundSize: 'cover',
        }}
      >
        <Typewriter key={currentPage} header={currentPage} className="text-primary text-4xl uppercase" />
      </div>

      {/* Routes */}
      <Routes>
        <Route
          path="/"
          element={<Home auth={auth} config={config} userData={userData} formatDateTime={formatDateTime} guildId={guildId} />}
        />
        <Route
          path="party-maker"
          element={<PartyMaker auth={auth} config={config} events={events} presets={presets} formatDateTime={formatDateTime} guildId={guildId} />}
        />
        <Route
          path="events"
          element={<Events auth={auth} events={events} formatDateTime={formatDateTime} config={config} />}
        />
      </Routes>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AppContent;