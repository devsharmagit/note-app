import React, { useState } from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { IconButton } from "@mui/material";
import TagRoundedIcon from "@mui/icons-material/TagRounded";
import {
  addDoc,
  collection,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { useDispatch, useSelector } from "react-redux";
import { useCollection } from "react-firebase-hooks/firestore";
import { closeNoteArchive, setNoteCollection, setPath } from "../redux/noteSlice";


function AddNoteSidebar() {
  const user = useSelector((state :any)=> state.appRedux.userDetails)
  const note = useSelector((state :any)=> state.note.noteCollection)

  const dispatch = useDispatch()

  const [addCollOpen, setAddCollOpen] = useState<boolean>(false);
  const [newCollText, setNewCollText] = useState<string>("");

  const collRef = collection(db, "collections");
  const q = query(
    collRef,
    where("madeBy", "==", `${user?.userId}`)
  );
  const [NoteCollections] = useCollection(q);

  const handleClick = (): void => {
    setAddCollOpen(!addCollOpen);
    setNewCollText("");
  };

  const handleArrowClick = (): void => {
    addDoc(collRef, {
      collectionName: newCollText,
      madeBy: user?.userId,
      time: serverTimestamp(),
    });
    setNewCollText("");
    setAddCollOpen(false);
  };

  const handleCancelClick = (): void => {
    setAddCollOpen(false);
    setNewCollText("");
  };

  const handleCollectionClick = (id :string, name: string)=>{
    dispatch(setNoteCollection({
      noteId: id,
      noteCollName: name,
    }))
    dispatch(setPath("collection"))
    dispatch(closeNoteArchive())
  }

  return (
    <div className="w-full !text-white ">
      <div className="flex px-2 py-2 hover:bg-slate-800 transition-all w-full" onClick={handleClick}>
        <AddRoundedIcon /> <p className="font-semibold">Add a Collection</p>
      </div>
      {addCollOpen && (
        <div className="py-2 px-2">
          <input
            value={newCollText}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setNewCollText(e.target.value);
            }}
            type="text"
            placeholder="#collection-name"
            className="bg-transparent border-0 outline-0 border-b-2 border-white placeholder:text-white placeholder:opacity-60"
          />
          <IconButton className="!text-white" onClick={handleArrowClick}>
            <ArrowForwardRoundedIcon />
          </IconButton>
          <IconButton className="!text-white" onClick={handleCancelClick}>
            <CloseRoundedIcon />
          </IconButton>
        </div>
      )}
      {NoteCollections &&
        NoteCollections.docs.map((e) => {
          return (
            <div onClick={() => handleCollectionClick(e.id, e.data().collectionName)} className={`flex text-white px-2 py-1 hover:bg-slate-800 transition-all ${e.id === note?.noteId && "bg-slate-800"} `} key={e.id}>
              <TagRoundedIcon />
              <p>{e.data().collectionName}</p>
            </div>
          );
        })}
    </div>
  );
}

export default AddNoteSidebar;
