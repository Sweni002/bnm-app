import React from 'react';
import { Link } from 'react-router-dom';
import styles from './header.module.css'; // module CSS pour le style

function Header({ user }) {
  return (
    <header className={styles.header}>
      <h1 className={styles.logo}>Mon Site</h1>
      <nav className={styles.nav}>
        <Link to="/" className={styles.link}>Accueil</Link>
        <Link to="/about" className={styles.link}>À propos</Link>
        <Link to="/profile" className={styles.link}>Profil</Link>
      </nav>
      <span className={styles.user}>Bonjour, {user}</span>
    </header>
  );
}

export default Header;
