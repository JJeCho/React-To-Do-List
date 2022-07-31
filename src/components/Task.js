import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Modal,
  Box,
  Typography,
} from "@mui/material";
import { db } from "../database/config";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { doc, deleteDoc } from "firebase/firestore";
import React, { useState } from "react";

const Task = ({ arr }) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <List className="todo__list">
      <ListItem
        style={{ backgroundColor: arr.item.color }}
        onClick={handleOpen}
      >
        <ListItemAvatar />
        <ListItemText primary={arr.item.task} secondary={arr.item.task} />
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {arr.item.task}
            </Typography>
            {Object.entries(arr.item).map(
              ([key, val]) =>
                key !== "timestamp" &&
                val !== 0 &&
                val !== "" && (
                  <div>
                    <p>
                      {key}:{val}
                    </p>
                    <EditIcon
                      fontSize="large"
                      style={{ opacity: 0.7 }}
                    ></EditIcon>
                  </div>
                )
            )}
          </Box>
        </Modal>
      </ListItem>
      <DeleteIcon
        fontSize="large"
        style={{ opacity: 0.7 }}
        onClick={() => {
          deleteDoc(doc(db, "tasks", arr.id));
        }}
      />
    </List>
  );
};

export default Task;

// db.collection('todos').doc(arr.id).delete()
/*
<Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            </Typography>
*/
