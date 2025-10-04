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

  const handleSubmit = (e) => {
    e.preventDefault();
    let hasError = false;
setLoading(true)
    if (!username) {
      setUsernameError(true);
      hasError = true;
   setLoading(false);

    } else {
      setUsernameError(false);
   setLoading(false);

    }

    if (!password) {
      setPasswordError(true);
   setLoading(false);

      hasError = true;
    } else {
      setPasswordError(false);
   setLoading(false);

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

  try {
    const response = await fetch(" http://127.0.0.1:8000/auth/login", {
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


  navigate("/list_norme");


    setLoading(false);

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
      <form onSubmit={handleSubmit} className={styles.form}>

      {errorMsg && (
  <Alert 
    severity="error" 
    sx={{ fontSize: 17,  display: "flex" }}
  >
    {errorMsg}
  </Alert>
)}

        <h2>Connexion</h2>
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
        
        sx={{ mb: 2  ,
            "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      pl: 2,
      pt: 1,
      pb: 1,
      fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif", // <-- font ici
    },
    "& .MuiInputLabel-root": {
      fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif", // si tu as un label
    },
    "& .MuiOutlinedInput-input": {
      fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif", // pour le texte saisi
    },
        }}

           InputProps={{
    endAdornment: (
      <InputAdornment position="end">
       <i class="fa-solid fa-user-check" style={{
        fontSize : 20  ,color :"gray" ,
        marginRight : 2
       }}></i>
      </InputAdornment>

    ),
  }}   inputProps={{
    style: {
      padding: '3px', 
      fontSize : 20 // padding intérieur autour du texte
    },
  }}
         InputLabelProps={{
    style: {
      fontSize: '1.1rem',
          letterSpacing: '1px', // ← ici pour espacement des lettres

    
      
    },
  }}
      />

      <TextField
        label="Mot de passe"
        type={showPassword ? 'text' : 'password'}
        variant="standard"
         error={error && !password}
          helperText={error && !password ? "Le mot de passe est obligatoire" : ""}
       
        fullWidth
    sx={ { mb: 2 ,
        "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      pl: 2,
      pt: 1,
      pb: 1,
      fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif", // <-- font ici
    },
    "& .MuiInputLabel-root": {
      fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif", // si tu as un label
    },
    "& .MuiOutlinedInput-input": {
      fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif", // pour le texte saisi
    },
    }}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleToggleShow} >
                {showPassword ? <i class="fa-solid fa-eye-slash" style={{
        fontSize : 20  ,color :"gray"
       }}></i> :<i class="fa-solid fa-eye" style={{
        fontSize : 20  ,color :"gray"
       }}></i>}
              </IconButton>
            </InputAdornment>
          ),
      
        }}
      inputProps={{
    style: {
      padding: '4px', 
      fontSize : 20 // padding intérieur autour du texte
    },
  }}
         InputLabelProps={{
    style: {
      fontSize: '1.2rem',
          letterSpacing: '1px', // ← ici pour espacement des lettres

    
      
    },
  }}
  
      />

<div className={styles.password}>
    <label htmlFor="">Mot de passe oublié ?</label>
</div>
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
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
  
              onClick={handleSubmit} >
                  {loading ? <Spin size="large" style={{color :"white"}} /> : "Se connecter"}

              </Button>

<hr className={styles.divider} />

<div className={styles.signup}>
  <span>Pas de compte ? </span>
  <a href="/register">S'inscrire</a>
</div>
      </form>
    </div>
  );
}

export default Login;
