import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Login } from './pages';
import AppContent from './AppContent';


function App() {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const storedAuth = localStorage.getItem('auth')
    if (storedAuth) {
      setAuth(JSON.parse(storedAuth));
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/bot-dashboard/login" element={<Login setAuth={setAuth} />} />
        <Route path="/bot-dashboard" element={auth ? <Navigate to={`/bot-dasboard/${auth.guildId}`} /> : <Navigate to="/bot-dashboard/login" />} />
        <Route path="/bot-dashboard/:guildId/*" element={auth ? <AppContent auth={auth} setAuth={setAuth} /> : <Navigate to="/bot-dashboard/login" />} />
      </Routes>
    </Router>
  );
}

export default App;