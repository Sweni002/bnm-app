import React, { useEffect, useRef, useState } from 'react';
import styles from './biblio.module.css';
import livre from '../assets/livre.jpeg'; // ton image
import { Card, Row, Col, Statistic } from "antd";
import { useMediaQuery } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { authFetch, authFetchPdf } from './utils/authFetch';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';
import CardNorme
 from './CardNorme';
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
  const navigate = useNavigate();
 const [normes, setNormes] = useState([]);

const [pdfUrl, setPdfUrl] = useState(null);
const [loadingPdf, setLoadingPdf] = useState(false);
const [nomM, setNomM] = useState("");
const [code, setCode] = useState("");
const [openPdfDialog, setOpenPdfDialog] = useState(false);
const [visibleCount, setVisibleCount] = useState(4);

       const [showContainer, setShowContainer] = useState(false);
 const [totalNormes, setTotalNormes] = useState(0);
  const [totalSecteurs, setTotalSecteurs] = useState(0);
const [snackMessage, setSnackMessage] = useState('');
const [snackError, setSnackError] = useState(false);
const [openSnack, setOpenSnack] = useState(false);
         const scrollRef = useRef(null);
       const [showLeft, setShowLeft] = useState(false);
       const [showRight, setShowRight] = useState(false);
const [searchText, setSearchText] = useState('');
const [secteurs, setSecteurs] = useState([]);
const isMobile = useMediaQuery('(max-width:768px)');
const isMobileSearch = useMediaQuery('(max-width:725px)');
const [totalPrix, setTotalPrix] = useState(0);
  const [selectedSecteurId, setSelectedSecteurId] = useState(null); // <--- nouvel état
  const [selected, setSelected] = useState(""); // nom du secteur sélectionné
const [showDetails, setShowDetails] = useState(false);



 useEffect(() => {
    const fetchNormes = async () => {
      try {
        const res = await authFetch("/normes", {}, navigate);
        if (res?.success) {
          setNormes(res.data);
        } else {
          setSnackMessage("Erreur lors de la récupération des normes");
          setOpenSnack(true);
        }
      } catch (err) {
        console.error(err);
        setSnackMessage("Erreur serveur");
        setOpenSnack(true);
      }
    };
    fetchNormes();
  }, [navigate]);
useEffect(() => {
  authFetch("/secteurs", {}, navigate)
    .then(res => {
      if (res?.success) {
        setSecteurs(res.data);
           }
      else{
        setSnackMessage("Erreur")
           setOpenSnack(true)
      }
    });
}, []);

const openPdf = async (norme) => {
  setLoadingPdf(true);
  handleClickOpenPdf();
  setNomM(norme.nom);
  setCode(norme.codification);
  try {
    const blob = await authFetchPdf(
      `/normes/view_pdf/${norme.id}`, // ou norme.key selon ton backend
      {},
      navigate,
      "blob"
    );

    if (blob) {
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    }
  } catch (error) {
    setSnackMessage("Erreur lors du chargement du PDF");
    setSnackError(true);
    setOpenSnack(true);
  } finally {
    setLoadingPdf(false);
  }
};
   const updateScrollButtons = () => {
  if (scrollRef.current) {
    const { scrollWidth, clientWidth, scrollLeft } = scrollRef.current;

    // Si on est complètement à gauche → cache la flèche gauche
    const atStart = scrollLeft <= 10;

    // Si on est complètement à droite → cache la flèche droite
    const atEnd = scrollLeft + clientWidth >= scrollWidth - 10;

    setShowLeft(!atStart);
    setShowRight(!atEnd);
  }
};


useEffect(() => {
  const refCurrent = scrollRef.current;
  if (!refCurrent) return;

  updateScrollButtons(); // met à jour dès le montage

  refCurrent.addEventListener("scroll", updateScrollButtons);
  window.addEventListener("resize", updateScrollButtons);

  return () => {
    refCurrent.removeEventListener("scroll", updateScrollButtons);
    window.removeEventListener("resize", updateScrollButtons);
  };
}, [secteurs]);

      
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
      
        useEffect(() => {
    const fetchTotals = async () => {
      try {
        const normesData = await authFetch("/normes/count", {}, navigate);
        const secteursData = await authFetch("/secteurs/counts", {}, navigate);
console.log("secteurs" , secteursData)
        if (normesData?.success) setTotalNormes(normesData.data.total_normes);
        if (secteursData?.success) setTotalSecteurs(secteursData.data.total_secteurs);

        // Exemple fictif pour totalPrix (à adapter)
        setTotalPrix(350000);

      } catch (err) {
        console.error("Erreur lors de la récupération des totaux :", err);
      }
    };

    fetchTotals();
  }, [navigate]);
      
    
const scroll = (direction) => {
  if (scrollRef.current) {
    scrollRef.current.scrollBy({
      left: direction === "left" ? -250 : 250,
      behavior: "smooth",
    });

    // met à jour les flèches après un léger délai
    setTimeout(updateScrollButtons, 400);
  }
};

        const handleChange = (event) => {
          setSelected(event.target.value);
        };

 const handleSecteurClick = async (secteur) => {
    // Si on reclique sur le même secteur → on recharge toutes les normes
    if (selectedSecteurId === secteur.id) {
      setSelectedSecteurId(null);
      setSelected("");
      try {
        const res = await authFetch("/normes", {}, navigate);
        if (res?.success) setNormes(res.data);
      } catch (error) {
        console.error(error);
      }
      return;
    }

    // Sinon → on charge les normes de ce secteur
    setSelectedSecteurId(secteur.id);
    setSelected(secteur.nom);

    try {
      const res = await authFetch(`/normes/secteur/${secteur.id}`, {}, navigate);
      if (res?.success) {
        setNormes(res.data);
      } else {
        setSnackMessage("Aucune norme trouvée pour ce secteur");
        setOpenSnack(true);
      }
    } catch (error) {
      console.error("Erreur lors du filtrage :", error);
      setSnackMessage("Erreur de filtrage");
      setOpenSnack(true);
    }
  };
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
         <AnimatedCounter end={totalNormes} />
        
                <h4>Normes malagasy</h4>
 
                </div>
                <div className={styles.total}>
  <AnimatedCounter end={totalSecteurs} />
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
  <i className="fa-solid fa-magnifying-glass"></i>
<input
  type="text"
  placeholder='Rechercher une norme...'
  value={searchText}
  onChange={(e) => setSearchText(e.target.value)}
/>
{searchText && (
  <Tooltip title='Effacer' placement='top'>
   <IconButton size="large" onClick={() => setSearchText('')}>
       <i className={`fa-solid fa-circle-xmark ${styles.closeIcon}`}></i>
    </IconButton>
  </Tooltip>
)}


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
    key={item.id}
    className={`${styles.scrollBtn} ${selected === item.nom ? styles.activeBtn : ""}`}
     onClick={() => handleSecteurClick(item)}
  
  >
    {item.nom}
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

    <div className={styles.listes2}>
  {normes
    .filter((n) => n.nom.toLowerCase().includes(searchText.toLowerCase()))
    .slice(0, visibleCount)
    .map((norme) => (
      <CardNorme
        navigate={navigate}
        key={norme.id}
        idnorme={norme.id}
        images={norme.fichier_pdf || '/default.png'}
        nomnorme={norme.nom}
        nomsecteur={norme.secteur?.nom || '—'}
        dateEdition={norme.date_creation}
        codification={norme.codification}
        nbpages={norme.nbrepage}
         setShow={setShowDetails}
  openShow={showDetails}
      />
    ))}

  {/* Bouton "Afficher plus" */}
  {visibleCount < normes.filter((n) =>
      n.nom.toLowerCase().includes(searchText.toLowerCase())
    ).length && (
      <div className={styles.showMoreCard} onClick={() => navigate("/a_propos")}>
        <i className="fa-solid fa-right-long" style={{ fontSize: '2rem' }}></i>
        <span>Voir plus</span>
      </div>
    )}
</div>


 </div>
   

        </div>
      </div>
         <Snackbar
        open={openSnack}
        autoHideDuration={4000}
        onClose={() => setOpenSnack(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <SnackbarContent
          sx={{
            p: 1,
            px : 3,
            fontSize: '17px',
            color: 'white'
          }}
          message={<span>{snackMessage}</span>}
        />
      </Snackbar>
    </div>
  );
}

export default Biblio;
