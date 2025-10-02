import React, { useState, useEffect, useRef } from 'react';
import styles from './secteur.module.css';
import { Breadcrumbs, Link as MUILink, Typography, Card, CardContent, Box } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import {  Radio, RadioGroup, FormControlLabel, Divider } from "@mui/material";
import { TextField, InputAdornment } from '@mui/material';
import { Table } from 'antd';
import { Spin } from "antd";
import { Tooltip } from 'antd';
import IconButton from '@mui/material/IconButton';
import { EditOutlined, FileAddOutlined, FileOutlined } from '@ant-design/icons';
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useMediaQuery } from '@mui/material';
import MobileActionButton from './Modal';
import { useLocation, useNavigate } from 'react-router-dom';
import { authFetch, authFetchPdf } from './utils/authFetch';
import { styled } from "@mui/material/styles";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from '@mui/material/CircularProgress';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';
import { Worker, Viewer } from '@react-pdf-viewer/core';
//import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/zoom/lib/styles/index.css';
import { Modal } from '@mui/material';
import { Document, Page } from 'react-pdf';
import CloseIcon from '@mui/icons-material/Close';
import { pdfjs } from 'react-pdf';
import {   SpecialZoomLevel } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { ThreeDot ,OrbitProgress } from 'react-loading-indicators';
import { Breadcrumb } from 'antd';
pdfjs.GlobalWorkerOptions.workerSrc =
  'https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js';




const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    backgroundColor: "white",
    borderRadius: "25px",
    padding: theme.spacing(2),
    width: "100%",
    maxWidth: "400px",
  },
}))

const BootstrapDialogMobile = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    backgroundColor: "white",
    borderRadius: "15px",
    padding: theme.spacing(1.7),
    width: "100%",
    maxWidth: "350px",
  },
}))


function Secteur() {
  const navigate=useNavigate()
  const [secteurs, setsecteurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState("Toutes");
  const scrollRef = useRef(null);
const [showLeft, setShowLeft] = useState(false);
const [showRight, setShowRight] = useState(false);
const isMobile = useMediaQuery('(max-width:768px)');
const isMobileSearch = useMediaQuery('(max-width:725px)');
const [searchTerm, setSearchTerm] = useState("");
const [filteredsecteurs, setFilteredsecteurs] = useState([]);

const [loadingSecteurs, setLoadingSecteurs] = useState(true);
const [searchTermSecteur, setSearchTermSecteur] = useState("");
const [secteursAffiches, setSecteursAffiches] = useState([]); // secteurs filtrés pour l'affichage
const [showAllSecteurs, setShowAllSecteurs] = useState(false);
const [selectedSecteurId, setSelectedSecteurId] = useState(null);
   const [loadingSupp, setLoadingSupp] = useState(false);
const location = useLocation();
const [code, setCode] = useState(null);
const [nomN, setNomM] = useState(null);
const [snackMessage, setSnackMessage] = useState('');
const [snackError, setSnackError] = useState(false);
const [openSnack, setOpenSnack] = useState(false);
const [openPdfDialog, setOpenPdfDialog] = useState(false);
const [pdfUrl, setPdfUrl] = useState("");
const [loadingPdf, setLoadingPdf] = useState(false);
const scrollBtnsRef = useRef({});
//const zoomPluginInstance = zoomPlugin();
//const { ZoomInButton, ZoomOutButton, CurrentScale } = zoomPluginInstance;
//const defaultLayoutPluginInstance = defaultLayoutPlugin();
const pdfContentRef = useRef(null);

useEffect(() => {
  if (!openPdfDialog) return; // ne rien faire si le PDF n'est pas ouvert

  const handleVisibilityChange = () => {
    if (!document.hidden) {
      // La fenêtre redevient visible
      window.location.reload();
    }
  };

  const handleWindowFocus = () => {
    // La fenêtre reçoit le focus
    window.location.reload();
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('focus', handleWindowFocus);

  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('focus', handleWindowFocus);
  };
}, [openPdfDialog]);

 const [scrollPdf, setScrollPdf] = useState('paper');

   const handleClickOpenPdf =  () => {
    setOpenPdfDialog(true);
  
  };

  const handleClosePdf = () => {
  if (pdfUrl) {
    URL.revokeObjectURL(pdfUrl);
  }
  setPdfUrl("");
  setOpenPdfDialog(false);
  setLoadingPdf(false);
  setNomM("");
  setCode("");
};

  const descriptionElementRef =useRef(null);
  useEffect(() => {
    if (openPdfDialog) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [openPdfDialog]);

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


const goAjout=()=>{

  navigate("/ajout_secteur")
}


const goModif=()=>{

  navigate("/modifier_norme" )
}

useEffect(() => {
  authFetch("http://localhost:8000/secteurs", {}, navigate)
    .then(res => {
      if (res?.success) {
        setSecteurs(res.data);
        setSecteursAffiches(res.data.slice(0, 10));
      }
      else{
        setSnackMessage("Erreur")
           setOpenSnack(true)
      }
    });
}, []);
// filtrage dynamique
useEffect(() => {
  let filtered = secteurs.filter(s =>
    s.nom.toLowerCase().includes(searchTermSecteur.toLowerCase())
  );

  if (!showAllSecteurs) {
    filtered = filtered.slice(0, 10); // si pas "voir plus", limite à 10
  }

  setSecteursAffiches(filtered);
}, [searchTermSecteur, secteurs, showAllSecteurs]);
useEffect(() => {
  setLoading(true);
  authFetch("http://localhost:8000/secteurs", {}, navigate)
    .then(res => {
      if (res?.success) {
        const mappedData = res.data.map((n) => ({
          key: n.id,
          nom: n.nom,
          dateEdition: n.date_creation?.split("T")[0] || "",
          codification: n.codification,
          fichier_pdf: n.fichier_pdf ,
          nomsecteur: n.secteur?.nom || "",
          idsecteur: n.secteur?.id || "",
          nbrepage: n.nbrepage
        }));

        setsecteurs(mappedData);

        // Restaurer la recherche si elle existe
        const savedSearch = sessionStorage.getItem("searchTermNorme") || "";
        setSearchTerm(savedSearch);

        // Appliquer le filtrage **immédiatement**
        const filtered = savedSearch
          ? mappedData.filter(n =>
              n.nom.toLowerCase().includes(savedSearch.toLowerCase()) ||
              n.codification?.toLowerCase().includes(savedSearch.toLowerCase()) ||
              n.nomsecteur?.toLowerCase().includes(savedSearch.toLowerCase())
            )
          : mappedData;

        setFilteredsecteurs(filtered);
      } else {
        setsecteurs([]);
        setFilteredsecteurs([]);
        setSnackMessage("Erreur du connexion");
        setOpenSnack(true);
      }
      setLoading(false);
    });
}, []);



useEffect(() => {
  const snackMsg = sessionStorage.getItem('snackMessage');
  const snackErr = sessionStorage.getItem('snackError') === 'true';

  if (snackMsg) {
    setSnackMessage(snackMsg);
    setSnackError(snackErr);
    setOpenSnack(true);

    // Nettoyage après affichage
    sessionStorage.removeItem('snackMessage');
    sessionStorage.removeItem('snackError');
  }
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
const fileTypes = [
  "PDF", "DOCX", "XLSX", "PPTX", "TXT", "CSV", "JSON", "XML", "HTML", "CSS",
  "JS", "TS", "React", "Vue", "Angular", "Java", "Python", "C++", "C#", "PHP",
  "Go", "Rust", "Swift", "Kotlin", "Ruby", "Perl", "Shell", "Docker", "YAML",
  "Markdown", "Latex", "Photos", "PNGs", "JPEGs", "SVGs", "GIFs", "Vidéos",
  "MP4", "AVI", "MOV", "MKV", "Audio", "MP3", "WAV", "FLAC", "ZIP", "RAR",
  "ISO", "Autres"
]; // Ici on en a 50 pile


// Exemple de données
const data = [
  {
    key: '1',
    nom: 'Norme A',
    dateEdition: '2025-01-15',
    codification: 'Photos',
  },
  {
    key: '2',
    nom: 'Norme B',
    dateEdition: '2025-03-22',
    codification: 'Photos',
    
  },
  {
    key: '3',
    nom: 'Norme C',
    dateEdition: '2025-07-10',
        codification: 'Photos',

  },
];

useEffect(() => {
  if (searchTerm === "") {
    setFilteredsecteurs(secteurs); // afficher tout
  } else {
    const filtered = secteurs.filter(n =>
      n.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.codification?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.secteur?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredsecteurs(filtered);
  }
}, [searchTerm, secteurs]);

// À mettre dans ton composant ou dans un useEffect global
useEffect(() => {
  const handleBeforeUnload = () => {
    sessionStorage.removeItem("searchTermNorme");
    sessionStorage.removeItem("selectedSecteurId");
    sessionStorage.removeItem("snackMessage");
    sessionStorage.removeItem("snackError");
  };

  window.addEventListener("beforeunload", handleBeforeUnload);

  return () => {
    window.removeEventListener("beforeunload", handleBeforeUnload);
  };
}, []);


useEffect(() => {
  const savedSecteurId = sessionStorage.getItem("selectedSecteurId");
  if (savedSecteurId) {
    const secteur = secteurs.find(s => s.id === parseInt(savedSecteurId));
    if (secteur) {
      handleSecteurClick(secteur); // réapplique le filtre
    }
  }
}, [secteurs]);


const columns = [
  {
    title: 'Nom',
    dataIndex: 'nom',
    key: 'nom',
  },

  {
    title: '',
    key: 'actions',
   render: (_, record) => (
    <div className={styles.iconRow}>
      <Tooltip title='Modifier'>
        <div className={styles.iconCircle}  onClick={() => {
  sessionStorage.setItem("searchTermNorme", searchTerm); 
  sessionStorage.setItem("selectedSecteurId", selectedSecteurId);// sauvegarde la recherche
  navigate('/modifier_norme', { state: { record } });
}}
 >
          <IconButton aria-label="edit" size="small">
            <EditOutlined style={{ color: '#1B6979', fontSize: 18 }} />
          </IconButton>
        </div>
      </Tooltip>

      <Tooltip title='Supprimer'>
        <div className={styles.iconCircle} onClick={() => handleDeleteClick(record)}> 
          <IconButton aria-label="delete" size="small">
            <i className="fa-regular fa-trash-can" style={{ color: '#ff4d4f', fontSize: 18, cursor: 'pointer' }}></i>
          </IconButton>
        </div>
      </Tooltip>

    </div>
  ),
  },
];
const openPdf = async (normeId) => {
  setLoadingPdf(true); // Affiche le Backdrop
    handleClickOpenPdf(); // Ouvre le dialog après 4 secondes
setNomM(normeId.nom)
setCode(normeId.codification)
  try {
    const blob = await authFetchPdf(
      `http://localhost:8000/secteurs/view_pdf/${normeId.key}`,
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
    setLoadingPdf(false); // Masque le Backdrop
  }
};


// Colonnes mobile complètes
const columnsMobile = [
  { title: 'Nom', dataIndex: 'nom', key: 'nom' },
  { title: 'Codification', dataIndex: 'codification', key: 'codification' },

  { title: 'Secteur', dataIndex: 'nomsecteur', key: 'nomsecteur' },
  {
    title: '',
    key: 'actions',
    width: 40,
    render: (_, record) => <MobileActionButton record={record}
    onModifier={() => navigate('/modifier_norme', { state: { record } })} 
     onConsulte={() => openPdf(record)}
         onDelete={() => handleDeleteClickMobile(record)} // 👈 appelle le même handler
 />,
  },
];

const handleSecteurClick = (secteur) => {
  setSelected(secteur.nom); // pour surligner
  setSelectedSecteurId(secteur.id);

  const token = localStorage.getItem("access_token");
  fetch(`http://localhost:8000/secteurs/secteur/${secteur.id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.success) {
        const mappedData = res.data.map((n) => ({
         key: n.id,
          nom: n.nom,
          dateEdition: n.date_creation?.split("T")[0] || "",
          codification: n.codification,
          fichier_pdf: n.fichier_pdf ,
          nomsecteur: n.secteur?.nom || "",
          idsecteur:n.secteur?.id || "",
          nbrepage : n.nbrepage
        }));
        setsecteurs(mappedData);
        setFilteredsecteurs(mappedData);
      }
    })
    .catch(console.error);

     const btn = scrollBtnsRef.current[secteur.id];
if (btn && scrollRef.current) {
  btn.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
    inline: 'center'
  });
}

};
const [confirmOpen, setConfirmOpen] = useState(false);
const [recordToDelete, setRecordToDelete] = useState(null);
const [confirmOpenMobile, setConfirmOpenMobile] = useState(false);

const handleDeleteClick = (record) => {
  setRecordToDelete(record);
  setConfirmOpen(true);
};

const handleDeleteClickMobile = (record) => {
  setRecordToDelete(record);
  setConfirmOpenMobile(true);
};

const handleConfirmDelete = async () => {
  if (!recordToDelete) return;
  setLoadingSupp(true);

  try {
    const res = await authFetch(
      `http://localhost:8000/secteurs/${recordToDelete.key}`,
      { method: "DELETE" },
      navigate
    );

    if (res?.success) {
      // ✅ Retirer la norme supprimée de la liste affichée
      setsecteurs(prev => prev.filter(n => n.key !== recordToDelete.key));
      setFilteredsecteurs(prev => prev.filter(n => n.key !== recordToDelete.key));

      setSnackMessage("Norme supprimée avec succès");
      setSnackError(false);
      setOpenSnack(true);
    } else {
      setSnackMessage(res?.message || "Erreur lors de la suppression");
      setSnackError(true);
      setOpenSnack(true);
    }
  } catch (error) {
    setSnackMessage("Erreur réseau");
    setSnackError(true);
    setOpenSnack(true);
  } finally {
    setLoadingSupp(false);
    setConfirmOpen(false);
    setConfirmOpenMobile(false);
    setRecordToDelete(null);
  }
};



const openFullscreen = () => {
  const elem = document.getElementById("pdfViewer");
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  }
};




  return (
    <div className={styles.container}>
         
  <Breadcrumb className={styles.breadcrumb}>
        <Breadcrumb.Item>Secteur</Breadcrumb.Item>
        <Breadcrumb.Item>Liste</Breadcrumb.Item>
      </Breadcrumb>


  <div className={styles.cardcontent}>
      {/* ✅ Search en haut si mobile */}
     {isMobileSearch && (
       <div className={styles.searchBarMobile} style={{marginTop :20}}>
         <input type="text" placeholder="Rechercher ..."   value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
 />
         <i className="fa-solid fa-magnifying-glass"></i>
       </div>
     )}

 
<Card sx={{boxShadow:3 , p:3 ,borderRadius :"15px" ,
  marginTop: 2
}} className={styles.cards}>



   <div className={styles.haut}>

   <button onClick={goAjout}>
     <div className={styles.jk} style={{ display: "flex", alignItems: "center", gap: 10, color: "white", fontWeight: "bold", fontSize: 19 }}>
              <i className="fa-solid fa-plus"></i><span>Ajouter</span>
            </div>
   </button>
   

  <div className={styles.searchBar}>
  <input type="text" placeholder='Rechercher ...'   value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
 />
  <i class="fa-solid fa-magnifying-glass"></i>
  </div>
   </div>

   <div className={styles.bas}>
<Spin spinning={loading}>
<Table
  columns={columns}
  dataSource={filteredsecteurs}
  pagination={{ pageSize: isMobile ? 20 : 30 }}
  rowClassName={() => styles.largeRow}
  onHeaderRow={() => ({ className: styles.largeHeader })}
  scroll={{ y: 400 }} // x pour scroll horizontal si nécessaire
  style={{ width: '100%' }} // ✅ force la largeur
/>


</Spin>


   </div>
   
   </Card>

  </div>

<div className={styles.fab} onClick={goAjout} >
 <div className={styles.jk} style={{ display: "flex", alignItems: "center", gap: 10, color: "white", fontWeight: "bold", fontSize: 19 }}>
              <i className="fa-solid fa-plus"></i>
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
 <BootstrapDialogMobile
        onClose={() => setConfirmOpenMobile(false)}
             aria-labelledby="customized-dialog-title"
        open={confirmOpenMobile}
        
      >
        
        <div   className={styles.dial} style={{margin :10 ,display  :"flex" , flexDirection :"column" ,
          alignItems :"flex-start" ,justifyContent :"center" ,gap : 20
        }}>
  <h3 style={{fontSize : 22}}>Suppression...</h3>
 <label htmlFor="id
     " style={{fontSize : 16 ,color :"#676767"}}>Voulez-vous vraiment supprimer cette norme ?
  
      </label> 
      <div  className={styles.supp}>
        <div className={styles.supp1}>
  <button   onClick={(()=>setConfirmOpenMobile(false))} >Non</button>

        </div>
  <div className={styles.supp2}>
    <button   onClick={handleConfirmDelete}
   >          {loadingSupp ? (
      <Spin size="small" />
    ) : "Oui"}

   </button>
     
  </div>

      </div>
        </div>
    
        </BootstrapDialogMobile>

         <BootstrapDialog
        onClose={() => setConfirmOpen(false)}
             aria-labelledby="customized-dialog-title"
        open={confirmOpen}
        
      >
        
        <div   className={styles.dial} style={{margin :10 ,display  :"flex" , flexDirection :"column" ,
          alignItems :"flex-start" ,justifyContent :"center" ,gap : 20
        }}>
  <h3 style={{fontSize : 22}}>Suppression...</h3>
 <label htmlFor="id
     " style={{fontSize : 16 ,color :"#676767"}}>Voulez-vous vraiment supprimer cette norme ?
  
      </label> 
      <div  className={styles.supp}>
        <div className={styles.supp1}>
  <button   onClick={(()=>setConfirmOpen(false))} >Non</button>

        </div>
  <div className={styles.supp2}>
    <button   onClick={handleConfirmDelete}
   >          {loadingSupp ? (
      <Spin size="small" />
    ) : "Oui"}

   </button>
     
  </div>

      </div>
        </div>
    
        </BootstrapDialog>

    </div>
  );
}

export default Secteur;
