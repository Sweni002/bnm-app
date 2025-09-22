import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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

function Header({ user }) {
    const [open, setOpen] = React.useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
const [activeMenu, setActiveMenu] = useState("Liste des Normes");
  const navigate = useNavigate();
    const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

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
  return (
    <>
   
   
    <header className={styles.header}>
      <div className={styles.images}>
   <img src={Logo} alt="" />
 
      </div>
      <div className={styles.menu}>
   <ul>
  {["Liste des Normes", "Normes", "Secteur"].map((item) => (
    <li
      key={item}
      className={activeMenu === item ? styles.activeMenu : ""}
        onClick={() => handleMenuClick(item)}
    >
      {item}
    </li>
  ))}
</ul>

     </div>

   <div className={styles.comptes}> 
      <div className={styles.text}>
  <h3>Nisedralaza</h3>
  <label htmlFor="">Admin</label>
      </div>
     <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant="dot"
          >
            <Avatar
              {...stringAvatar( "Seni")}
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
             <div className={styles.burger}>
      <IconButton size='large' edge="start" color='inherit' onClick={toggleDrawer(true)}>
 <i class="fa-solid fa-bars-staggered"  ></i>

      </IconButton>
             </div>
<Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
  <List sx={{ width: 280 }}>
    <ListItem button sx={{ py: 2, px: 3 }}>
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

    <ListItem button sx={{ py: 2, px: 3 }}>
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

    <ListItem button sx={{ py: 2, px: 3 }}>
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
      <ListItemText 
        primary="Nisedralaza (Admin)" 
        primaryTypographyProps={{ 
          sx: { 
            textTransform: "uppercase", 
            fontWeight: "bold",
            fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif"
          } 
        }} 
      />
    </ListItem>
  </List>
</Drawer>




    </header>
    </>
  );
}

export default Header;
