import React, { useEffect, useState } from "react";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import PushPinRoundedIcon from "@mui/icons-material/PushPinRounded";
import { AvatarGroup, Avatar, IconButton } from "@mui/material";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import NoteSubTask from "./NoteSubTask";
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
import RestoreIcon from "@mui/icons-material/Restore";

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
  time: Date;
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

function NoteItem({
  archive,
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
  allDone,
  edited,
  assignedTo,
  collName,
}: NoteItemProps) {
  const noteCollection = useSelector((state: any) => state.note.noteCollection);
  const copiedNotes = useSelector((state: any) => state.note.copiedNotes);
  const selectedNotes = useSelector((state: any) => state.note.selectedNotes);
  const globalSelectNote = useSelector((state: any) => state.note.globalSelectNote);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [selectedNote, setSelectedNote] = useState(false);

  const [stateTask, setStateTask] = useState<SubTask[]>(
    subTasks ? subTasks : []
  );
  const [isPinned, setIsPinned] = useState(pinned);

  const [allDonestate, setAllDone] = useState(allDone);

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
      console.log(noteId);
      console.log(stateTask);
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
    console.log("this motherfucker is got clicked");

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
      console.log("inner selected notes");
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

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`min-h-[100px] h-fit max-w-[300px] min-w-[250px] opacity-100 rounded-xl p-3 border relative border-slate-400 ${color}`}
    >
      {noteCollection === null && sharingType === "personal" && (
        <h2 className="font-medium text-[1rem] opacity-40 ">#{collName} </h2>
      )}
      <h1
        className={`flex items-center mr-6 gap-2 px-1 font-medium text-[19px] mb-4 ${
          allDone && "line-through"
        }`}
      >
        {noteType === "task" && (
          <input
            onChange={(e) => {
              updateAllDone(e.target.checked);
            }}
            checked={allDone}
            className="w-6 h-5"
            type="checkbox"
          />
        )}
        {title}
      </h1>
      <p
        className={`leading-tight px-1  font-normal text-[16px] ${
          allDone && "line-through"
        } `}
      >
        {desc}
      </p>

      {noteType === "task" && (
        <div className="mt-2">
          {subTasks?.map((e, i) => {
            if (allDone !== undefined) {
              return (
                <NoteSubTask
                  onChange1={(status) => {
                    updateTask(i, status);
                  }}
                  key={i}
                  index={i}
                  taskName={e.taskName}
                  isDone={e.isDone}
                  allDone={allDone}
                />
              );
            }
          })}
        </div>
      )}

      <IconButton
        onClick={handlePinClick}
        className={`!absolute top-1 right-1`}
      >
        {isPinned ? <PushPinRoundedIcon /> : <PushPinOutlinedIcon />}
      </IconButton>
      <IconButton
        onClick={() => {
          handleSelectClick();
        }}
        className={`!absolute ${selectedNote && "!opacity-100"}`}
        style={{
          opacity: `${isHovered ? "1" : "0"}`,
          top: "-10px",
          left: "-10px",
          transition: "all linear 0.1s",
        }}
      >
        {selectedNote ? (
          <CheckCircleRoundedIcon />
        ) : (
          <CheckCircleOutlineRoundedIcon />
        )}
      </IconButton>

      <IconButton
        className={`!absolute bottom-0 right-1`}
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <MoreVertRoundedIcon />
      </IconButton>

      <div className="mt-3 flex items-center">
        {tags?.map((e) => {
          return (
            <span className="bg-slate-700 h-fit text-xs text-white px-2 py-[2px] mr-1 mt-2 rounded">
              {e.label}
            </span>
          );
        })}
        {sharingType === "shared" && (
          <AvatarGroup max={4} className="!w-fit mt-2 ">
            {editedpersons.map((a) => {
              return <Avatar src={a} />;
            })}
          </AvatarGroup>
        )}
      </div>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {!archive && (
          <MenuItem onClick={handleEditClick}>
            <EditRoundedIcon color="action" className="mr-2" /> Edit
          </MenuItem>
        )}

        <MenuItem onClick={handleDeleteClick}>
          <DeleteRoundedIcon color="action" className="mr-2" /> Delete
        </MenuItem>

        {!archive && (
          <MenuItem onClick={handleCopy}>
            <ContentCopyRoundedIcon color="action" className="mr-2" /> Copy
          </MenuItem>
        )}

        {!archive && (
          <MenuItem onClick={handleClose}>
            <SendRoundedIcon color="action" className="mr-2" /> Send
          </MenuItem>
        )}

        {archive && (
          <MenuItem onClick={handleRestoreClick}>
            <RestoreIcon color="action" className="mr-2" /> Restore
          </MenuItem>
        )}
      </Menu>
    </div>
  );
}

export default NoteItem;
