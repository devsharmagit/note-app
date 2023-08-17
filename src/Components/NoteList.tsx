import { collection,  orderBy,  query, where } from "firebase/firestore";
import  { useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import { useSelector } from "react-redux";
import { useCollection } from "react-firebase-hooks/firestore";
import NoteItem from "./NoteItem";
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import { useAuthState } from "react-firebase-hooks/auth";
import Skeleton from '@mui/material/Skeleton';
import emptyImg from "../assets/images/empty-box.png"



type NotListProps ={
  type: "personal" | "shared";
  isHome?: boolean;
}

function NoteList({type, isHome}:NotListProps) {

  const [user1] = useAuthState(auth)

  const note = useSelector((state: any) => state.note.noteCollection);
  const shareCollection = useSelector((state: any) => state.note.shareCollection);
  let q;
  if(!isHome){
    q = query(collection(db, `${type === "personal" ? "notes" : "sharedNotes"}`), where("belongTo", "==", `${type === "personal" ? note.noteId : shareCollection.shareCollId}`));
  }

  const q2 = query(collection(db, "notes"), where("ownedBy", "==", user1?.uid), orderBy("time", "desc"))

  const [allNotes, noteLoading] = useCollection(isHome ? q2 : q);
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
      {(otherNotes.length === 0 && pinNotes.length === 0 ) &&  
      <div className="w-full h-full flex items-center justify-center flex-col mt-10">
          <img src={emptyImg}  />
        <p className="font-medium text-xl mb-2 text-slate-700">No Notes to show.</p>
        <div className="flex gap-1 items-center"> {isHome ? <p className="text-slate-700 font-medium text-center text-xl mb-2">Make a new collection and add notes there.</p> : <><AddCircleRoundedIcon fontSize="medium" /> <p className="font-medium text-2xl mb-2">click on the icon to add notes</p> </>}
        
        </div>
      </div>
         }
      {
        !(otherNotes.length === 0 && pinNotes.length === 0 ) &&
      <p className="font-medium text-2xl mb-2">All Notes </p>
      }


      <p className="font-medium text-[14px] mb-2">
        {pinNotes.length !== 0 && 
        "PINNED"
        }
        </p>
         </div> 
      <div className="flex flex-wrap gap-2">
        <div className="flex flex-wrap gap-2">
          {noteLoading && <>
           <Skeleton width={300} animation="wave" height={300} />
           <Skeleton width={300} animation="wave" height={300} />
           <Skeleton width={300} animation="wave" height={300} />
          </>
           }
        </div>
      {pinNotes.map((e) => {
        
        return (
          <NoteItem
          isHome={isHome}
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
          isHome={isHome}
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
      
    </div>
  );
}

export default NoteList;
