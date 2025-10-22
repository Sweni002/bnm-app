import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Commet } from 'react-loading-indicators';
import Login from './components/Login';
import Site from './components/Site';
import PrivateRoute from './PrivateRoute';
import Admin from './components/Admin';
import SignUp from './components/signup';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
useEffect(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) setUser(JSON.parse(storedUser));
  const timer = setTimeout(() => setLoading(false), 1000);
  return () => clearTimeout(timer);
}, []);

 const handleLogin = (userData) => {
  setUser(userData);
  localStorage.setItem("user", JSON.stringify(userData));
};

   const handleLogout = () => {
    setUser(null); // réinitialise le state
  };


  if (loading) {
    return (
      <div style={styles.loaderContainer}>
        <Commet color={["#1466a1", "#9514a1", "#a14f14", "#20a114"]} />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
         <Route path="/_admins" element={<Admin onLogin={handleLogin} />} />
      <Route path="/signup" element={<SignUp onLogin={handleLogin} />} />
    
        <Route 
          path="/*" 
          element={
            <PrivateRoute>
                <Site user={user} onLogout={handleLogout} />
      </PrivateRoute>
          } 
        />
          </Routes>
    </Router>
  );
}

const styles = {
  loaderContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#fff',
  },
};

export default App;
