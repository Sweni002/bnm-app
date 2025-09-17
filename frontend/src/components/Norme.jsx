import React, { useState, useEffect } from 'react';
import styles from './norme.module.css';

function Norme() {
  const [normes, setNormes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simuler récupération des normes depuis une API
  useEffect(() => {
    setTimeout(() => {
      setNormes([
        { id: 1, nom: 'Norme A', dateEdition: '2025-01-15' },
        { id: 2, nom: 'Norme B', dateEdition: '2025-03-22' },
        { id: 3, nom: 'Norme C', dateEdition: '2025-07-10' },
      ]);
      setLoading(false);
    }, 1500); // 1.5s pour simuler chargement
  }, []);

  if (loading) {
    return <div className={styles.loader}>Chargement des normes...</div>;
  }

  return (
    <div className={styles.container}>
      <h2>Liste des Normes</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Date d'Édition</th>
          </tr>
        </thead>
        <tbody>
          {normes.map((norme) => (
            <tr key={norme.id}>
              <td>{norme.id}</td>
              <td>{norme.nom}</td>
              <td>{norme.dateEdition}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Norme;
