import React, { useState } from "react";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { IconButton } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { signOut } from "firebase/auth";
import { auth, db } from "../config/firebase";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import { useDispatch, useSelector } from "react-redux";
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import {
  closeNoti,
  closeSidebar,
  openNoti,
  openSidebar,
} from "../redux/userSlice";
import Badge from "@mui/material/Badge";
import ContentPasteRoundedIcon from "@mui/icons-material/ContentPasteRounded";
import { addDoc, collection, deleteDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { setCopiedNotes, setGlobalSelectNote, setSelectedNotes } from "../redux/noteSlice";

function Navbar() {
  const isNotificationOpen = useSelector(
    (state: any) => state.appRedux.notificationOpen
  );
  const newNotification = useSelector(
    (state: any) => state.appRedux.newNotification
  );
  const sidebar = useSelector((state: any) => state.appRedux.isSidebarOpen);

  const copiedNotes = useSelector((state: any) => state.note.copiedNotes);
  const selectedNotes = useSelector((state: any) => state.note.selectedNotes);

  const user = useSelector((state: any) => state.appRedux.userDetails);

  const path = useSelector((state: any) => state.note.path);
  const shareCollection = useSelector(
    (state: any) => state.note.shareCollection
  );
  const noteCollection = useSelector((state: any) => state.note.noteCollection);

  const dispatch = useDispatch();

  const handleClick = () => {
    if (sidebar) {
      dispatch(closeSidebar());
    } else {
      dispatch(openSidebar());
    }
  };

  const handleNotification = () => {
    if (isNotificationOpen) {
      dispatch(closeNoti());
    } else {
      dispatch(openNoti());
    }
  };

  const handleDeleteClick =()=>{
    selectedNotes.forEach(async(note :any)=>{
      if (note.noteContent.sharingType === "personal") {
        const noteRef = doc(db, "notes", note.noteId)
        await updateDoc(noteRef, {
          archive: true,
        })
      }else if(note.noteContent.sharingType === "shared"){
        const noteRef = doc(db, "sharedNotes", note.noteId)
        await deleteDoc(noteRef)
      }
    })
    dispatch(setSelectedNotes(null))
  }

  const handlePasteClick = () => {
    if (path === "home" || path === "collection") {
      if (noteCollection.noteId) {
        const collRef = collection(db, "notes");
        copiedNotes.forEach(async (noteObj: any) => {
          let editedNote = {
            ...noteObj,
            belongTo: noteCollection.noteId,
            collName: noteCollection.noteCollName,
            time: serverTimestamp(),
            ownedBy: user.userId,
          };
          console.log(editedNote);
          await addDoc(collRef, {
            ...editedNote,
          });
        });
        dispatch(setCopiedNotes(null));
      }
    } else if (path === "shared") {
      if (shareCollection.shareCollId) {
        const sharedCollRef = collection(db, "sharedNotes");
        copiedNotes.forEach(async (noteObj: any) => {
          let editedNote = {
            ...noteObj,
            belongTo: shareCollection.shareCollId,
            collName: shareCollection.shareCollName,
            time: serverTimestamp(),
            ownedBy: user.userId,
            edited: [user.userId],
          };
          console.log(editedNote);
          await addDoc(sharedCollRef, {
            ...editedNote,
          });
        });
        dispatch(setCopiedNotes(null));
      }
    }
  };

  const handleCopyClick = ()=>{
    const newArr = selectedNotes.map((note :any)=>{
      return note.noteContent
    })
    dispatch(setCopiedNotes(newArr))
    dispatch(setSelectedNotes(null))
    dispatch(setGlobalSelectNote(false))
  }

  return (
    <div className="w-100 bg-slate-800 h-14 flex justify-between items-center">
      <IconButton onClick={handleClick} className="!text-white">
        <MenuRoundedIcon fontSize="large" />
      </IconButton>

      <div>
        {copiedNotes !== null && (
          <IconButton onClick={handlePasteClick} className="!text-white">
            <ContentPasteRoundedIcon />
          </IconButton>
        )}
        {selectedNotes !== null && <IconButton onClick={handleCopyClick} className="!text-white">
          <ContentCopyRoundedIcon />
          </IconButton>}
        {selectedNotes !== null && <IconButton onClick={handleDeleteClick} className="!text-white">
          <DeleteRoundedIcon />
          </IconButton>}

        <IconButton onClick={handleNotification} className="!text-white !mr-2">
          <Badge color="warning" variant="dot" invisible={!newNotification}>
            <NotificationsRoundedIcon />
          </Badge>
        </IconButton>
      </div>
    </div>
  );
}

export default Navbar;
