import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './Header';
import Norme from './Norme';
import Secteur  from './Secteur';
import Bibio from './Bibio';
import AjoutNorme from './ajout/AjoutNorme';
import Modifier from './modifier/Modifier';
import AjoutSecteur from './ajout/AjoutSecteur';

function Site({ user  ,onLogout}) {
  return (
    <div>
   <Header user={user} onLogout={onLogout} />

      {/* Contenu dynamique */}
      <Routes>
          <Route path="/list_norme" element={<Bibio />} />
        <Route path="/norme" element={<Norme />} />
         <Route path="/ajout_norme" element={<AjoutNorme/>} /> {/* nouvelle route */}
   <Route path="/modifier_norme" element={<Modifier />} /> {/* nouvelle route */}
   
   <Route path="/ajout_secteur" element={<AjoutSecteur />} /> {/* nouvelle route */}
   
        <Route path="/secteur" element={<Secteur />} />
           <Route path="*" element={<Navigate to="/list_norme" />} />
      </Routes>
    </div>
  );
}

export default Site;
