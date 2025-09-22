import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './Header';
import Norme from './Norme';
import Secteur  from './Secteur';
import Bibio from './Bibio';

function Site({ user }) {
  return (
    <div>
      <Header user={user} />

      {/* Contenu dynamique */}
      <Routes>
          <Route path="/list_norme" element={<Bibio />} />
        <Route path="/norme" element={<Norme />} />
        <Route path="/secteur" element={<Secteur />} />
           <Route path="*" element={<Navigate to="/norme" />} />
      </Routes>
    </div>
  );
}

export default Site;
