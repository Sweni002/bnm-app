import React, { useState, useEffect, useRef } from 'react';
import styles from './norme.module.css';
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


function Norme() {
  const navigate=useNavigate()
  const [normes, setNormes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState("Toutes");
  const scrollRef = useRef(null);
const [showLeft, setShowLeft] = useState(false);
const [showRight, setShowRight] = useState(false);
const isMobile = useMediaQuery('(max-width:768px)');
const isMobileSearch = useMediaQuery('(max-width:725px)');
const [searchTerm, setSearchTerm] = useState("");
const [filteredNormes, setFilteredNormes] = useState([]);
const [secteurs, setSecteurs] = useState([]);
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

 const [scrollPdf, setScrollPdf] = useState('paper');

   const handleClickOpenPdf =  () => {
    setOpenPdfDialog(true);
  
  };

  const handleClosePdf = () => {
    setOpenPdfDialog(false);
    setLoadingPdf(false)
    setNomM('')
    setCode('')
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

  navigate("/ajout_norme")
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
  authFetch("http://localhost:8000/normes", {}, navigate)
    .then(res => {
      if (res?.success) {
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
        setNormes(mappedData);

        console.log(mappedData)
        setFilteredNormes(mappedData);
         // ✅ réinitialiser la sélection
        setSelected("Toutes");
        setSelectedSecteurId(null);

      } else {
        setNormes([]);
        setSnackMessage("Erreur du connexion")
        setOpenSnack(true)
        setFilteredNormes([]);
      }
      setLoading(false);
    });
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

  const columns1 = [
  {
    title: 'Nom',
    dataIndex: 'nom',
    key: 'nom',
  },
  {
    title: 'Date d’édition',
    dataIndex: 'dateEdition',
    key: 'dateEdition',
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
  },
 {
  title: '',
  key: 'actions',
  render: (text, record) => (
    <div className={styles.iconRow}>
      <Tooltip title='Modifier'>
        <div className={styles.iconCircle}>
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

      <Tooltip title='Consulter'>
        <div className={styles.iconCircle}>
          <IconButton aria-label="view" size="small">
            <FileAddOutlined style={{ color: '#44B700', fontSize: 18 }} />
          </IconButton>
        </div>
      </Tooltip>
    </div>
  ),
}

];

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
    setFilteredNormes(normes); // afficher tout
  } else {
    const filtered = normes.filter(n =>
      n.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.codification?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.secteur?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredNormes(filtered);
  }
}, [searchTerm, normes]);


const columns = [
  {
    title: 'Nom',
    dataIndex: 'nom',
    key: 'nom',
  },
  {
    title: 'Codification',
    dataIndex: 'codification',
    key: 'codification',
  },
  {
    title: 'Date d’édition',
    dataIndex: 'dateEdition',
    key: 'dateEdition',
  },
 
  {
    title: 'Secteur',
    dataIndex: 'nomsecteur',
    key: 'nomsecteur',
  },
  {
    title: '',
    key: 'actions',
   render: (_, record) => (
    <div className={styles.iconRow}>
      <Tooltip title='Modifier'>
        <div className={styles.iconCircle}  onClick={() => navigate('/modifier_norme', { state: { record } })}  >
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

      <Tooltip title='Consulter'>
        <div className={styles.iconCircle} onClick={() => openPdf(record)}>

          <IconButton aria-label="view" size="small">
            <FileAddOutlined style={{ color: '#44B700', fontSize: 18 }} />
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
      `http://localhost:8000/normes/view_pdf/${normeId.key}`,
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
  fetch(`http://localhost:8000/normes/secteur/${secteur.id}`, {
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
        setNormes(mappedData);
        setFilteredNormes(mappedData);
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

const handleConfirmDelete = () => {
     
  };


const openFullscreen = () => {
  const elem = document.getElementById("pdfViewer");
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  }
};




  return (
    <div className={styles.container}>
        {/* Conteneur flex pour deux Cards */}
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap:1, flexWrap: 'wrap', width: '100%'  , alignItems :"flex-start" }}>
<Box
  className={styles.cardLeft}
  sx={{
    border: "1px solid lightgray",
    borderRadius: 2,
    p: 2,
    bgcolor: "#fff",
    pb: 4,
    display: { xs: "none", md: "block" }
  }}
>
      {/* Header avec icône */}
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2, pl: 2 ,
      fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif"

     }}>
  <i className="fa-solid fa-arrow-down-short-wide"></i>
  <Typography variant="h6" sx={{ fontWeight: 'bold' ,
     fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif"

   }}>
    Secteurs
  </Typography>
</Box>

      <Divider sx={{ mb: 4 }} />

      {/* Liste des options */}
   <Box sx={{ mb: 3 ,mt :3}}>
  <TextField
   value={searchTermSecteur}
  onChange={(e) => setSearchTermSecteur(e.target.value)}

 placeholder='Rechercher un secteur'
    variant="outlined"
    size="small"
    fullWidth
    sx={{
      "& .MuiOutlinedInput-root": {
        borderRadius: 2,

        pl : 2 ,
        pt : 1 ,
        pb :1,
         fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif"

         


      },
    }}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
      <i class="fa-solid fa-magnifying-glass"
      style={{fontSize : 20 ,paddingRight : 5 ,color : "black"}}></i>    </InputAdornment>
      ),
    }}
  />
</Box>
{/* RadioGroup */}
<RadioGroup value={selected} onChange={handleChange} sx={{ pl: 2, color: "gray" }}>

    <FormControlLabel
    value="Toutes"
    control={<Radio />}
    label="Toutes"
    onClick={() => {
      setSelected("Toutes");
      setSelectedSecteurId(null);

      const token = localStorage.getItem("access_token");
      fetch("http://localhost:8000/normes", {
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
            console.log("triage : " , mappedData)
            setNormes(mappedData);
            setFilteredNormes(mappedData);
          }
        })

        .catch(console.error);
    }}
    sx={{
      userSelect: "none",
      borderRadius: 1.5,
      px: 1,
      my: 0.3,
      cursor: "pointer",
      transition: "all 0.2s ease",
      "&:hover": { bgcolor: "#f0f0f0", transform: "scale(1.02)" },
      "& .MuiFormControlLabel-label": {
        fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif",
      },
    }}
  />
  {secteursAffiches.map(s => (
    <FormControlLabel
      onClick={() => handleSecteurClick(s)} // 👈 appel API

      key={s.id}
      value={s.nom}
      control={<Radio />}
      label={s.nom}
      sx={{
        userSelect: "none",
        borderRadius: 1.5,
        px: 1,
        my: 0.3,
        cursor: "pointer",
        transition: "all 0.2s ease",
        "&:hover": { bgcolor: "#f0f0f0", transform: "scale(1.02)" },
        "& .MuiFormControlLabel-label": { fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif" },
      }}
    />
  ))}

 {searchTermSecteur === "" && secteurs.length > 10 && (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        mt: 1,
        cursor: "pointer",
        color: "#1B6979",
        "&:hover": { textDecoration: "underline" },
      }}
       onClick={() => setShowAllSecteurs(!showAllSecteurs)}
    >
     <i className={`fa-solid ${showAllSecteurs ? "fa-minus" : "fa-plus"}`} style={{ fontSize: 19 }}></i>
      <Typography
        variant="body2"
        sx={{ fontSize: 18, fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif"  }}
      >
         {showAllSecteurs ? "Voir moins" : "Voir plus"}
      </Typography>
    </Box>
  )}
</RadioGroup>


    </Box>


  {/* Card droite */}
  
  <div className={styles.cardRight } >
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
    <button
    key="toutes"
    className={`${styles.scrollBtn} ${selected === "Toutes" ? styles.activeBtn : ""}`}
    onClick={() => {
      setSelected("Toutes");
      setSelectedSecteurId(null);

      const token = localStorage.getItem("access_token");
      fetch("http://localhost:8000/normes", {
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
              console.log("triage : " , mappedData)
       
            setNormes(mappedData);
            setFilteredNormes(mappedData);
          }
        })
        .catch(console.error);
    }}
  >
    Toutes
  </button>
      {secteurs.map((s) => (
     <button
      key={s.id}
        ref={el => scrollBtnsRef.current[s.id] = el} // 👈 stocke le bouton

      className={`${styles.scrollBtn} ${selected === s.nom ? styles.activeBtn : ""}`}
       onClick={() => handleSecteurClick(s)} // 👈 appel API
    >
      {s.nom}   {/* ✅ afficher uniquement le nom */}
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
  columns={isMobile ? columnsMobile : columns}
  dataSource={filteredNormes}   // ✅ et non normes
  pagination={{ pageSize:isMobile ? 20 :30  }}
  rowClassName={() => styles.largeRow}
  onHeaderRow={() => ({ className: styles.largeHeader })}

  scroll={{ y: 400 }}
/>

</Spin>


   </div>
   
   </Card>
  </div>
  </div>
</Box>
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
<Modal
  open={openPdfDialog}
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
        <div style={{position :"absolute" ,top : -30 , zIndex:10 ,right : -100}}>


     <IconButton onClick={handleClosePdf}>
        <CloseIcon style={{color :"white"}}/>
      </IconButton>
          </div>
    {loadingPdf ? (
      <CircularProgress color="inherit" />
    ) : pdfUrl ? (
      <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
          <Viewer
            fileUrl={pdfUrl}
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

export default Norme;
