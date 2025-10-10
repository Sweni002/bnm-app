import React, { useEffect, useRef, useState } from 'react';
import { Breadcrumb, Card } from 'antd';
import styles from './modifier.module.css';
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

const Modifier = () => {
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

const [nomNorme, setNomNorme] = useState("");
const [codification, setCodification] = useState("");
useEffect(() => {
  if (record) {
    setNomNorme(record.nom || "");
    setCodification(record.codification || "");
    setNbPage(record.nbrepage || "");

    // --- gérer le fichier PDF existant ---
    if (record.fichier_pdf) {
      setSelectedFile({
        name: record.fichier_pdf.split("/").pop(), // récupère le nom du fichier
        url: record.fichier_pdf,                   // garde l'URL pour le téléchargement/preview
      });
    } else {
      setSelectedFile(null);
    }

    setSelectedSecteur({
      id: record.idsecteur,
      nom: record.nomsecteur
    });

   if (record.dateEdition) {
      // "Mai 2018" => new Date(2018, 4, 1)
      const [moisStr, anneeStr] = record.dateEdition.split(" ");
      const moisMap = {
        "janvier": 0,
        "février": 1,
        "mars": 2,
        "avril": 3,
        "mai": 4,
        "juin": 5,
        "juillet": 6,
        "août": 7,
        "septembre": 8,
        "octobre": 9,
        "novembre": 10,
        "décembre": 11
      };
      const mois = moisMap[moisStr.toLowerCase()] ?? 0;
      const annee = parseInt(anneeStr, 10) || 2025;
      setSelectedDate(new Date(annee, mois, 1));
    }
  }
}, [record]);

useEffect(() => {
  const fetchSecteurs = async () => {
    try {
      setLoading(true);
      const data = await authFetch("/secteurs", {}, navigate);

      if (data?.success && data.data) {
        setSecteurs(data.data); // API renvoie { success: true, data: [...] }
      } else {
        setErrorMsg("Erreur lors de la récupération des secteurs.");
      }
    } catch (err) {
      console.error("Erreur API:", err);
      setErrorMsg("Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  };

  fetchSecteurs();
}, [navigate]);


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
        navigate("/norme"); // navigation seulement ici
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
  setErrors({ nom: "", codification: "", secteur: "", date: "", fichier: "", nbpage: "" });

  let hasError = false;

  if (!nomNorme) {
    setErrors(prev => ({ ...prev, nom: "Le nom de la norme est requis." }));
    hasError = true;
  }
  if (!nbPage || nbPage <= 0) {
    setErrors(prev => ({ ...prev, nbpage: "Le nombre de pages est requis." }));
    hasError = true;
  }
  if (!codification) {
    setErrors(prev => ({ ...prev, codification: "La codification est requise." }));
    hasError = true;
  }
  if (!selectedSecteur) {
    setErrors(prev => ({ ...prev, secteur: "Le secteur est requis." }));
    hasError = true;
  }
  if (!selectedDate) {
    setErrors(prev => ({ ...prev, date: "La date est requise." }));
    hasError = true;
  }
  if (!selectedFile) {
    setErrors(prev => ({ ...prev, fichier: "Le fichier PDF est requis." }));
    hasError = true;
  }

  if (hasError) return;

  setLoadingBtn(true);


  try {
    const formData = new FormData();
    formData.append("codification", codification);
    formData.append("nom", nomNorme);
    formData.append("nbrepage", nbPage);

    const mois = selectedDate.toLocaleString('fr-FR', { month: 'long' });
    const annee = selectedDate.getFullYear();
    const dateEditionText = `${mois.charAt(0).toUpperCase() + mois.slice(1)} ${annee}`;
    formData.append("date_creation", dateEditionText);

    formData.append("secteur_id", selectedSecteur.id);

    if (selectedFile && selectedFile instanceof File) {
      formData.append("fichier_pdf", selectedFile);
    }

    if (!record.key) {
      setFormErrorMsg("ID de la norme manquant pour la mise à jour.");
      return;
    }

    const data = await authFetch(`/normes/${record.key}`, {
      method: "PUT",
      body: formData,
    }, navigate);

    if (!data) return;
   console.log(data)
    if (data.success === false) {
    // ❌ si erreur, on affiche le message mais ne reset pas le formulaire ni ne redirige
    setFormErrorMsg(data.message || "Erreur lors de la mise à jour de la norme");
    setOpenSnack(true);
  } else {
      // succès : afficher message, rediriger et reset si nécessaire
   setNomNorme("");
    setCodification("");
    setSelectedSecteur(null);
    setSelectedDate(null);
    setNbPage(null);
    setSelectedFile(null);

sessionStorage.setItem('snackMessage',data.message);
sessionStorage.setItem('snackError', 'false');
      // redirection après un petit délai pour voir le snackbar
          
        navigate("/norme");
   
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
        <Breadcrumb.Item>Norme</Breadcrumb.Item>
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
value={codification}
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
      error={!!errors.secteur}
  helperText={errors.secteur || ""}

      value={selectedSecteur ? selectedSecteur.nom : ""}
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
        {errors.secteur ? (
          <i className="fa-solid fa-circle-exclamation" style={{ color: "red", fontSize: "1.1rem" }}></i>
        ) : (
          <IconButton size='small'>
            <i
              className={`fa-solid fa-chevron-down ${openDialogSecteur ? styles.chevronIconOpen : ''}`}
            ></i>
          </IconButton>
        )}
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
          key={p.id}
          className={styles.liste1}
          onClick={(e) => handleSecteur(p, e)}
        >
          <div className={styles.liste2}>
            <h4>{p.nom}</h4>
          </div>
          <i className="fa-solid fa-magnifying-glass-minus"></i>
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
<div className={styles.secteurs}  onClick={handleFileClick}>
       <TextField
      value={selectedFile ? selectedFile.name : ''}
         error={!!errors.fichier}
  helperText={errors.fichier || ""}

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
        {loadingFile ? (
          <Spin size="default" />
        ) : errors.fichier ? (
          <i className="fa-solid fa-circle-exclamation" style={{ color: "red", fontSize: "1.1rem" }}></i>
        ) : (
          <IconButton size='small'>
            <i className="fa-solid fa-file-export"></i>
          </IconButton>
        )}
      </InputAdornment>    ),
      
        }}
     
      /> 
         <input
      type="file"
      accept=".pdf"
      ref={fileInputRef}
      onChange={handleFileChange}
      style={{ display: 'none' }}
    />     
</div>

         
   
                </div> 
                
                 <div className={styles.norme}>
                    <label htmlFor="">Nb de page</label>
<div className={styles.secteurs}>
<TextField
  type="number"
  value={nbPage ?? ""}
  placeholder="Entrez le nombre de pages"
  onChange={(e) => {
    const value = e.target.value;
    // n’accepte que les chiffres vides ou positifs
    if (/^\d*$/.test(value)) {
      setNbPage(value === "" ? null : parseInt(value, 10));
      if (errors.nbpage) setErrors((prev) => ({ ...prev, nbpage: "" }));
    }
  }}
  onKeyDown={(e) => {
    // autorise uniquement les chiffres, backspace, delete, flèches
    if (
      !/[0-9]/.test(e.key) &&
      e.key !== "Backspace" &&
      e.key !== "Delete" &&
        e.key !== "ArrowUp" &&      // ✅ autorise flèche haut
      e.key !== "ArrowDown" &&    // ✅ autorise flèche bas
      e.key !== "ArrowLeft" &&
      e.key !== "ArrowRight" &&
      e.key !== "Tab"
    ) {
      e.preventDefault();
    }
  }}
  onPaste={(e) => {
    // empêche coller autre chose que des chiffres
    const paste = e.clipboardData.getData("text");
    if (!/^\d+$/.test(paste)) e.preventDefault();
  }}
  error={!!errors.nbpage}
  helperText={errors.nbpage || ""}
  variant="standard"
  fullWidth
  sx={{
    mb: 2,
    "& .MuiInputBase-input": {
      padding: "5px 1px",
      fontSize: "1rem",
      fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif",
      "@media (max-width:600px)": {
        padding: "5px 0px !important",
      },
    },
  }}
  InputProps={{
    inputProps: { min: 1 },
    endAdornment: errors.nbpage && (
      <InputAdornment position="end">
        <i
          className="fa-solid fa-circle-exclamation"
          style={{ color: "red", fontSize: "1.1rem" }}
        ></i>
      </InputAdornment>
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
         error={!!errors.date}
        helperText={errors.date || ""}
  
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
   if (errors.date) setErrors(prev => ({ ...prev, date: "" }));

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

export default Modifier;
