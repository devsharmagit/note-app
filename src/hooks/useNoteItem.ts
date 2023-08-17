import React, { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../config/firebase";
import {
  openNoteModal,
  setCopiedNotes,
  setSelectedNotes,
} from "../redux/noteSlice";


type SubTask = {
    taskName: string;
    isDone: boolean;
  };
  
  type Tag = {
    value: String;
    label: String;
  };

  type NoteItemProps = {
    noteId: string;
    title: string;
    desc: string;
    time: any;
    tags: Tag[];
    noteType: "note" | "task";
    sharingType: "personal" | "shared";
    subTasks?: SubTask[];
    color: string;
    pinned: boolean;
    allDone?: boolean;
    edited?: string[];
    assignedTo?: string[];
    collName: string;
    archive?: boolean;
  };

function useNoteItem({
    archive = false,
    title,
    tags,
    time,
    desc,
    noteType,
    sharingType,
    subTasks,
    pinned,
    color,
    noteId,
    allDone = false,
    edited,
    assignedTo,
    collName,
  }: NoteItemProps) {
  
    const noteCollection = useSelector((state: any) => state.note.noteCollection);
  const selectedNotes = useSelector((state: any) => state.note.selectedNotes);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [selectedNote, setSelectedNote] = useState(false);

  const [stateTask, setStateTask] = useState<SubTask[]>(
    subTasks ? subTasks : []
  );
  const [isPinned, setIsPinned] = useState(pinned);

  const open = Boolean(anchorEl);

  const dispatch = useDispatch();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const updateTask = async (index: number, status: boolean) => {
    if (noteId) {
      setStateTask((prevState) => {
        const updatedSubTask = [...prevState];
        let taskToUpdate = updatedSubTask[index];
        taskToUpdate = { ...taskToUpdate, isDone: !status };
        updatedSubTask[index] = taskToUpdate;
        return updatedSubTask;
      });

      const docRef = doc(
        db,
        `${sharingType === "personal" ? "notes" : "sharedNotes"}`,
        noteId
      );
      await updateDoc(docRef, {
        subTasks: stateTask,
      });
    }
  };

  const [editedpersons, setEditedPersons] = useState<string[]>([]);

  useEffect(() => {
    const getUserDetails = async () => {
      const q = query(
        collection(db, "userDetails"),
        where("userId", "in", edited)
      );
      const data = await getDocs(q);
      let newarr: string[] = [];
      data.docs.map((e) => {
        newarr.push(e.data().photo);
      });
      setEditedPersons(newarr);
    };
    if (edited) {
      getUserDetails();
    }
  }, [edited]);

  const noteRef = doc(
    db,
    `${sharingType === "personal" ? "notes" : "sharedNotes"}`,
    noteId
  );

  const handlePinClick = async () => {
    await updateDoc(noteRef, {
      pinned: !isPinned,
    });
    setIsPinned(!isPinned);
  };

  const updateAllDone = async (t: boolean) => {
    await updateDoc(noteRef, {
      allDone: t,
    });
  };

  const handleRestoreClick = async () => {
    if (archive) {
      await updateDoc(noteRef, {
        archive: false,
      });
    }
  };

  const handleEditClick = () => {

    dispatch(
      openNoteModal({
        isNoteModalOpen: true,
        noteType: noteType,
        noteId: noteId,
        actionType: "edit",
        title: title,
        desc: desc,
        tags: tags,
        color: color,
        subTasks: subTasks,
        sharingType: sharingType,
        pinned: pinned,
        edited: edited,
        assignedTo: assignedTo,
      })
    );
    handleClose();
  };

  const noteObj = {
    noteType: noteType,
    noteTitle: title,
    noteDesc: desc,
    noteTags: tags,
    noteColor: color,
    subTasks: subTasks,
    sharingType: sharingType,
    pinned: pinned,
    archive: false,
    collName: collName,
  };
  const handleCopy = () => {
    dispatch(
      setCopiedNotes([
        {
          ...noteObj,
        },
      ])
    );

    handleClose();
  };

  const handleDeleteClick = async () => {
    if (archive) {
      await deleteDoc(noteRef);
    } else {
      await updateDoc(noteRef, {
        archive: true,
      });
    }
  };

  const handleSelectClick = () => {
    if (selectedNote === false) {
      setSelectedNote(true);
      if (selectedNotes === null) {
        dispatch(setSelectedNotes([{  noteId: noteId, noteContent: {...noteObj} }]));
      } else {
        dispatch(setSelectedNotes([...selectedNotes, {  noteId: noteId, noteContent: {...noteObj} }]));
      }
    } else {
      setSelectedNote(false);
      let newArr = selectedNotes.filter((note :any)=>{
        return note.noteId !== noteId
      })
      if(newArr.length === 0){
        dispatch(setSelectedNotes(null))
      }else{
        dispatch(setSelectedNotes(newArr))
      }
    }
  };

  useEffect(()=>{
    const resetSelect = ()=>{
      if(selectedNotes === null){
        setSelectedNote(false)
      }
    }
    resetSelect()
  }, [selectedNotes] )


const dateObject = new Date(time?.toMillis());
const formattedDate = dateObject.toLocaleString(undefined, {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

    return {handleMouseEnter, handleMouseLeave, noteCollection, updateAllDone, updateTask, handlePinClick, isPinned, handleSelectClick, selectedNote, isHovered, open, handleClick, editedpersons, anchorEl, handleClose, handleEditClick, handleDeleteClick, handleCopy,handleRestoreClick, formattedDate }
}

export default useNoteItem
