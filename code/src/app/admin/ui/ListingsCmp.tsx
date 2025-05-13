"use client";
import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderIcon from "@mui/icons-material/Folder";

function ListingsCmp() {
  return (
    <div>
      {" "}
      <List sx={{ width: "100%", maxWidth: 900, bgcolor: "background.paper" }}>
        <ListItem
          secondaryAction={
            <>
              <IconButton edge="end" aria-label="delete">
                Approve
              </IconButton>{" "}
              <IconButton edge="end" aria-label="delete">
                Disapprove
              </IconButton>{" "}
              <IconButton edge="end" aria-label="delete">
                <DeleteIcon />
              </IconButton>
            </>
          }
        >
          <ListItemAvatar>
            <Avatar>
              <FolderIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Photos" secondary="Jan 9, 2014" />
        </ListItem>
        <ListItem
          secondaryAction={
            <>
              <IconButton edge="end" aria-label="delete">
                Approve
              </IconButton>{" "}
              <IconButton edge="end" aria-label="delete">
                Disapprove
              </IconButton>{" "}
              <IconButton edge="end" aria-label="delete">
                <DeleteIcon />
              </IconButton>
            </>
          }
        >
          <ListItemAvatar>
            <Avatar>
              <FolderIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Work" secondary="Jan 7, 2014" />
        </ListItem>
        <ListItem
          secondaryAction={
            <>
              <IconButton edge="end" aria-label="delete">
                Approve
              </IconButton>{" "}
              <IconButton edge="end" aria-label="delete">
                Disapprove
              </IconButton>{" "}
              <IconButton edge="end" aria-label="delete">
                <DeleteIcon />
              </IconButton>
            </>
          }
        >
          <ListItemAvatar>
            <Avatar>
              <FolderIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Vacation" secondary="July 20, 2014" />
        </ListItem>
      </List>
    </div>
  );
}

export default ListingsCmp;
