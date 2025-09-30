import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './header.module.css'; // module CSS pour le style
import Logo from '../assets/logo.png'
import Enhaut from '../assets/sary.jpg'
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from '@mui/material/IconButton';
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import DescriptionIcon from "@mui/icons-material/Description";
import BusinessIcon from "@mui/icons-material/Business";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Divider from "@mui/material/Divider";
import { useNavigate } from 'react-router-dom';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}


function stringAvatar(name = "") {
  const words = name.trim().split(" ");
  const first = words[0]?.[0] ?? "";
  const second = words[1]?.[0] ?? "";
  return {
    sx: { bgcolor: stringToColor(name) },
    children: `${first}${second}`.toUpperCase(),
  };
}

function Header({ user  , onLogout }) {
    const [open, setOpen] = React.useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
const [activeMenu, setActiveMenu] = useState("Liste des Normes");
  const navigate = useNavigate();
    const fullName = user?.name || "Utilisateur";
  const role = user?.role || "Visiteur";
  const location = useLocation();


  
useEffect(() => {
  if (location.pathname === "/norme") {
    setActiveMenu("Normes");
  } else if (location.pathname === "/list_norme") {
    setActiveMenu("Liste des Normes");
  } else if (location.pathname === "/secteur") {
    setActiveMenu("Secteur");
  }
}, [location.pathname]);
const [menuAnchorEl1, setMenuAnchorEl1] = useState(null);
   const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const menuItems = [
  { label: "Liste des Normes", roles: ["admin", "client"] },
  { label: "Normes", roles: ["admin"] },
  { label: "Secteur", roles: ["admin"] },
];

    const handleMenuClick = (item) => {
    setActiveMenu(item);

    if (item === "Normes") {
      navigate("/norme");
    } else if (item === "Liste des Normes") {
      navigate("/list_norme");
    } else if (item === "Secteur") {
      navigate("/secteur");
    }
  };

   const handleAvatarClick = (event) => {
    setMenuAnchorEl1(event.currentTarget); // ouvre le menu
  };

  const handleMenuClose = () => {
    setMenuAnchorEl1(null); // ferme le menu
  };

   const handleLogout = () => {
    // Supprime le token et l'utilisateur du localStorage
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");

    // Ferme le menu
    handleMenuClose();

    // Appelle la fonction de logout parent
    onLogout?.();
  };

  return (
    <>
   
   
    <header className={styles.header}>
      <div className={styles.images}>
   <img src={Logo} alt="" />
 
      </div>
  <div className={styles.menu}>
  <ul>
    {menuItems
      .filter(item => item.roles.includes(role)) // <-- filtrage par rôle
      .map((item) => (
        <li
          key={item.label}
          className={activeMenu === item.label ? styles.activeMenu : ""}
          onClick={() => handleMenuClick(item.label)}
        >
          {item.label}
        </li>
      ))}
  </ul>
</div>

   <div className={styles.comptes}  onClick={handleAvatarClick}> 
      <div className={styles.text}>
  <h3>{fullName}</h3>
  <label htmlFor="">{role}</label>
      </div>
     <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant="dot"
          >
            <Avatar
               {...stringAvatar(fullName)}
              sx={{
                width: 58,
                height: 59,
                backgroundColor: "#1B6979",
                color: "#fff",
                fontWeight: "bold",
              }}
            />
          </StyledBadge>  
            </div>
             <Menu
          anchorEl={menuAnchorEl1}
          open={Boolean(menuAnchorEl1)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{
            sx: {
              borderRadius: 3,
              mt: 1,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              minWidth: 120,
              px: 3, // horizontal padding
              py: 3, // vertical padding
            },
          }}
        >
          <div className={styles.button1}>
            <button onClick={handleLogout}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 11,
                  color: "white",
                  fontSize: 18,
                }}
              >
                <i className="fa-solid fa-right-from-bracket"></i>
                <span>Se deconnecter</span>
              </div>
            </button>
          </div>
        </Menu>
        {role === "admin" && (
  <div className={styles.burger}>
    <IconButton
      size="large"
      edge="start"
      color="inherit"
      onClick={toggleDrawer(true)}
    >
      <i className="fa-solid fa-bars-staggered"></i>
    </IconButton>
  </div>
)}

<Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
  <List sx={{ width: 280 }}>
    <ListItem 
      button 
      sx={{ py: 2, px: 3 }}
      onClick={() => { handleMenuClick("Liste des Normes"); setDrawerOpen(false); }}
    >
      <LibraryBooksIcon sx={{ marginRight: 2, color: "#44B700" }} />
      <ListItemText 
        primary="Liste des Normes" 
        primaryTypographyProps={{ 
          sx: { 
            textTransform: "uppercase", 
            fontWeight: "bold",
            fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif"
          } 
        }} 
      />
    </ListItem>

    <Divider />

    <ListItem 
      button 
      sx={{ py: 2, px: 3 }}
      onClick={() => { handleMenuClick("Normes"); setDrawerOpen(false); }}
    >
      <DescriptionIcon sx={{ marginRight: 2, color: "#4B1616" }} />
      <ListItemText 
        primary="Normes" 
        primaryTypographyProps={{ 
          sx: { 
            textTransform: "uppercase", 
            fontWeight: "bold",
            fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif"
          } 
        }} 
      />
    </ListItem>

    <Divider />

    <ListItem 
      button 
      sx={{ py: 2, px: 3 }}
      onClick={() => { handleMenuClick("Secteur"); setDrawerOpen(false); }}
    >
      <BusinessIcon sx={{ marginRight: 2, color: "#1B6979" }} />
      <ListItemText 
        primary="Secteur" 
        primaryTypographyProps={{ 
          sx: { 
            textTransform: "uppercase", 
            fontWeight: "bold",
            fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif"
          } 
        }} 
      />
    </ListItem>

    <Divider />

    <ListItem sx={{ py: 2, px: 3 }}>
      <AccountCircleIcon sx={{ marginRight: 2, color: "#222" }} />
         <ListItemText primary={`${fullName} (${role})`} primaryTypographyProps={{ sx: { textTransform: "uppercase", fontWeight: "bold", fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif" } }} />
  
    </ListItem>
  </List>
</Drawer>



    </header>
    </>
  );
}

export default Header;
