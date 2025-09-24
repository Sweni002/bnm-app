import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Commet } from 'react-loading-indicators'; // importer le loader
import Login from './components/Login';
import Site from './components/Site';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simuler un chargement initial (ex: config, API)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (username) => {
    setUser(username);
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
        <Route path="/login" element={<Login />} />
        <Route 
          path="/*" 
          element={
            <PrivateRoute>
              <Site />
            </PrivateRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/login" />} />
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
