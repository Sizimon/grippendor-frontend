import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Login } from './pages';
import AppContent from './AppContent';
import axios from 'axios';


function App() {
  const [auth, setAuth] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  axios.defaults.withCredentials = true;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/grippendor-backend/check-auth');
        if (response.data.authenticated) {
          setAuth({ guildId: response.data.guildId });
        }
      } catch (error) {
        // User is not authenticated or token is invalid
        console.log('User not authenticated');
        setAuth(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen bg-zinc-900 text-white">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
      <Route 
          path="/grippendor/login"
          element={
          <Login setAuth={setAuth} />
          } 
        />
        <Route 
          path="/grippendor" 
          element={
            auth 
              ? <Navigate to={`/grippendor/${auth.guildId}`} /> 
              : <Navigate to="/grippendor/login" />
            } 
        />
        <Route 
          path="/grippendor/:guildId/*" 
          element={
            auth 
            ? <AppContent auth={auth} setAuth={setAuth} /> 
            : <Navigate to="/grippendor/login" />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;