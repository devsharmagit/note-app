import { useEffect, useState } from "react";
import Modal from "react-modal";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { useDispatch, useSelector } from "react-redux";
import { useCollection } from "react-firebase-hooks/firestore";
import { closeNoteModal } from "../redux/noteSlice";
import * as React from "react";
import { useTheme } from "@mui/material/styles";
import { SelectChangeEvent } from "@mui/material/Select";
import { toast } from "react-toastify";

type Tag = {
  value: String;
  label: String;
};

function useAddNote(arguType: string) {
  const note = useSelector((state: any) => state.note.noteCollection);
  const shareCollection = useSelector(
    (state: any) => state.note.shareCollection
  );
  const noteModal = useSelector((state: any) => state.note.noteModal);
  const user = useSelector((state: any) => state.appRedux.userDetails);
  const [color, setColor] = useState<string>(
    noteModal.color ? noteModal.color : "bg-white"
  );

  const [selectedTags, setSelectedTags] = useState<Tag[]>(
    noteModal.tags ? noteModal.tags : []
  );

  const noteCollRef = collection(
    db,
    `${noteModal.sharingType === "personal" ? "notes" : "sharedNotes"}`
  );

  const q = query(
    collection(db, "tags"),
    where(
      "collection",
      "==",
      `${
        noteModal.sharingType === "personal"
          ? note.noteId
          : shareCollection.shareCollId
      }`
    )
  );

  const [noteAllTags] = useCollection(q);

  const [subTask1, setSubTask] = useState<any[]>(
    noteModal.subTasks ? noteModal.subTasks : []
  );

  useEffect(() => {
    let newArr: any[] = [];
    if (noteModal.subTasks) {
      noteModal.subTasks.forEach((task: any) => {
        newArr.push(task);
      });
    }
    setSubTask(newArr);
  }, [noteModal.subTasks]);

  const [noteTitle, setNoteTitle] = useState<string>(
    noteModal.title ? noteModal.title : ""
  );
  const [noteDesc, setNoteDesc] = useState<string>(
    noteModal.desc ? noteModal.desc : ""
  );

  const [members, setMembers] = useState([]);
  const [membersOptions, setMembersOptions] = useState<any[]>([]);

  const getMembers = async () => {
    if (arguType === "shared") {
      const docRef = doc(db, "sharedColl", shareCollection.shareCollId);
      const data = await getDoc(docRef);
      const peoples = await data.data()?.members;
      setMembers(peoples);
    }
  };

  const getUserDetails = async () => {
    const q = query(
      collection(db, "userDetails"),
      where("userId", "in", members)
    );
    const data = await getDocs(q);
    let newArr = data.docs.map((e) => {
      return e.data().email;
    });

    setMembersOptions(newArr);
  };

  useEffect(() => {
    if (members.length !== 0) {
      getUserDetails();
    }
  }, [members]);
  const theme = useTheme();
  // const [personName, setPersonName] = React.useState<string[]>(["dev", "sharma"]);
  const [personName, setPersonName] = React.useState<string[]>(
    noteModal.assignedTo ? [...noteModal.assignedTo] : []
  );

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  const dispatch = useDispatch();

  const addTask = () => {
    if (subTask1) {
      setSubTask([...subTask1, { taskName: "", isDone: false }]);
    } else {
      setSubTask([{ taskName: "", isDone: false }]);
    }
  };

  Modal.setAppElement("div");

  const handleClose = () => {
    dispatch(closeNoteModal());
  };

  const handleColor = (event: React.MouseEvent<HTMLDivElement>) => {
    const clickedDiv = event.currentTarget as HTMLDivElement;
    if (clickedDiv.id === "white") {
      setColor("bg-white");
    } else {
      setColor("bg-" + clickedDiv.id + "-100");
    }
  };

  const updateTaskName = async (
    index: number,
    newTaskName: string,
    status: boolean
  ) => {
    setSubTask((prevState) => {
      const updatedSubTask = [...prevState];
      updatedSubTask[index] = { taskName: newTaskName, isDone: status };
      return updatedSubTask;
    });
  };

  const deleteTask = (index: number) => {
    setSubTask((prevState) => {
      const updatedSubTask = [...prevState];
      updatedSubTask.splice(index, 1);
      return updatedSubTask;
    });
  };

  const handleNoteSave = async () => {
    const noteObj: { [key: string]: any } = {
      noteTitle: noteTitle,
      noteDesc: noteDesc,
      noteTags: selectedTags,
      time: serverTimestamp(),
      sharigType: "personal",
      noteType: noteModal.noteType,
      noteColor: color,
      pinned: noteModal.pinned ? noteModal.pinned : false,
      belongTo: `${
        noteModal.sharingType === "personal"
          ? note.noteId
          : shareCollection.shareCollId
      }`,
      archive: false,
      ownedBy: user.userId,
      collName: `${
        noteModal.sharingType === "personal"
          ? note.noteCollName
          : shareCollection.shareCollName
      }`,
    };
    if (arguType === "shared") {
      noteObj["edited"] = [user.userId];
    }

    if (noteModal.actionType === "add") {
      if (noteModal.noteType === "task") {
        if (arguType === "shared") {
          noteObj["assignedTo"] = personName;
        }
        try {
          await addDoc(noteCollRef, {
            ...noteObj,
            subTasks: subTask1,
            allDone: false,
          });
          toast.success("Note Saved Successfully!", {
            autoClose: 2000,
            position: toast.POSITION.BOTTOM_RIGHT,
          });
        } catch (error) {
          toast.error("Something went wrong!", {
            autoClose: 2000,
            position: toast.POSITION.BOTTOM_RIGHT,
          });
        }
      } else {
        try {
          await addDoc(noteCollRef, {
            ...noteObj,
            subTasks: subTask1,
          });
          toast.success("Note Saved Successfully!", {
            autoClose: 2000,
            position: toast.POSITION.BOTTOM_RIGHT,
          });
        } catch (error) {
          toast.error("Something went wrong!", {
            autoClose: 2000,
            position: toast.POSITION.BOTTOM_RIGHT,
          });
        }
      }
      if (noteModal.sharingType === "shared") {
        await addDoc(collection(db, "notification"), {
          collection: shareCollection.shareCollId,
          photo: user.photo,
          time: serverTimestamp(),
          sentTo: members,
          by: user.email,
          readt: [],
          message: `${
            user.name === null ? "GuestUser" : user.name
          } added a new ${noteModal.noteType} named "${noteTitle}" in #${
            shareCollection.shareCollName
          }`,
        });
      }
      handleClose();
    } else if (noteModal.actionType === "edit") {
      if (arguType === "shared") {
        if (!noteModal.edited.includes(user.userId)) {
          noteObj["edited"] = [...noteModal.edited, user.userId];
        }
      }
      const noteRef = doc(
        db,
        `${noteModal.sharingType === "personal" ? "notes" : "sharedNotes"}`,
        noteModal.noteId
      );

      if (noteModal.noteType === "task") {
        if (arguType === "shared") {
          noteObj["assignedTo"] = personName;
        }
        try {
          await updateDoc(noteRef, {
            ...noteObj,
            subTasks: subTask1,
            allDone: false,
          });
          toast.success("Note Updated Successfully!", {
            autoClose: 2000,
            position: toast.POSITION.BOTTOM_RIGHT,
          });
        } catch (error) {
          toast.error("Something went wrong!", {
            autoClose: 2000,
            position: toast.POSITION.BOTTOM_RIGHT,
          });
        }
      } else {
        try {
          await updateDoc(noteRef, {
            ...noteObj,
            subTasks: subTask1,
          });
          toast.success("Note Updated Successfully!", {
            autoClose: 2000,
            position: toast.POSITION.BOTTOM_RIGHT,
          });
        } catch (error) {
          toast.error("Something went wrong!", {
            autoClose: 2000,
            position: toast.POSITION.BOTTOM_RIGHT,
          });
        }
      }
      if (noteModal.sharingType === "shared") {
        await addDoc(collection(db, "notification"), {
          collection: shareCollection.shareCollId,
          photo: user.photo,
          time: serverTimestamp(),
          sentTo: members,
          by: user.email,
          readt: [],
          message: `${
            user.name === null ? "GuestUser" : user.name
          } added a new ${noteModal.type} named "${noteTitle}" in  #${
            shareCollection.shareCollName
          }`,
        });
      }
      handleClose();
    }
  };

  const addTags = async (value: string, label: string) => {
    await addDoc(collection(db, "tags"), {
      value: value,
      label: label,
      collection: `${
        noteModal.sharingType === "personal"
          ? note.noteId
          : shareCollection.shareCollId
      }`,
    });
  };

  useEffect(() => {
    getMembers();
  }, []);

  return {
    color,
    noteTitle,
    setNoteTitle,
    noteDesc,
    setNoteDesc,
    subTask1,
    deleteTask,
    updateTaskName,
    addTask,
    handleColor,
    personName,
    handleChange,
    membersOptions,
    handleNoteSave,
    handleClose,
    setSelectedTags,
    addTags,
    selectedTags,
    noteAllTags,
  };
}

export default useAddNote;
