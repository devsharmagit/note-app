import React, { useState } from "react";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import AddNoteButton from "./AddNoteButton";
import { useDispatch, useSelector } from "react-redux";
import NoteList from "./NoteList";
import SharedCollectionAddBtn from "./SharedCollConsole";
import ShareCollList from "./ShareCollList";
import ShareNoteDisplay from "./ShareNoteDisplay";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import CollDisplay from "./CollDisplay";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import { IconButton } from "@mui/material";
import { setNoteCollection, setPath, setShareColl } from "../redux/noteSlice";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import ConfirmDialog from "./ConfirmDialog";


import 'react-toastify/dist/ReactToastify.css';

function NotesConsole() {
  const [open, setOpen] = useState(false);
  const [personalOpen, setPersonalOpen] = useState<boolean>(true);

  const note = useSelector((state: any) => state.note.noteCollection);
  const shareCollection = useSelector(
    (state: any) => state.note.shareCollection
  );
  const user = useSelector((state: any) => state.appRedux.userDetails);

  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(setNoteCollection(null));
    dispatch(setPath("home"));
    dispatch(setShareColl(null));
  };
  const handleToggleClick = (name: string) => {
    if (name === "personal") {
      setPersonalOpen(true);
      dispatch(setPath("home"));
    } else {
      setPersonalOpen(false);
      dispatch(setPath("shared"));
    }
  };

  const handleClose = async (isTrue: boolean) => {
    if (isTrue === true) {
      setOpen(false);
      const collRef = doc(db, "collections", note.noteId);
      const q = query(
        collection(db, "notes"),
        where("belongTo", "==", note.noteId)
      );
      const data = await getDocs(q);
      data.docs.map(async (document) => {
        const docRef = doc(db, "notes", document.id);
        await updateDoc(docRef, {
          archive: true,
        });
      });
      await deleteDoc(collRef);

      dispatch(setNoteCollection(null));
    } else {
      setOpen(false);
    }
  };

  const handleDelete = () => {
    setOpen(true);
  };

  return (
    <div className="bg-white w-full flex flex-col">
      <div className="w-full flex justify-center bg-white border-b-[0.5px] border-slate-300">
        <IconButton onClick={handleClick} className="!absolute top-0 left-0">
          <ArrowBackIosNewRoundedIcon />
        </IconButton>
        <div
          className={`w-60 rounded-lg bg-slate-50 after:bg-black  after:w-1/2 after:h-1 after:block after:rounded-md after:transition-transform ${
            !personalOpen ? "after:translate-x-full " : "after:translate-x-0"
          }`}
        >
          <button
            name="personal"
            onClick={(e) => handleToggleClick(e.currentTarget.name)}
            className={`inline-flex gap-1 transition-all items-center w-1/2 px-3 py-2 bg-slate-50 ${
              personalOpen && "!bg-slate-200"
            } `}
          >
            <PersonRoundedIcon sx={{ fontSize: 30 }} />
            <span className="font-medium">Personal</span>
          </button>
          <button
            name="shared"
            onClick={(e) => handleToggleClick(e.currentTarget.name)}
            className={`inline-flex gap-1 transition-all items-center w-1/2 px-3 py-2 bg-slate-50 ${
              !personalOpen && "!bg-slate-200"
            } `}
          >
            <GroupsRoundedIcon sx={{ fontSize: 30 }} />
            <span className="font-medium">Shared</span>
          </button>
        </div>
      </div>

      <div
        className={`w-[200%] no-scrolll overflow-scroll h-full flex relative ${
          personalOpen ? "left-0" : "-left-full"
        } transition-all`}
      >
        <div className="w-1/2 h-full no-scrolll overflow-scroll flex flex-col p-5 relative  justify-start flex-wrap gap-2 bg-white">
          {note ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-semibold text-gray-700"> # {note.noteCollName} </span>
                <IconButton onClick={handleDelete}>
                  <DeleteRoundedIcon />
                </IconButton>
              </div>
              <AddNoteButton type="personal" />
              <NoteList type="personal" />
            </>
          ) : (
            <div>
              <div className="flex items-center">
                <HomeRoundedIcon fontSize="large" />
                <span className="text-xl font-semibold text-gray-700">Home</span>
              </div>
              <CollDisplay />
              <NoteList type="personal" isHome={true} />
            </div>
          )}
        </div>
        <div className="no-scrolll w-1/2 bg-white p-5">
          {shareCollection ? (
            <ShareNoteDisplay />
          ) : (
            <>
              <SharedCollectionAddBtn />
              {user.userId && <ShareCollList />}
            </>
          )}
        </div>
      </div>

<ConfirmDialog open={open} handleClose={handleClose} />
    
    </div>
  );
}

export default NotesConsole;
