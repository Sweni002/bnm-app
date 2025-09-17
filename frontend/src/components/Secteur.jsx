import React, { useState, useEffect } from 'react';
import styles from './secteur.module.css';

function Secteur() {
  const [secteurs, setSecteurs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simuler récupération des secteurs depuis une API
  useEffect(() => {
    setTimeout(() => {
      setSecteurs([
        { id: 1, nom: 'Secteur A', description: 'Description du secteur A' },
        { id: 2, nom: 'Secteur B', description: 'Description du secteur B' },
        { id: 3, nom: 'Secteur C', description: 'Description du secteur C' },
      ]);
      setLoading(false);
    }, 1500); // 1.5s pour simuler chargement
  }, []);

  if (loading) {
    return <div className={styles.loader}>Chargement des secteurs...</div>;
  }

  return (
    <div className={styles.container}>
      <h2>Liste des Secteurs</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {secteurs.map((secteur) => (
            <tr key={secteur.id}>
              <td>{secteur.id}</td>
              <td>{secteur.nom}</td>
              <td>{secteur.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Secteur;
