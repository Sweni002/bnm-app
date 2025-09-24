import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './Header';
import Norme from './Norme';
import Secteur  from './Secteur';
import Bibio from './Bibio';
import AjoutNorme from './ajout/AjoutNorme';

function Site({ user }) {
  return (
    <div>
      <Header user={user} />

      {/* Contenu dynamique */}
      <Routes>
          <Route path="/list_norme" element={<Bibio />} />
        <Route path="/norme" element={<Norme />} />
         <Route path="/ajout_norme" element={<AjoutNorme/>} /> {/* nouvelle route */}
   
        <Route path="/secteur" element={<Secteur />} />
           <Route path="*" element={<Navigate to="/list_norme" />} />
      </Routes>
    </div>
  );
}

export default Site;
