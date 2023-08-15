import { collection, doc, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import { useSelector } from "react-redux";
import { useCollection } from "react-firebase-hooks/firestore";
import NoteItem from "./NoteItem";
import { type } from "os";
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import { useAuthState } from "react-firebase-hooks/auth";

type Tag = {
  value: String;
  label: String;
};

type SubTask = {
  taskName: string;
  isDone: boolean;
};

type Note = {
  key: string;
  title: string;
  desc: string;
  color: string;
  tags: Tag[];
  time: Date;
  noteType: string;
  sharingType?: string;
  subTasks?: SubTask[];
  pinned: boolean;
  id: string;
  allDone?: boolean;
};


type NotListProps ={
  type: "personal" | "shared";
  isHome?: boolean;
}

function NoteList({type, isHome}:NotListProps) {

  const [user1, loading, error] = useAuthState(auth)

  const note = useSelector((state: any) => state.note.noteCollection);
  const shareCollection = useSelector((state: any) => state.note.shareCollection);
  let q;
  if(!isHome){
    q = query(collection(db, `${type === "personal" ? "notes" : "sharedNotes"}`), where("belongTo", "==", `${type === "personal" ? note.noteId : shareCollection.shareCollId}`));
  }

  const q2 = query(collection(db, "notes"), where("ownedBy", "==", user1?.uid))

  const [allNotes] = useCollection(isHome ? q2 : q);

  const [pinNotes, setPinNotes] = useState<any[]>([]);
  const [otherNotes, setOtherNotes] = useState<any[]>([]);

  useEffect(() => {
    if (allNotes) {
      const pinnedNotes :any[] = [];
      const otherNotes :any[]= [];
      allNotes.docs.forEach((e) => {
        if (e.data().pinned === true && e.data().archive === false) {
          pinnedNotes.push({ ...e.data(), id: e.id });
        } else if(e.data().pinned === false && e.data().archive === false){
          otherNotes.push({ ...e.data(), id: e.id });
        }
      });
  
      setPinNotes(pinnedNotes);
      setOtherNotes(otherNotes);
    }
  }, [allNotes]);
  

  return (
    <div >
      <div className="w-full my-3"> 
      {allNotes?.empty &&  <div className="w-full">
        <p className="font-medium text-2xl mb-2">No Notes to show </p>
        <div className="flex gap-1 items-center">
        <AddCircleRoundedIcon fontSize="medium" /> <p className="font-medium text-2xl mb-2">click on the icon to add notes</p>
        </div>
      </div>
         }
      {
        !allNotes?.empty &&
      <p className="font-medium text-2xl mb-2">All Notes </p>
      }


      <p className="font-medium text-[14px] mb-2">
        {pinNotes.length !== 0 && 
        "PINNED"
        }
        </p>
         </div> 
      <div className="flex flex-wrap gap-2">
      {pinNotes.map((e) => {
        
        return (
          <NoteItem
            key={e.id}
            noteId={e.id}
            title={e.noteTitle}
            desc={e.noteDesc}
            color={e.noteColor}
            tags={e.noteTags}
            time={e.time}
            noteType={e.noteType}
            sharingType={type}
            subTasks={e?.subTasks}
            pinned={e.pinned}  
            allDone={e.allDone}
            edited={e.edited}
            assignedTo={e?.assignedTo}
            collName={e.collName}
          />
        );
      })}
      </div>
      <div className="w-full my-3">     
      <p className="font-medium text-[14px] mb-2">
        {otherNotes.length !== 0 &&
        "OTHER"
        }
        </p>
        </div> 
      <div className="flex flex-wrap gap-2">
      {otherNotes.map((e) => {
        return (
          <NoteItem
            key={e.id}
            noteId={e.id}
            title={e.noteTitle}
            desc={e.noteDesc}
            color={e.noteColor}
            tags={e.noteTags}
            time={e.time}
            noteType={e.noteType}
            sharingType={type}
            subTasks={e?.subTasks}
            pinned={e.pinned}
            allDone={e.allDone}
            edited={e.edited}
            assignedTo={e?.assignedTo}
            collName={e.collName}
          />
        );
      })}
      </div>
      

      {/* {allNotes?.docs.map((e)=>{
        return <NoteItem key={e.id}
        title={e.data().noteTitle}
        desc={e.data().noteDesc}
        color={e.data().noteColor}
        tags={e.data().noteTags}
        time={e.data().time}
        noteType={e.data().noteType}
        sharingType={e.data().sharingType}
        subTasks={e?.data().subTasks}
        pinned={e.data().pinned}/>
      })} */}
    </div>
  );
}

export default NoteList;
