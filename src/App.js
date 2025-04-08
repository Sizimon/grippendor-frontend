import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Login } from './pages';
import AppContent from './AppContent';


function App() {
  const [auth, setAuth] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  function isTokenExpired(token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Error decoding token:', error);
      return true; // Assume expired if there's an error
    }
  }

  useEffect(() => {
    const storedAuth = localStorage.getItem('auth')
    if (storedAuth) {
      try {
        const parsedAuth = JSON.parse(storedAuth);
        if (parsedAuth && parsedAuth.guildId && parsedAuth.token) {
          if (isTokenExpired(parsedAuth.token)) {
            console.warn('Token has expired. Redirecting to login...');
            localStorage.removeItem('auth');
          } else {
            setAuth(parsedAuth);
          }
        } else {
          localStorage.removeItem('auth');
        }
      } catch (error) {
        console.error('Error parsing auth data:', error);
        localStorage.removeItem('auth');
      }
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen bg-zinc-900 text-white">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
      <Route 
          path="/bot-dashboard/login"
          element={
          <Login setAuth={setAuth} />
          } 
        />
        <Route 
          path="/bot-dashboard" 
          element={
            auth 
              ? <Navigate to={`/bot-dashboard/${auth.guildId}`} /> 
              : <Navigate to="/bot-dashboard/login" />
            } 
        />
        <Route 
          path="/bot-dashboard/:guildId/*" 
          element={
            auth 
            ? <AppContent auth={auth} setAuth={setAuth} /> 
            : <Navigate to="/bot-dashboard/login" />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;