import React, { useState } from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { addDoc, collection, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { db } from "../config/firebase";
import { useDispatch, useSelector } from "react-redux";
import { useCollection } from "react-firebase-hooks/firestore";
import TagRoundedIcon from "@mui/icons-material/TagRounded";
import { IconButton } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { setNoteCollection, setPath } from "../redux/noteSlice";
import { toast } from "react-toastify";

function CollDisplay() {
  const user = useSelector((state: any) => state.appRedux.userDetails);

  const collRef = collection(db, "collections");
  const q = query(collRef, where("madeBy", "==", `${user?.userId}`));

  const [NoteCollections] = useCollection(q);

  const [addCollOpen, setAddCollOpen] = useState(false);
  const [collectionName, setCollectionName] = useState(""); 

  const handleCollClick = () => {
    setAddCollOpen(true);
    console.log("Add collection clicked");
  };

  const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    console.log("Close button clicked");
    setAddCollOpen(false);
    setCollectionName(""); 
  };

  const handleAddCollection = async() => {
   try {
       await addDoc(collRef, {
      collectionName: collectionName,
      madeBy: user?.userId,
      time: serverTimestamp(),
    });
    toast.success("Collection Successfully Created !", {autoClose: 2000,
      position: toast.POSITION.BOTTOM_RIGHT
    });
   } catch (error) {
    toast.error("Something went wrong!", {autoClose: 2000,
      position: toast.POSITION.BOTTOM_RIGHT
    });
   }
 
    setCollectionName(""); 
    setAddCollOpen(false);
    console.log("New collection added:", collectionName);
  };

  const dispatch = useDispatch()

  const handleCollectionClick = (id :string, name: string)=>{
    dispatch(setNoteCollection({
      noteId: id,
      noteCollName: name,
    }))
    dispatch(setPath("collection"))
  }

  const CollectionItem = React.memo(({ collectionName, collId }: { collectionName: string, collId: string }) => (
    <div
    onClick={()=>handleCollectionClick(collId, collectionName)}
      className="mt-5 cursor-pointer hover:bg-slate-200 transition-all hover:shadow-lg bg-white w-[300px] h-[200px] border-2 flex items-center justify-center border-gray-400 rounded-xl"
    >
      <TagRoundedIcon />
      <span className="text-[20px] font-bold text-center">
        {collectionName}
      </span>
    </div>
  ));


  return (
    <div className="flex gap-4 flex-wrap">
      <div
        onClick={handleCollClick}
        className="mt-5 cursor-pointer hover:bg-slate-200 transition-all hover:shadow-lg bg-white w-[300px] h-[200px] border-2 flex flex-col items-center justify-center border-gray-400 rounded-xl relative"
      >
        {addCollOpen ? (
          <>
            <div className="flex items-center gap-1">
              <TagRoundedIcon />
              <input
                type="text"
                placeholder="collection name..."
                value={collectionName}
                onChange={(e) => setCollectionName(e.target.value)}
                className="border border-1 border-gray-500 outline-none bg-transparent p-2 rounded-md"
                />
              <IconButton onClick={handleAddCollection}>
                <ArrowForwardRoundedIcon />
              </IconButton>
            </div>
            <IconButton
              onClick={handleClose}
              className="!absolute top-0 right-0 !text-red-500"
            >
              <CloseRoundedIcon />
            </IconButton>
                </>
        ) : (
          <>
            <AddRoundedIcon className="text-5xl" />
            <span className="text-[20px] font-bold text-center">
              Add a Collection
            </span>
          </>
        )}
      </div>

      {NoteCollections &&
        NoteCollections?.docs.map((e) => (
          <CollectionItem
            key={e.id}
            collectionName={e.data().collectionName as string}
            collId={e.id}
          />
        ))}
    </div>
  );
}

export default CollDisplay;
