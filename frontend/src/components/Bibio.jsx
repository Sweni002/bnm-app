import React, { useEffect, useRef, useState } from 'react';
import styles from './biblio.module.css';
import livre from '../assets/livre.jpeg'; // ton image
import { Card, Row, Col, Statistic } from "antd";
import { useMediaQuery } from '@mui/material';
import IconButton from '@mui/material/IconButton';

function AnimatedCounter({ end, duration = 2000 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 50); // update toutes les 50ms
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setCount(Math.floor(start));
    }, 50);

    return () => clearInterval(timer);
  }, [end, duration]);


  return <span className={styles.counter}>{count}</span>;
}

function Biblio() {
       const [showContainer, setShowContainer] = useState(false);

         const scrollRef = useRef(null);
       const [showLeft, setShowLeft] = useState(false);
       const [showRight, setShowRight] = useState(false);
      const [selected, setSelected] = useState("Photos");

const isMobile = useMediaQuery('(max-width:768px)');
const isMobileSearch = useMediaQuery('(max-width:725px)');

      const updateScrollButtons = () => {
        if (scrollRef.current) {
          const { scrollWidth, clientWidth, scrollLeft } = scrollRef.current;
          setShowLeft(scrollLeft > 0);
          setShowRight(scrollLeft + clientWidth < scrollWidth);
      
          console.log("Scroll mis à jour", { scrollLeft, scrollWidth, clientWidth });
        }
      };
      
      useEffect(() => {
        console.log("scrollRef.current", scrollRef.current);
        updateScrollButtons();
        const refCurrent = scrollRef.current;
        if (refCurrent) {
          refCurrent.addEventListener("scroll", updateScrollButtons);
        }
        return () => {
          if (refCurrent) {
            refCurrent.removeEventListener("scroll", updateScrollButtons);
            console.log("Listener scroll supprimé");
          }
        };
      }, []);
      
      
      
        
        const scroll = (direction) => {
          if (scrollRef.current) {
            scrollRef.current.scrollBy({
              left: direction === "left" ? -200 : 200, // déplacement
              behavior: "smooth", // animation fluide
            });
          }
        };
        const handleChange = (event) => {
          setSelected(event.target.value);
        };
  const secteurs = [
  "Toutes",
  "Agroalimentaire",
  "Industrie",
  "Informatique",
  "Artisanat",
  "Énergie",
  "BTP et Construction",
  "Transport et Logistique",
  "Commerce et Distribution",
  "Banque et Assurance",
  "Télécommunications",
  "Santé et Pharmaceutique",
  "Éducation et Formation",
  "Tourisme et Hôtellerie",
  "Restauration",
  "Immobilier",
  "Mode et Textile",
  "Médias et Communication",
  "Audiovisuel et Cinéma",
  "Arts et Culture",
  "Environnement et Développement Durable",
  "Agriculture",
  "Pêche et Aquaculture",
  "Automobile",
  "Aéronautique et Spatial",
  "Recherche et Innovation",
  "Sécurité",
  "Services aux Entreprises",
  "Services aux Particuliers",
  "Économie Sociale et Solidaire"
];


  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.cardContent}>
          <div className={styles.imageWrapper}>
            <div className={styles.cardImage}>
  <img src={livre} alt="Illustration" className={styles.image} />

            </div>
          
            {/* Texte centré dans l’image */}
            <div className={styles.overlay}>
                <div className={styles.total}>
      <AnimatedCounter end={120}  />
                <h4>Normes malagasy</h4>
 
                </div>
                <div className={styles.total}>
  <AnimatedCounter end={45} />
 <h4>Secteurs</h4>
                </div>
                   <div className={styles.total}>
  <AnimatedCounter end={350000} />
   <h4>Ariary / pages</h4>
                </div>   
             
             
           
            </div>
          </div>
          <div className={styles.content}>
           <div className={styles.seacrhBar}>
            <i class="fa-solid fa-magnifying-glass"></i>
           <input type="text" placeholder='Rechercher une norme...'
            />

           </div>
              {showContainer && (
              <div className={styles.searchContainer}>
                <p>Contenu du container ici...</p>
          
              </div>
            )}
         

          </div>
<div className={styles.scrollContainer}>
   {showLeft && (
    <div style={{display :"flex" ,alignContent :"center" ,
      paddingRight : 13
    }}>
  <IconButton 
      onClick={() => scroll("left")} 
      sx={{
        
        bgcolor :"transparent",
        position: "relative",
        "&:hover": { bgcolor: "transparent", transform: "scale(1.1)" },
        transition: "all 0.2s ease",
      }}
    >
      <i className="fa-solid fa-chevron-left" style={{color :"black"}}></i>
    </IconButton>
    </div>
  
  )}

  {/* Zone scrollable */}
  <div ref={scrollRef} className={styles.scrollBtns}>
    {secteurs.map((item, index) => (
      <button
        key={index}
        className={`${styles.scrollBtn} ${selected === item ? styles.activeBtn : ""}`}
        onClick={() => setSelected(item)}
      >
        {item}
      </button>
    ))}
  </div>

  {showRight && (
     <div style={{display :"flex" ,alignContent :"center" ,
      paddingLeft : 13
    }}>
    <IconButton 
      onClick={() => scroll("right")} 
      sx={{
      
        bgcolor: "white",
        "&:hover": { bgcolor: "transparent", transform: "scale(1.1)" },
        transition: "all 0.2s ease",
      }}
    >
      <i className="fa-solid fa-chevron-right" style={{color :"black"}}></i>
    </IconButton>
</div>
  )}
  

           </div>

           <div className={styles.listes}>
  {[1, 2, 3, 4, 5].map((item) => (
    <div key={item} className={styles.cardliste}>
      <h3>Card {item}</h3>
      <p>Contenu de la carte {item}</p>
    </div>
  ))}
</div>

        </div>
      </div>
    </div>
  );
}

export default Biblio;
