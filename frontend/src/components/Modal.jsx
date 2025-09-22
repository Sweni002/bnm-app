import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import { EditOutlined, FileAddOutlined, FileOutlined } from '@ant-design/icons';

function MobileActionButton({ record }) {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (state) => {
    setOpen(state);
  };

  const handleEdit = () => {
    alert(`Modifier ${record.nom}`);
    toggleDrawer(false);
  };

  const handleDelete = () => {
    alert(`Supprimer ${record.nom}`);
    toggleDrawer(false);
  };

  return (
    <>
      <IconButton
        aria-label="actions"
        size="small"
        onClick={() => toggleDrawer(true)}
      >
        <i className="fa-solid fa-ellipsis-vertical" style={{ fontSize: 15 }}></i>
      </IconButton>

      <Drawer
        anchor="bottom"
        open={open}
        onClose={() => toggleDrawer(false)}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            p: 2,
            minHeight: 100,
            bgcolor: "#fff",
          },
        }}
      >
        {/* petit "drag handle" pour UX mobile */}
        <Box sx={{ width: 40, height: 4, bgcolor: "gray", borderRadius: 2, mx: "auto", mb: 2 }} />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Ligne Modifier */}
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 1, py: 1.5, cursor: "pointer", borderRadius: 2, "&:hover": { bgcolor: "#f0f0f0" } }}
            onClick={handleEdit}
          >
            <EditOutlined style={{ fontSize: 18 ,color :"#1B6979" }} />
            <span>Modifier</span>
          </Box>

    <Box
            sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 1, py: 1.5, cursor: "pointer", borderRadius: 2, "&:hover": { bgcolor: "#ffecec" } }}
            onClick={handleDelete}
          >
            <FileAddOutlined style={{ fontSize: 18  ,color :"#44B700"}} />
            <span>Consulter le fichier </span>
          </Box>
          {/* Ligne Supprimer */}
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 1, py: 1.5, cursor: "pointer", borderRadius: 2, color: "red", "&:hover": { bgcolor: "#ffecec" } }}
            onClick={handleDelete}
          >
            <i className="fa-regular fa-trash-can" style={{ fontSize: 18 }} />
            <span>Supprimer</span>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}

export default MobileActionButton;
