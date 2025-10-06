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

export default function CardNorme({
  idnorme,
  images,
  nomsecteur,
  nomnorme,
  nbpages,
  navigate,
}) {
  const [hovered, setHovered] = React.useState(false);
  const [liked, setLiked] = React.useState(false);
  const [pdfThumbnail, setPdfThumbnail] = React.useState(null);

  const handleLikeClick = () => setLiked(!liked);

  React.useEffect(() => {
    const loadPdfThumbnail = async () => {
      try {
        const blob = await authFetchPdf(
          `http://localhost:8000/normes/${idnorme}/pdf`,
          {},
          navigate,
          "blob"
        );
        if (!blob) return;
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
      } catch (err) {
        console.error("Erreur PDF:", err);
        setPdfThumbnail(null);
      }
    };
    loadPdfThumbnail();
  }, [idnorme, navigate]);

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
  >
    <div className={styles.card2}>
<img
      src={pdfThumbnail || images}
      alt={nomnorme}
      style={{
           transition: 'transform 0.3s ease',
        transform: hovered ? 'scale(1.05)' : 'scale(1)',
          }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    />
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
>
  {nomnorme}
</Typography>

    <Typography variant="body2" color="text.secondary" noWrap>
      {nomsecteur}
    </Typography>
  </CardContent>

  <CardActions disableSpacing sx={{ px: 1 }}>
    <Tooltip title="J'adore">
      <IconButton onClick={handleLikeClick}>
        {liked ? <FavoriteIcon style={{color :"#1B6979"}} /> : <FavoriteBorderIcon style={{color:"#1B6979"}} />}
      </IconButton>
    </Tooltip>

    <Tooltip title="Consulter le fichier">
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
</Card>

  );
}
