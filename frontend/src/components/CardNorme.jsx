import * as React from 'react';
import Card from '@mui/material/Card';
import styles from './cardNorme.module.css';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.worker.entry';
import { authFetchPdf } from './utils/authFetch';
import { colors } from '@mui/material';
import { Spin } from "antd";
import { CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LinkIcon from '@mui/icons-material/Link';
import { styled } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
 import {   SpecialZoomLevel } from '@react-pdf-viewer/core';
import { Modal } from '@mui/material';
 import {  OrbitProgress } from 'react-loading-indicators';
  import { pdfjs } from 'react-pdf';
 import { Worker, Viewer } from '@react-pdf-viewer/core';
 //import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
 import { zoomPlugin } from '@react-pdf-viewer/zoom';
 import '@react-pdf-viewer/core/lib/styles/index.css';
 import '@react-pdf-viewer/zoom/lib/styles/index.css';


  pdfjs.GlobalWorkerOptions.workerSrc =
    'https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js';
  
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    backgroundColor: "white",
    borderRadius: "15px",
    padding: theme.spacing(2),
    width: "100%",
    maxWidth: "600px",
  },
}))

export default function CardNorme({
  idnorme,
  images,
  nomsecteur,
  nomnorme,
  nbpages,
  navigate,
  codification ,
  dateEdition  ,
  setShow ,
  openShow
}) {
  const [hovered, setHovered] = React.useState(false);
  const [liked, setLiked] = React.useState(false);
   const [loadingPdf, setLoadingPdf] = React.useState(false);
  const [pdfThumbnail, setPdfThumbnail] = React.useState(null);
  const [openModal, setOpenModal] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

 
 const [scrollPdf, setScrollPdf] = React.useState('paper');
const [openPdfDialogs, setOpenPdfDialogs] = React.useState(false);
const [pdfUrls, setPdfUrls] = React.useState("");
  const [loadingPdfUrls, setLoadingPdfUrls] = React.useState(false);
   const handleClickOpenPdf =  () => {
    setOpenPdfDialogs(true);
  
  };

  const handleClosePdf = () => {
  if (pdfUrls) {
    URL.revokeObjectURL(pdfUrls);
  }
  setPdfUrls("");
  setOpenPdfDialogs(false);
  setLoadingPdfUrls(false);

};


  const openPdfs = async (normeId) => {
    console.log(normeId)
    setLoadingPdfUrls(true); // Affiche le Backdrop
      handleClickOpenPdf(); // Ouvre le dialog après 4 secondes
 
    try {
      const blob = await authFetchPdf(
        `/normes/view_pdf/${normeId}`,
        {},
        navigate,
        "blob"
      );
  
      if (blob) {
        const url = URL.createObjectURL(blob);
        setPdfUrls(url);
      }
    } catch (error) {
      setSnackMessage("Erreur lors du chargement du PDF");
      setSnackError(true);
      setOpenSnack(true);
    } finally {
      setLoadingPdfUrls(false); // Masque le Backdrop
    }
  };

  const handleLikeClick = () => setLiked(!liked);
  React.useEffect(() => {
    const loadPdfThumbnail = async () => {
        setLoadingPdf(true)
      try {
    
      const blob = await authFetchPdf(
  `/normes/${idnorme}/pdf`,
  {},
  navigate,
  "blob"
);

        if (!blob)  {
            setLoadingPdf(false)
            return ;
        }
        const arrayBuffer = await blob.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.2 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;
        
        setPdfThumbnail(canvas.toDataURL());
        setLoadingPdf(false)
      } catch (err) {
        console.error("Erreur PDF:", err);
        setPdfThumbnail(null);
        setLoadingPdf(false)
      }
    };
    loadPdfThumbnail();
  }, [idnorme, navigate]);
const goApropos = () => {
  setShow(!openShow)
  navigate("/a_propos", {
    state: {
      idnorme,
      nomnorme,
      nomsecteur,
      nbpages,
      codification,
      dateEdition,
      pdfThumbnail
    }
  });
  
};


  const handleClose = () => {
    setOpenModal(false);
  };
  return (
 <Card
  sx={{
    width: 325,
    userSelect :'none',
    borderRadius: 3,
    overflow: 'hidden',
    boxShadow: 3,
    transition: 'transform 0.3s',
     display: 'flex',
    flexDirection: 'column',
    pt:1 ,
    pb:1
  }}
>
  {/* CardMedia avec capture PDF */}
  <div
    className={styles.cardImg}
  onClick={goApropos}>
    <div className={styles.card2}>
             {  loadingPdf ? 
          <div style={{width :"100%" , height :"100%" ,display :"flex" , alignItems :"center" , 
            justifyContent :"center"
          }}>
 <Spin size="large" /> 
          </div>   
            : 
             <img
      src={pdfThumbnail || images}
      alt={nomnorme}
      style={{
           transition: 'transform 0.3s ease',
        transform: hovered ? 'scale(1.05)' : 'scale(1)',
          }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    />}
        

    </div>
    
  </div>

  <CardContent sx={{ py: 1 }}>
   <Typography
  variant="h6"
  gutterBottom
  noWrap
  sx={{
    letterSpacing: 0.8,
    cursor: 'pointer',           // indique que c’est cliquable
    transition: 'all 0.3s ease', // effet doux au hover
    '&:hover': {
      textDecoration: 'underline', // underline au survol
      color: '#44B700',            // optionnel : changer la couleur
    },
  }}
 onClick={goApropos}>
  {nomnorme}
</Typography>

    <Typography variant="body2" color="text.secondary" noWrap>
      {codification} - {nomsecteur}
    </Typography>
  </CardContent>

  <CardActions disableSpacing sx={{ px: 1 }}>
    <Tooltip title="J'adore">
      <IconButton onClick={handleLikeClick}>
        {liked ? <FavoriteIcon style={{color :"#1B6979"}} /> : <FavoriteBorderIcon style={{color:"#1B6979"}} />}
      </IconButton>
    </Tooltip>

    <Tooltip title="Consulter le fichier" onClick={() => openPdfs(idnorme)}>
      <IconButton>
        <AttachFileIcon  sx={{color :"#1B6979"}}/>
      </IconButton>
    </Tooltip>

    {/* Nombre de pages aligné à droite */}
    <Box sx={{ marginLeft: 'auto', pr: 1 }}>
      <Typography variant="body2" color="text.secondary">
        {nbpages} page{nbpages > 1 ? 's' : ''}
      </Typography>
    </Box>
  </CardActions>
      <Modal
  open={openPdfDialogs}
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
        <div  className={styles.closeBtn}>


     <IconButton onClick={handleClosePdf}>
        <CloseIcon style={{color :"white"}}/>
      </IconButton>
          </div>
    {loadingPdfUrls ? (
<OrbitProgress color={["#7ca4c8", "#a0bdd7", "#c4d6e6", "#e8eff5"]} />

  ) : pdfUrls ? (
      <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
          <Viewer
            fileUrl={pdfUrls}
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
</Card>

  );
}
