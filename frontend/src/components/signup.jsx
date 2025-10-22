import React, { useState } from 'react';
import styles from './sign.module.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';

import Logo from '../assets/logo.png'
import { Spin } from 'antd';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';


function SignUp({ onLogin }) {
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
  const [emailError, setEmailError] = useState(false);
  const [mdp2Error, setMdp2Error] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
const [email ,setEmail] =useState('')
const [mdp2 ,setMdp2]=useState('')

  const handleSubmit = (e) => {
    e.preventDefault();
    let hasError = false;
setLoading(true)
    if (!username) {
      setUsernameError(true);
      hasError = true;
 

    } else {
      setUsernameError(false);
  

    }

    if (!password) {
      setPasswordError(true);


      hasError = true;
    } else {
      setPasswordError(false);
  


    }
     if (!mdp2) {
    setMdp2Error(true);
    hasError = true;
 
  } else if (password !== mdp2) {
    setMdp2Error(true);
    setErrorMsg("Les mots de passe ne correspondent pas");
    hasError = true;
 
  } else {
    setMdp2Error(false);
  }

    if (!hasError) {

      setError(false);
         handleLogin(username, password); // ← ici on appelle l'API
   setLoading(false);
  
    } else {
      setError(true)
   setLoading(false);
      
    }
  };
const handleLogin = async (username, password) => {
  setLoading(true);
  setErrorMsg(false);
console.log(username , email , password)
  try {
    const response = await fetch("http://192.168.10.31:8000/clients/", { // <-- note le '/' final
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setErrorMsg(data.message || "Erreur lors de la création du compte");
      setLoading(false);
      return;
    }

    console.log("Client créé :", data);
    // Redirection vers login après création
    navigate("/login");

  } catch (err) {
    console.error("Erreur serveur:", err);
    setErrorMsg(err.message);
  } finally {
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
      <form onSubmit={handleSubmit} className={styles.form}>

      {errorMsg && (
  <Alert
    severity="error"
    sx={{ fontSize: 17, display: "flex" }}
    action={
      <IconButton
        aria-label="close"
        color="inherit"
        size="small"
        onClick={() => setErrorMsg(false)} // ← cache l'alerte
      >
        <CloseIcon fontSize="inherit" />
      </IconButton>
    }
  >
    {errorMsg}
  </Alert>
)}

        <h2>Création compte</h2>
 <TextField
  required
  label="Nom"
  variant="standard"
  fullWidth
  value={username}
  onChange={(e) => {
    setUsername(e.target.value);
    if (e.target.value) setUsernameError(false);
  }}
  error={error && !username}
  helperText={error && !username ? "Le nom est obligatoire" : ""}
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
        padding: "4px",         // padding réduit pour petits écrans
      },
    },
      "& .MuiInputAdornment-root .fa-eye, & .MuiInputAdornment-root .fa-eye-slash": {
      fontSize: "1.3rem", // taille normale
      "@media (max-width:600px)": {
        fontSize: "1.0rem", // taille réduite pour petits écrans
      },
    },
  }}
/>


 <TextField
  required
  label="Email"
  variant="standard"
  fullWidth
  value={email}
  onChange={(e) => {
    setEmail(e.target.value);
    if (e.target.value) setEmailError(false);
  }}
  error={error && !email}
  helperText={error && !email ? "L'email est obligatoire" : ""}
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
        padding: "4px",         // padding réduit pour petits écrans
      },
    },
      "& .MuiInputAdornment-root .fa-eye, & .MuiInputAdornment-root .fa-eye-slash": {
      fontSize: "1.3rem", // taille normale
      "@media (max-width:600px)": {
        fontSize: "1.0rem", // taille réduite pour petits écrans
      },
    },
  }}
/>

      <TextField
       required
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
        padding: "4px",         // padding réduit pour petits écrans
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
<TextField
  required
  label="Confirmer mot de passe"
  type={showPassword ? 'text' : 'password'}
  variant="standard"
  fullWidth
  value={mdp2}
  onChange={(e) => setMdp2(e.target.value)}
  error={error && (!mdp2 || mdp2 !== password)} 
  helperText={
    error && !mdp2
      ? "Le mot de passe est obligatoire"
      : error && mdp2 !== password
      ? "Les mots de passe ne correspondent pas"
      : ""
  }  
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
        padding: "4px",         // padding réduit pour petits écrans
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
        <IconButton onClick={handleToggleShow}>
          {showPassword ? (
            <i className="fa-solid fa-eye" style={{  color: "gray" }}></i>
          ) : (
            <i className="fa-solid fa-eye-slash" style={{  color: "gray" }}></i>
          )}
        </IconButton>
      </InputAdornment>
    ),
  }}
/>

  <Button variant="outlined" 
  fullWidth
    sx={{
         mt: 1,
        

          fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif",
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
      paddingY: 1, // réduire le padding vertical
      fontSize: "0.8rem", // optionnel, réduire un peu la taille du texte
    },
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
  
              onClick={handleSubmit} >
                  {loading ? <Spin size="large" style={{color :"white"}} /> : "S'inscrire"}

              </Button>

<hr className={styles.divider} />

<div className={styles.signup}>
  <span>Deja un compte ? </span>
  <a href="/login">S'authentifier</a>
</div>
      </form>
    </div>
  );
}

export default SignUp;
