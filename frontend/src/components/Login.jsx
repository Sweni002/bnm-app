import React, { useState } from 'react';
import styles from './login.module.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonIcon from '@mui/icons-material/Person';
import Alert from '@mui/material/Alert';
import Logo from '../assets/logo.png'
import { Spin } from 'antd';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import Lottie from "lottie-react";
import noResultAnimation from "../assets/book.json"; // ajuste le chemin


function Login({ onLogin }) {
    const navigate = useNavigate();

  const [username, setUsername] = useState('');
 const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
 const [hovered, setHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleToggleShow = () => setShowPassword(!showPassword);
   const [errorMsg, setErrorMsg] = useState(false);
 const [error, setError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  let hasError = false;
  setLoading(true);

  if (!username) {
    setUsernameError(true);
    hasError = true;
  } else setUsernameError(false);

  if (!password) {
    setPasswordError(true);
    hasError = true;
  } else setPasswordError(false);

  if (hasError) {
    setError(true);
    setLoading(false); // seulement si erreur de validation
    return;
  }

  setError(false);
  await handleLogin(username, password); // ← await pour attendre le loading
  // ne fait pas setLoading(false) ici, handleLogin s'en occupe
};

const handleLogin = async (username, password) => {
  setLoading(true);
  setErrorMsg(false);

  try {
    const response = await fetch("http://192.168.10.31:8000/auth/login_client", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json(); // Lire le body une seule fois

if (!response.ok) {
  setErrorMsg(data.message || "Nom d'utilisateur ou mot de passe incorrect");
  setLoading(false);
  return;
}

    // ✅ Login réussi
    localStorage.setItem("access_token", data.data.access_token);
  localStorage.setItem("user", JSON.stringify({ name: username, role: data.data.role }));
console.log(data)
onLogin?.({ role: data.data.role, name: username });


  


    setLoading(false);

    navigate("/list_norme");
  } catch (err) {
    console.error(err);
    setErrorMsg("Erreur serveur, veuillez réessayer.");
    setLoading(false);
  }
};




  return (
    <div className={styles.container}>
          <img 
          src={Logo}
    alt="Logo" 
    className={styles.logo} 
  />
      <div className={styles.form}>

      {errorMsg && (
  <Alert 
    severity="error" 
    onClose={() => setErrorMsg(false)}  // ← ici
    sx={{ fontSize: 17,  display: "flex" }}
  >
    {errorMsg}
  </Alert>
)}
<div className={styles.error}>
  <div className={styles.gauche}>
<div className={styles.entete}>
    <h2 style={{textAlign :"left"}}>Ha ,  te revoila !</h2>
        <h3>Heureux de te revoir </h3>
</div>
    
  <TextField

      onChange={(e) => {
    setUsername(e.target.value);
    if (e.target.value) setUsernameError(false); // supprime l'erreur dès que l'utilisateur tape
  }}
          error={error && !username}
          helperText={error && !username ? "Le nom est obligatoire" : ""}
      
        label="Nom"
        variant="standard"
        fullWidth
        
       sx={{
    mb: 2,
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif",
    },
    "& .MuiInputLabel-root": {
      fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif",
      fontSize: "1.2rem",       // taille normale
      padding: "6px 0",          // padding normal autour du label
      letterSpacing: "1px",
      "@media (max-width:430px)": {
        fontSize: "0.9rem",     // taille réduite sur petit écran
        padding: "3px 0",       // padding réduit
      },
    },
    "& .MuiFormLabel-asterisk": {
      color: "red",
    },
    "& .MuiInputBase-input": {  // cible le champ texte
      fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif",
      padding: "13px",           // padding par défaut
      fontSize: "1rem",
      "@media (max-width:600px)": {
        padding: "7px",         // padding réduit pour petits écrans
      },
    },
      "& .MuiInputAdornment-root .fa-eye, & .MuiInputAdornment-root .fa-eye-slash": {
      fontSize: "1.3rem", // taille normale
      "@media (max-width:600px)": {
        fontSize: "1.0rem", // taille réduite pour petits écrans
      },
    },
  }}
           InputProps={{
    endAdornment: (
      <InputAdornment position="end">
       <i class="fa-solid fa-user-check" style={{
        color :"gray" ,
        marginRight : 2
       }}></i>
      </InputAdornment>

    ),
  }}  
      />

      <TextField
        label="Mot de passe"
        type={showPassword ? 'text' : 'password'}
        variant="standard"
         error={error && !password}
          helperText={error && !password ? "Le mot de passe est obligatoire" : ""}
       
        fullWidth
    sx={{
    mb: 2,
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif",
    },
    "& .MuiInputLabel-root": {
      fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif",
      fontSize: "1.2rem",       // taille normale
      padding: "6px 0",          // padding normal autour du label
      letterSpacing: "1px",
      "@media (max-width:430px)": {
        fontSize: "0.9rem",     // taille réduite sur petit écran
        padding: "3px 0",       // padding réduit
      },
    },
    "& .MuiFormLabel-asterisk": {
      color: "red",
    },
    "& .MuiInputBase-input": {  // cible le champ texte
      fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif",
      padding: "13px",           // padding par défaut
      fontSize: "1rem",
      "@media (max-width:600px)": {
        padding: "7px",         // padding réduit pour petits écrans
      },
    },
      "& .MuiInputAdornment-root .fa-eye, & .MuiInputAdornment-root .fa-eye-slash": {
      fontSize: "1.3rem", // taille normale
      "@media (max-width:600px)": {
        fontSize: "1.0rem", // taille réduite pour petits écrans
      },
    },
  }}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleToggleShow} >
                {showPassword ? <i class="fa-solid fa-eye" style={{
       color :"gray"
       }}></i> :<i class="fa-solid fa-eye-slash" style={{
     color :"gray"
       }}></i>}
              </IconButton>
            </InputAdornment>
          ),
      
        }}
  
      />


  <Button variant="outlined" 
  fullWidth
    sx={{
         mt: 1,
        
  fontFamily: "Roboto, 'Helvetica Neue', Arial, sans-serif",
        width: "100%",
          backgroundColor: loading ? "white" : "rgb(51, 94, 143)", // ← changement ici
    color: loading ? "rgb(51, 94, 143)" : "white",           // texte visible sur fond blanc
 
        fontWeight: "bold",
        fontSize: 18,
        paddingY: 1.5,
        borderRadius: "8px",
        border: "none",
        textTransform: "none",
        boxShadow: hovered
          ? "0 4px 20px rgba(51, 94, 143, 0.6)" // shadow quand survol
          : "0 2px 5px rgba(0,0,0,0.2)", // shadow normal
        transform: hovered ? "scale(1.05)" : "scale(1)", // léger zoom au hover
        transition: "all 0.3s ease",
           "@media (max-width:500px)": {
               paddingY: 1.2, // réduire le padding vertical
     fontSize : "0.9rem" 
      }
    }
  }
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
  
              onClick={handleSubmit} >
                  {loading ? <Spin size="large" style={{color :"white"}} /> : "Se connecter"}

              </Button>
              
              <div className={styles.oublier}>
                <span>Pas de compte ?</span>
                <a href="/signup">S'inscrire</a>
              </div>

</div>

<div className={styles.droite}>

    <Lottie 
    animationData={noResultAnimation} 
    loop={true} 
    style={{ width: 330, height: 280 }}
  />
  <div className={styles.espace}>
    <label htmlFor="">Espace Client</label>
  <span>Entrez vos identifiants pour continuer</span>
  </div>
</div>


</div>

      </div>
    </div>
  );
}

export default Login;
