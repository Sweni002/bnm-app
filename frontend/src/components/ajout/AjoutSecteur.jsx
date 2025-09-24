import React, { useRef, useState } from 'react';
import { Breadcrumb, Card } from 'antd';
import styles from './ajoutnorme.module.css';
import illustration from '../../assets/2.jpg'; // ton image PNG
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from 'react-router-dom';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Popover from '@mui/material/Popover';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import 'dayjs/locale/fr'; // important
import frLocale from 'date-fns/locale/fr';
import dayjs from 'dayjs';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { styled } from "@mui/material/styles";
import { Spin } from 'antd';


dayjs.locale('fr');

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    backgroundColor: "white",
    borderRadius: "30px",
    padding: theme.spacing(4),
    width: "100%",
    maxWidth: "500px",
  },
}));

const AjoutNorme = () => {
      const navigate = useNavigate();
        const [menuAnchor, setMenuAnchor] = useState(null);
   
  const [open1, setOpen] = useState(false);
       const open = Boolean(menuAnchor);
        const [selectedDate, setSelectedDate] = useState(null);
const dateInputRef = useRef(null);
const [moisAll, setMoisAll] = useState(new Date().getMonth() + 1);
const [anneeAll, setAnneeAll] = useState(2025);
       // -----------------------
        const anchorRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchSecteur, setSearchSecteur] = useState("");
  const [secteurs] = useState([
    { idpers: 1, nom: "Agroalimentaire" },
    { idpers: 2, nom: "Bâtiment" },
    { idpers: 3, nom: "Énergie" },
  ]);
  const [selectedSecteur, setSelectedSecteur] = useState(null);
  const [loading] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [errorMsg] = useState("");
const secteursRef = useRef(null);
const [openDialogSecteur, setOpenDialogSecteur] = useState(false);
const handleOpenDialog = () => setOpenDialogSecteur(true);
const handleCloseDialog = () => {
  setOpenDialogSecteur(false);
  setSearchSecteur('');
};

const [errors, setErrors] = useState({
  nom: "",
  codification: "",
});
const [nomNorme, setNomNorme] = useState("");
const [codification, setCodification] = useState("");


const handleSubmit = (e) => {
  e.preventDefault();

  // reset erreurs
  setErrors({ nom: "", codification: "" });

  // valider les champs
  let hasError = false;
  if (!nomNorme) {  // tu dois avoir un state pour le nom
    setErrors(prev => ({ ...prev, nom: "Le nom de la norme est requis." }));
    hasError = true;
  }
  if (!codification) { // idem pour codification
    setErrors(prev => ({ ...prev, codification: "La codification est requise." }));
    hasError = true;
  }

  if (hasError) return; // stoppe l'envoi si erreur

  setLoadingBtn(true);

  // simuler une API
  setTimeout(() => {
    console.log("Formulaire sauvegardé !");
    setLoadingBtn(false);
  }, 2000);
};


const handleSecteur = (secteur, e) => {
  e.stopPropagation(); // stop la propagation du clic
  setSelectedSecteur(secteur.nom);
  setOpenDialogSecteur(false); // <-- fermer le dialog
  setSearchSecteur('');         // reset la recherche
};

  return (
    <div className={styles.container}>
      <Breadcrumb className={styles.breadcrumb}>
        <Breadcrumb.Item>Norme</Breadcrumb.Item>
        <Breadcrumb.Item>Ajout</Breadcrumb.Item>
      </Breadcrumb>

      <Card className={styles.card}>
        <div className={styles.cardContent}>
          {/* Colonne gauche : image */}
          <div className={styles.imageContainer}>
                 <img src={illustration} alt="Illustration" />
          </div>
      <Tooltip title="Retour">
              <IconButton 
                className={styles.backBtn} 
                onClick={() => navigate(-1)}
                size="medium"
              >
                <i className="fa-solid fa-arrow-left"></i>
              </IconButton>
            </Tooltip>
   
          {/* Colonne droite : formulaire */}
          <div className={styles.formContainer}>
               <form className={styles.form}>
                <div className={styles.norme}>
                    <label htmlFor="">Nom de la norme</label>
 <TextField
         value={nomNorme}
    onChange={(e) => {
    setNomNorme(e.target.value);
    if (errors.nom) setErrors(prev => ({ ...prev, nom: "" })); // supprime l'erreur
  }}  error={!!errors.nom}
  helperText={errors.nom || ""} 
     
      placeholder='Entrez le nom'
        variant="standard"
        fullWidth
        
       sx={{
    mb: 2,
    "& .MuiInputBase-input": {
      padding: "5px 1px",   // ✅ padding interne uniforme
      fontSize: "1rem",
      fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif",
        "@media (max-width:600px)": {
        padding: "5px 0px !important",   // mobile → réduit
       // texte plus petit
      },
    },
    "& .MuiInputLabel-root": {
      fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif",
    },
  }}
    InputProps={{
    endAdornment: errors.nom ? (
      <InputAdornment position="end">
        <i className="fa-solid fa-circle-exclamation" style={{ color: "red"  ,fontSize :"1.1rem "}}></i>
      </InputAdornment>
    ) : null,
  }}
  InputLabelProps={{
    style: {
      fontSize: "1.1rem",
      letterSpacing: "1px",
    },
  }}
      />
           
                </div>
                  <div className={styles.norme}>
                    <label htmlFor="">Codification</label>
<TextField
  onChange={(e) => {
    setCodification(e.target.value);
    if (errors.codification) setErrors(prev => ({ ...prev, codification: "" })); // supprime l'erreur
  }}  error={!!errors.codification}
  helperText={errors.codification || ""} 
     
   
  placeholder="Entrez le codification"
  variant="standard"
  fullWidth
  sx={{
    mb: 2,
    "& .MuiInputBase-input": {
      padding: "5px 1px",   // ✅ padding interne uniforme
      fontSize: "1rem",
      fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif",
         "@media (max-width:600px)": {
        padding: "5px 0px !important",   // mobile → réduit
       // texte plus petit
      },
    },
    "& .MuiInputLabel-root": {
      fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif",
    },
  }}
     InputProps={{
    endAdornment: errors.codification ? (
      <InputAdornment position="end">
        <i className="fa-solid fa-circle-exclamation" style={{ color: "red"  ,fontSize :"1.1rem "}}></i>
      </InputAdornment>
    ) : null,
  }}
  InputLabelProps={{
    style: {
      fontSize: "1.1rem",
      letterSpacing: "1px",
    },
  }}
/>

           
                </div>
              <div className={styles.norme}>
                    <label htmlFor="">Secteur</label>
                    
<div className={styles.secteurs} ref={secteursRef}  onClick={handleOpenDialog}>
     <TextField
     
       value={selectedSecteur}      
      placeholder='Cliquez ici'
        variant="standard"
        fullWidth
        
         sx={{
    mb: 2,
    "& .MuiInputBase-input": {
      padding: "5px 1px",   // ✅ padding interne uniforme
      fontSize: "1rem",
      fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif",
         "@media (max-width:600px)": {
        padding: "5px 0px !important",   // mobile → réduit
       // texte plus petit
      },
    },
    "& .MuiInputLabel-root": {
      fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif",
    },
  }}

  InputLabelProps={{
    style: {
      fontSize: "1.1rem",
      letterSpacing: "1px",
    },
  }}
   InputProps={{
    readOnly:true ,
          endAdornment: (
            <InputAdornment position="end">
             
           <IconButton size='small'>
    <i
    className={`fa-solid fa-chevron-down ${styles.chevronIcon} ${openDialogSecteur ? styles.chevronIconOpen : ''}`}
  ></i>
        
                    </IconButton>

        </InputAdornment>
          ),
      
        }}
  
      />   
</div>
           <BootstrapDialog
  open={openDialogSecteur}
  onClose={handleCloseDialog}
>
  <div className={styles.dialog}>
    <input
      type="text"
      placeholder="Recherher une secteur"
      value={searchSecteur}
      onChange={(e) => setSearchSecteur(e.target.value)}
    />
    <i className="fa-solid fa-magnifying-glass"></i>
  </div>

  <div style={{ minHeight: 300, maxHeight: 400, overflowY: 'auto', padding: 18, marginTop: 10 }}>
    {loading ? (
      <p>Chargement...</p>
    ) : errorMsg ? (
      <p style={{ color: "red" }}>{errorMsg}</p>
    ) : (
      <div className={styles.liste}>
     {secteurs
  .filter((p) =>
    `${p.nom}`.toLowerCase().includes(searchSecteur.toLowerCase())
  )
  .map((p) => (
    <div
      key={p.idpers}
      className={styles.liste1}
      onClick={(e) => handleSecteur(p, e)}
      style={{ cursor: "pointer" }}
    >
      <div className={styles.liste2}>
        <h4>{p.nom}</h4>
      </div>
  <i class="fa-solid fa-magnifying-glass-minus"></i>
    </div>
))}

        {secteurs.length === 0 && <p>Aucun secteur trouvé.</p>}
      </div>
    )}
  </div>
</BootstrapDialog>

   
                </div> 

<div className={styles.autres}>
 <div className={styles.norme}>
                    <label htmlFor="">Fichier .pdf</label>
<div className={styles.secteurs}>
       <TextField
             
      placeholder='Choisir le fichier'
        variant="standard"
        fullWidth
        
         sx={{
    mb: 2,
    "& .MuiInputBase-input": {
      padding: "5px 1px",   // ✅ padding interne uniforme
      fontSize: "1rem",
      fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif",
         "@media (max-width:600px)": {
        padding: "5px 0px !important",   // mobile → réduit
       // texte plus petit
      },
    },
    "& .MuiInputLabel-root": {
      fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif",
    },
  }}
  InputLabelProps={{
    style: {
      fontSize: "1.1rem",
      letterSpacing: "1px",
    },
  }}
   InputProps={{
    readOnly :true ,
          endAdornment: (
            <InputAdornment position="end">
        <IconButton size='small'>
<i class="fa-solid fa-file-export"></i>
        
                    </IconButton>
                         </InputAdornment>
          ),
      
        }}
     
      /> 
           
</div>

         
   
                </div> 
                
                 <div className={styles.norme}>
                    <label htmlFor="">Nb de page</label>
<div className={styles.secteurs}>
      <TextField
             
      placeholder=''
        variant="standard"
        fullWidth
        
            sx={{
    mb: 2,
    "& .MuiInputBase-input": {
      padding: "5px 1px",   // ✅ padding interne uniforme
      fontSize: "1rem",
      fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif",
         "@media (max-width:600px)": {
        padding: "5px 0px !important",   // mobile → réduit
       // texte plus petit
      },
    },
    "& .MuiInputLabel-root": {
      fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif",
    },
  }}
  InputLabelProps={{
    style: {
      fontSize: "1.1rem",
      letterSpacing: "1px",
    },
  }}
   InputProps={{
    readOnly : true ,
          endAdornment: (
            <InputAdornment position="end">
       <IconButton size='small'>
<i class="fa-regular fa-file"></i>
                    </IconButton>      </InputAdornment>
          ),
      
        }}
    
      /> 
           
</div>

         
   
                </div> 
</div>


  <div className={styles.norme}>
                    <label htmlFor="">Date d'edition</label>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={frLocale}>
  <div
    className={styles.secteurs}
    ref={anchorRef}
    onClick={() => setOpen(true)}
  >
        <TextField
          value={selectedDate
    ? dayjs(selectedDate).format('MMMM YYYY')
    : ''}   
      placeholder='Choisir une date'
        variant="standard"
        fullWidth
        
         sx={{
    mb: 2,
    "& .MuiInputBase-input": {
      padding: "5px 1px",   // ✅ padding interne uniforme
      fontSize: "1rem",
      fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif",
         "@media (max-width:600px)": {
        padding: "5px 0px !important",   // mobile → réduit
       // texte plus petit
      },
    },
    "& .MuiInputLabel-root": {
      fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif",
    },
  }}
  InputLabelProps={{
    style: {
      fontSize: "1.1rem",
      letterSpacing: "1px",
    },
  }}
   InputProps={{
    readOnly :true ,
          endAdornment: (
            <InputAdornment position="end">
 <IconButton size='small'>
      <i className="fa-regular fa-calendar"></i>
    </IconButton>
                         </InputAdornment>
          ),
      
        }}
  /> 


   
  </div>

<DatePicker
  open={open1}
  onClose={() => setOpen(false)}
  views={['year', 'month']}
  minDate={new Date('2000-01-01')}
  maxDate={new Date('2030-12-31')}
  value={selectedDate ? new Date(selectedDate) : null}
 onChange={(newValue) => {
  if (!newValue) return;

  const year = newValue.getFullYear();
  const month = newValue.getMonth();

  const newDate = new Date(year, month, 1);
  setSelectedDate(newDate);
  setAnneeAll(year);
  setMoisAll(month + 1);

  console.log(newDate);

  // <-- ne pas fermer le picker ici
  // setOpen(false);
}}

  slots={{ field: () => null }}
  slotProps={{
    popper: {
      anchorEl: () => anchorRef.current,
      placement: 'bottom-start',
    },
  }}
/>

</LocalizationProvider>

   
                </div> 
               
   <Button
  
  fullWidth
  onClick={handleSubmit}
  startIcon={
    loadingBtn ? <Spin size="large" /> : <i className="fa-solid fa-plus"></i>
  }  sx={{
    marginTop: 3,
    fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif",
    fontSize: "1.1rem",
    backgroundColor: loadingBtn ? "#fff" : "#14535f",  // <-- blanc si loading
    color: loadingBtn ? "#14535f" : "#fff",            // <-- texte sombre si loading
   gap: 1,
    fontWeight: "bold",
    textTransform: "none",
    py: 1.6,
    "&:hover": {
     backgroundColor: loadingBtn ? "#f5f5f5" : "#1B6979",
    },
    "@media (max-width:600px)": {
      py: 1,               // padding vertical réduit
      fontSize: "0.9rem",  // texte plus petit
      "& .MuiButton-startIcon": {
        fontSize: "1.1rem", // icône plus petite
        "& i": {
          fontSize: "1.1rem" // applique vraiment au <i>
        }
      },
    },
  }}
>
   {loadingBtn ? "Chargement..." : "Sauvegarder"}
</Button>

         </form>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AjoutNorme;
