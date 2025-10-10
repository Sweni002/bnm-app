import React, { useEffect, useRef, useState } from 'react';
import styles from './apropos.module.css';
import livre from '../assets/livre.jpeg'; // ton image
import { Card, Row, Col, Statistic } from "antd";
import { useMediaQuery } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { authFetch, authFetchPdf } from './utils/authFetch';
import { useLocation, useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import SnackbarContent from '@mui/material/SnackbarContent';
import CardNorme
 from './CardNorme';
 import { pdfjs } from 'react-pdf';
 import { Worker, Viewer } from '@react-pdf-viewer/core';
 //import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
 import { zoomPlugin } from '@react-pdf-viewer/zoom';
 import '@react-pdf-viewer/core/lib/styles/index.css';
 import '@react-pdf-viewer/zoom/lib/styles/index.css';
 import { Modal } from '@mui/material';
 import {   SpecialZoomLevel } from '@react-pdf-viewer/core';
 import {  OrbitProgress } from 'react-loading-indicators';
 import Box from '@mui/material/Box';
 import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';

 pdfjs.GlobalWorkerOptions.workerSrc =
   'https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js';
 
 

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

function Apropos() {
  const navigate = useNavigate();
 const [normes, setNormes] = useState([]);

const [pdfUrl, setPdfUrl] = useState(null);
const [loadingPdf, setLoadingPdf] = useState(false);
const [nomM, setNomM] = useState("");
const [code, setCode] = useState("");

       const [showContainer, setShowContainer] = useState(false);
 const [totalNormes, setTotalNormes] = useState(0);
  const [totalSecteurs, setTotalSecteurs] = useState(0);
const [snackMessage, setSnackMessage] = useState('');
const [snackError, setSnackError] = useState(false);
const [openSnack, setOpenSnack] = useState(false);
         const scrollRef = useRef(null);
       const [showLeft, setShowLeft] = useState(false);
       const [showRight, setShowRight] = useState(false);
      const [selected, setSelected] = useState("Photos");
const [searchText, setSearchText] = useState('');
const [secteurs, setSecteurs] = useState([]);
const isMobile = useMediaQuery('(max-width:768px)');
const isMobileSearch = useMediaQuery('(max-width:725px)');
const [totalPrix, setTotalPrix] = useState(0);
const location = useLocation();
const norme = location.state;
const detailsRef = useRef(null);

  const handleLikeClick = () => setLiked(!liked);
 const [scrollPdf, setScrollPdf] = React.useState('paper');
const [openPdfDialogs, setOpenPdfDialogs] = useState(false);
const [pdfUrls, setPdfUrls] = React.useState("");
  const [loadingPdfUrls, setLoadingPdfUrls] = React.useState(false);
   const handleClickOpenPdf =  () => {
    setOpenPdfDialogs(true);
  
  };

  const handleClosePdf = () => {
  if (pdfUrls) {
    URL.revokeObjectURL(pdfUrls);
  }
  setPdfUrls("");
  setOpenPdfDialogs(false);
  setLoadingPdfUrls(false);

};


  const openPdfs = async (normeId) => {
    console.log(normeId)
    setLoadingPdfUrls(true); // Affiche le Backdrop
      handleClickOpenPdf(); // Ouvre le dialog après 4 secondes
 
    try {
      const blob = await authFetchPdf(
        `/normes/view_pdf/${normeId.idnorme}`,
        {},
        navigate,
        "blob"
      );
  
      if (blob) {
        const url = URL.createObjectURL(blob);
        setPdfUrls(url);
      }
    } catch (error) {
      setSnackMessage("Erreur lors du chargement du PDF");
      setSnackError(true);
      setOpenSnack(true);
    } finally {
      setLoadingPdfUrls(false); // Masque le Backdrop
    }
  };
const [selectedNorme, setSelectedNorme] = useState(location.state || null);

// Réinitialiser la barre de recherche quand un nouveau norme est sélectionné
useEffect(() => {
  setSearchText(''); // efface le texte
}, [selectedNorme, location.state]);

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
const descriptionElementRef =useRef(null);
  useEffect(() => {
    if (openPdfDialogs) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [openPdfDialogs]);


useEffect(() => {
  if (norme && detailsRef.current) {
    detailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}, [norme]);

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
              left: direction === "left" ? -200 : 200, // déplacement
              behavior: "smooth", // animation fluide
            });
          }
        };
        const handleChange = (event) => {
          setSelected(event.target.value);
        };
const filteredNormes = normes.filter(n =>
  n.nom.toLowerCase().includes(searchText.toLowerCase())
);


  return (
    <div className={styles.container}>
      <div className={styles.card } ref={detailsRef}>
        <div className={styles.cardContent}>
     <div className={styles.fixer}>
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
<div ref={detailsRef}  className={styles.scrollContainer}>
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
    onClick={() => setSelected(item.nom)}
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
     </div>
    
 <div className={styles.listes}>
  {((searchText === '' && norme) || (searchText !== '' && filteredNormes.length < 0)) && (

      <div    className={styles.details}>
 
 <div className={styles.enhaut}>
 
  {norme?.pdfThumbnail && (
    <div className={styles.images}>
  <img
      src={norme.pdfThumbnail}
      alt={norme.nomnorme}
     
    />
    </div>
  
  )}
  <div className={styles.propos}>
    <div className={styles.card2}>
 <label htmlFor="">Nom du norme</label>
    <span>{norme.nomnorme}</span>
    </div>
     <div className={styles.card2}>
 <label htmlFor="">Secteur</label>
    <span>{norme.nomsecteur}</span>
    </div>
      <div className={styles.card2}>
 <label htmlFor="">Date d'edition</label>
    <span>{norme.dateEdition}</span>
    </div>
      <div className={styles.card2}>
 <label htmlFor="">Codification</label>
    <span>{norme.codification}</span>
    </div>
      <div className={styles.card2}>
 <label htmlFor="">Type</label>
    <span>PDF</span>
    </div>
      <div className={styles.card2}>
 <label htmlFor="">Nombre de page</label>
    <span>{norme.nbpages}</span>
    </div>
    <div className={styles.card3}>
  <p>
    Vous ne pouvez pas capturer ni enregistrer ce fichier PDF sauf si vous le 
    vendez sur le site officiel du <strong>Bureau des Normes de Madagascar</strong>. 
    C’est illégal autrement. <br />
    <a
      href="https://www.bnm.mg" 
      target="_blank" 
      rel="noopener noreferrer" 
      style={{
        color: "#1B6979",
        textDecoration: "underline",
        fontWeight: "bold",
        cursor: "pointer" ,
        marginRight : 8
      }}
    >
      Cliquez ici 
    </a>
    pour accéder au site officiel
  </p>
  <div className={styles.btn2}>

     <Button
     fullWidth
        variant="contained"
      color="primary"
      startIcon={<i class="fa-solid fa-arrow-right-from-bracket"></i>}
          sx={{
            p:1,
        textTransform: 'none',
        borderRadius: '4px',
        fontWeight: 500,
        fontSize : '1.0rem' ,
        backgroundColor: '#1976d2',
      }}
  onClick={() => openPdfs(norme)}
    >
      Voir le fichier
    </Button>
  </div>
</div>

  </div>
  
 </div>
  
 
</div>
    )}
        <div className={styles.listes2}>
 {normes
  .filter((n) => n.nom.toLowerCase().includes(searchText.toLowerCase()))
  .map((norme) => (
    <CardNorme
    navigate={navigate}
      idnorme={norme.id}
      images={norme.fichier_pdf || '/default.png'} // ton image ou icône PDF
      nomnorme={norme.nom}
      nomsecteur={norme.secteur?.nom || '—'}
      dateEdition={norme.date_creation}
      codification={norme.codification}
      nbpages={norme.nbrepage}
     
    />
  ))}

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
      <Modal
  open={openPdfDialogs}
  onClose={handleClosePdf} // se déclenche sur clic à l’extérieur ou ESC
  closeAfterTransition

>
  
  <Box
   
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '90%',
      maxWidth: 610,
      height: '90vh',
        backgroundColor: 'transparent', // <-- fond blanc pour PDF
    borderRadius: 2,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
        <div  className={styles.closeBtn}>


     <IconButton onClick={handleClosePdf}>
        <CloseIcon style={{color :"white"}}/>
      </IconButton>
          </div>
    {loadingPdfUrls ? (
<OrbitProgress color={["#7ca4c8", "#a0bdd7", "#c4d6e6", "#e8eff5"]} />

  ) : pdfUrls ? (
      <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
          <Viewer
            fileUrl={pdfUrls}
            theme="light"
            defaultScale={SpecialZoomLevel.PageFit}
            style={{ width: '100%', height: '100%' }}
          />
        </Worker>
      </div>
    ) : (
      <Typography color="error" sx={{ textAlign: 'center' }}>
        Erreur de chargement du PDF
      </Typography>
    )}
  </Box>
</Modal>
    </div>
  );
}

export default Apropos;
