import React, { useEffect, useRef, useState } from 'react';
import { Breadcrumb, Card } from 'antd';
import styles from './modsec.module.css';
import illustration from '../../assets/2.jpg'; // ton image PNG
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { useLocation, useNavigate } from 'react-router-dom';
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
import { fetchWithAuth } from '../utils/api';
import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';
import SnackbarContent from '@mui/material/SnackbarContent';
 import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { authFetch } from '../utils/authFetch';

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

const AjoutSecteur = () => {
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
 const [formErrorMsg, setFormErrorMsg] = useState("");

  const [selectedSecteur, setSelectedSecteur] = useState(null);
  const [openSnack, setOpenSnack] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);

const secteursRef = useRef(null);
const [secteurs, setSecteurs] = useState([]);
const [loading, setLoading] = useState(false);
const [errorMsg, setErrorMsg] = useState("");
const [nbPage, setNbPage] = useState(null);

const { state } = useLocation();
  const record = state?.record;
const [openDialogSecteur, setOpenDialogSecteur] = useState(false);
const handleOpenDialog = () => setOpenDialogSecteur(true);
const handleCloseDialog = () => {
  setOpenDialogSecteur(false);
  setSearchSecteur('');
};
const [errors, setErrors] = useState({
  nom: "",
  codification: "",
  secteur: "",
  date: "",
  fichier: "",
  nbpage: "",
});

const [selectedFile, setSelectedFile] = useState(null);
const fileInputRef = useRef(null);

const handleFileClick = () => {
  fileInputRef.current.click(); // ouvre l’explorateur de fichiers
};

useEffect(() => {
  if (record) {
    setnomSec(record.nom|| "");
   
   

    
  
  }
}, [record]);


const [loadingFile, setLoadingFile] = useState(false);
const handleFileChange = (e) => {
  if (e.target.files.length > 0) {
    setLoadingFile(true);
    const file = e.target.files[0];

    setTimeout(() => {
      setSelectedFile(file);
      setLoadingFile(false);
      setErrors(prev => ({ ...prev, fichier: "" })); // <-- supprime l'erreur dès qu'un fichier est choisi
    }, 1000);
  }
};

const [nomSec, setnomSec] = useState("");
const [codification, setCodification] = useState("");



 const handleCloseSnack = (event, reason) => {
  if (reason === 'clickaway') {
    // Si on clique hors du snackbar, on ferme juste le snackbar, pas de navigation
    setOpenSnack(false);
    return;
  }
  // Si on ferme le snackbar avec le bouton "close" (croix), on ferme juste le snackbar
  setOpenSnack(false);
};
const action = (
  <>
    <Button color="primary" size="medium" onClick={() => {
        setOpenSnack(false);
        navigate("/secteur"); // navigation seulement ici
      }}
      sx={{p : 1 ,fontSize : 17}}>
       Voir
    </Button>
    <IconButton
  size="small"
  aria-label="close"
  color="inherit"
  onClick={handleCloseSnack}
  sx={{
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.1)', // couleur au survol (exemple gris clair)
      color: '#f44336', // changer la couleur de l'icône au hover (ex: rouge)
    },
    transition: 'background-color 0.3s, color 0.3s',
  }}
>
  <CloseIcon fontSize="medium" />
</IconButton>

  </>
);

const handleSubmit = async (e) => {
  e.preventDefault();

  // reset erreurs
  setErrors({ nom: ""});

  let hasError = false;

  if (!nomSec) {
    setErrors(prev => ({ ...prev, nom: "Le nom du secteur est requis." }));
    hasError = true;
  }


  if (hasError) return;

  setLoadingBtn(true);

  try {
 
const data = await authFetch(`/secteurs/${record.key}`, {
  method: "PUT",
   body: JSON.stringify({ nom: nomSec.trim() }),

}, navigate);


    if (!data) return; // authFetch a déjà géré la redirection si 401
console.log(data)
    if (data.success ==false) {
      setFormErrorMsg(data.message || "Erreur lors de l'ajout du secteur.");
        setOpenSnack(true);

    } else {
      console.log(data.message)

      setFormErrorMsg(data.message); // message du backend
      setOpenSnack(true);

  
      setnomSec("");
 
sessionStorage.setItem('snackMessage',data.message);
sessionStorage.setItem('snackError', 'false');
      // redirection après un petit délai pour voir le snackbar
          
        navigate("/secteur");
    }
  } catch (err) {
    console.error(err);
    setFormErrorMsg("Erreur serveur, réessayez plus tard.");
  } finally {
    setLoadingBtn(false);
  }
};


const handleSecteur = (secteur, e) => {
  e.stopPropagation(); // stop la propagation du clic
   setSelectedSecteur(secteur); // stocke l’objet complet
  setErrors(prev => ({ ...prev, secteur: "" })); // <-- supprime l'erreur
  setOpenDialogSecteur(false); // <-- fermer le dialog
  setSearchSecteur('');         // reset la recherche
};


  return (
    <div className={styles.container}>
      <Breadcrumb className={styles.breadcrumb}>
        <Breadcrumb.Item>Secteur</Breadcrumb.Item>
        <Breadcrumb.Item>Modifier</Breadcrumb.Item>
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
                    <label htmlFor="">Nom du secteur</label>
 <TextField
         value={nomSec}
    onChange={(e) => {
    setnomSec(e.target.value);
    if (errors.nom) setErrors(prev => ({ ...prev, nom: "" })); // supprime l'erreur
  }}  error={!!errors.nom}
  helperText={errors.nom || ""} 
     
      placeholder='Entrez le nom'
        variant="standard"
        fullWidth
        
       sx={{
    mb: 2,
    "& .MuiInputBase-input": {
      padding: "11px 1px",   // ✅ padding interne uniforme
      fontSize: "1rem",
      fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif",
        "@media (max-width:600px)": {
        padding: "8px 0px !important",   // mobile → réduit
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
  <Snackbar
  open={openSnack}
  autoHideDuration={5000}
  onClose={handleCloseSnack}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
>
  <SnackbarContent
    sx={{

      p: 1,
      px : 3,
      fontSize: '17px',
      boxShadow: '0px 4px 12px rgba(0,0,0,0.15)',
      display: 'flex',
      justifyContent: 'space-between',  // espace entre message et action
      alignItems: 'center',
      gap: 3, // espace entre éléments flex (message/action)
    }}
    message={<span style={{ marginRight: 8 }}>{formErrorMsg}</span>}
    action={action}
  />
</Snackbar>

    </div>
  );
};

export default AjoutSecteur;
