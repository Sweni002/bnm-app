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
import { useNavigate } from 'react-router-dom';

function Norme() {
  const navigate=useNavigate()
  const [normes, setNormes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState("Photos");
  const scrollRef = useRef(null);
const [showLeft, setShowLeft] = useState(false);
const [showRight, setShowRight] = useState(false);
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


const goAjout=()=>{

  navigate("/ajout_norme")
}


  
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

  const columns = [
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
        <div className={styles.iconCircle}>
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


const columnsMobile = [
  { title: 'Codification', dataIndex: 'codification', key: 'codification' },
  { title: 'Nom', dataIndex: 'nom', key: 'nom' },
  {
    title: 'Date d’édition',
    dataIndex: 'dateEdition',
    key: 'dateEdition',
  },
{
  title: '',
  key: 'actions',
  width: 40,
  render: (_, record) => <MobileActionButton record={record} />,
}

];


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


const secteursAffiches = secteurs.slice(0, 10); // seulement 10 premiers


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
<RadioGroup value={selected} onChange={handleChange} sx={{ pl: 2, color: "gray" }}>
  {secteursAffiches.map((secteur, index) => (
    <FormControlLabel
      key={index}
      value={secteur}
      control={<Radio />}
      label={secteur}
      sx={{
        userSelect: "none",
        borderRadius: 1.5,
        px: 1,
        my: 0.3,
        cursor: "pointer",
        transition: "all 0.2s ease",
        "&:hover": {
          bgcolor: "#f0f0f0",
          transform: "scale(1.02)",
        },
        "& .MuiFormControlLabel-label": {
          fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif",
        },
      }}
    />
  ))}

  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1,
      mt: 1,
      cursor: "pointer",
      color: "#1B6979",
      "&:hover": {
        textDecoration: "underline",
      },
    }}
    onClick={() => alert("Afficher tous les secteurs")}
  >
    <i className="fa-solid fa-plus" style={{ fontSize: 19 }}></i>
    <Typography
      variant="body2"
      sx={{
        fontSize: 18,
        fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif",
      }}
    >
      Voir plus
    </Typography>
  </Box>
</RadioGroup>

    </Box>


  {/* Card droite */}
  
  <div className={styles.cardRight } >
  <div className={styles.cardcontent}>
      {/* ✅ Search en haut si mobile */}
     {isMobileSearch && (
       <div className={styles.searchBarMobile} style={{marginTop :20}}>
         <input type="text" placeholder="Rechercher ..." />
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
  <input type="text" placeholder='Rechercher ...' />
  <i class="fa-solid fa-magnifying-glass"></i>
  </div>
   </div>

   <div className={styles.bas}>
 <Table columns={isMobile ? columnsMobile : columns}

 dataSource={data}
  pagination={{ pageSize: 5 }} 
   rowClassName={() => styles.largeRow}
            onHeaderRow={() => ({ className: styles.largeHeader })}   scroll={{ y: 400 }} 
     />

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
    </div>
  );
}

export default Norme;
