import { Button, IconButton } from "@mui/material";
import  { useEffect, useState } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CreatableReactSelect from "react-select/creatable";
import { v4 as uuidv4 } from "uuid";
import Modal from "react-modal";
import SubTask from "./SubTask";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { addDoc, collection, doc, getDoc, getDocs, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { db } from "../config/firebase";
import { useDispatch, useSelector } from "react-redux";
import { useCollection } from "react-firebase-hooks/firestore";
import { closeNoteModal } from "../redux/noteSlice";
import { type } from "os";
import * as React from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { ToastContainer, toast } from 'react-toastify';

type Tag = {
  value: String;
  label: String;
};

type SubTask = {
  taskName: string;
  isDone: boolean;
};

type AddNoteModalProps ={
  type: "personal" | "shared";
}

function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

function AddNoteModal(props: AddNoteModalProps) {
 
  
  const note = useSelector((state :any)=> state.note.noteCollection)
  const shareCollection = useSelector((state :any)=> state.note.shareCollection)
  const noteModal = useSelector((state :any)=> state.note.noteModal)
  const user = useSelector((state :any) => state.appRedux.userDetails)
  const [color, setColor] = useState<string>(noteModal.color ? noteModal.color : "bg-white");

  const [selectedTags, setSelectedTags] = useState<Tag[]>(noteModal.tags ? noteModal.tags : []);

  
  const noteCollRef = collection(db, `${noteModal.sharingType === "personal" ? "notes": "sharedNotes"}`)

  const q = query(collection(db, "tags"), where("collection", "==", `${noteModal.sharingType === "personal" ? note.noteId : shareCollection.shareCollId}`))

  const [noteAllTags] = useCollection(q)

  const [subTask, setSubTask] = useState<SubTask[]>(noteModal.subTasks ? noteModal.subTasks : []);

  const [noteTitle, setNoteTitle] = useState<string>(noteModal.title ? noteModal.title : "")
  const [noteDesc, setNoteDesc] = useState<string>(noteModal.desc ? noteModal.desc : "")

  const [members, setMembers] = useState([])
  const [membersOptions, setMembersOptions] = useState<any[]>([])

  const getMembers = async()=>{
    if(props.type === "shared"){
      const docRef = doc(db, "sharedColl", shareCollection.shareCollId)
      const data = await getDoc(docRef)
      const peoples = await data.data()?.members
      setMembers(peoples)
      // if(members.length !== 0){
      //   getUserDetails()
      // }
    }
  }


  const getUserDetails = async()=>{
    console.log("getuserdetails is called")
      const q = query(collection(db, "userDetails"), where("userId", "in", members))
      const data = await getDocs(q)
      let newArr = data.docs.map((e)=>{
        return e.data().email})
        console.log(newArr)
        setMembersOptions(newArr)
    
  }

  useEffect(()=>{
    if(members.length !== 0){
      getUserDetails()
    }
  }, [members])
  const theme = useTheme();
  // const [personName, setPersonName] = React.useState<string[]>(["dev", "sharma"]);
  const [personName, setPersonName] = React.useState<string[]>(noteModal.assignedTo ? [...noteModal.assignedTo] : []);

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };
  const dispatch = useDispatch()

  const addTask = () => {
    setSubTask([...subTask, { taskName: "", isDone: false }]);
  };

  Modal.setAppElement("div");

  const handleClose = () => {
    dispatch(closeNoteModal())
  };

  const handleColor = (event: React.MouseEvent<HTMLDivElement>) => {
    const clickedDiv = event.currentTarget as HTMLDivElement;
    if(clickedDiv.id === "white"){
      setColor("bg-white");
    }else{
      setColor("bg-" + clickedDiv.id + "-100");
    }
  };

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      padding: "0px",
      overflow: "inherit"
    },
  };

  const updateTaskName = async(index: number, newTaskName: string, status: boolean) => {
    setSubTask((prevState) => {
      const updatedSubTask = [...prevState];
      updatedSubTask[index] =  {taskName: newTaskName, isDone: status};
      return updatedSubTask;
    });



  };

  const deleteTask =(index: number)=>{
    setSubTask((prevState)=>{
      const updatedSubTask = [...prevState];
      updatedSubTask.splice(index, 1)
      return updatedSubTask
    })
  }


  const handleNoteSave = async()=>{
    const noteObj:{ [key: string]: any } = {
      noteTitle: noteTitle,
      noteDesc: noteDesc,
      noteTags: selectedTags,
      time: serverTimestamp(),
      sharigType: "personal",
      noteType: noteModal.noteType,
      noteColor: color,
      pinned: noteModal.pinned ? noteModal.pinned : false,
      belongTo: `${noteModal.sharingType === "personal" ? note.noteId : shareCollection.shareCollId}`,
      archive: false,
      ownedBy: user.userId,
      collName: `${noteModal.sharingType === "personal" ? note.noteCollName : shareCollection.shareCollName}`,
    }
    if(props.type === "shared"){
      noteObj["edited"] = [user.userId,]
    }
    console.log(noteObj)

    if(noteModal.actionType === "add"){
      if(noteModal.noteType === 'task'){
        if(props.type === "shared"){
          noteObj["assignedTo"] = personName
        }
        try {
          await addDoc(noteCollRef, {
           ...noteObj,
            subTasks: subTask,
            allDone: false,
          })
          toast.success("Note Saved Successfully!", {autoClose: 2000,
            position: toast.POSITION.BOTTOM_RIGHT
          });
        } catch (error) {
          toast.error("Something went wrong!", {autoClose: 2000,
            position: toast.POSITION.BOTTOM_RIGHT
          });
        }
       
      }else{
        try {
          await addDoc(noteCollRef, {
            ...noteObj,
             subTasks: subTask,
           })
           toast.success("Note Saved Successfully!", {autoClose: 2000,
            position: toast.POSITION.BOTTOM_RIGHT
          });
        } catch (error) {
          toast.error("Something went wrong!", {autoClose: 2000,
            position: toast.POSITION.BOTTOM_RIGHT
          });
        }
      
      }
      if(noteModal.sharingType === "shared"){
        await addDoc(collection(db, "notification"), {
          collection: shareCollection.shareCollId,
          photo: user.photo,
          time: serverTimestamp(),
          sentTo: members,
          by: user.email,
          readt: [],
          message: `${user.name === null ? "GuestUser" : user.name} added a new ${noteModal.noteType} named "${noteTitle}" in #${shareCollection.shareCollName}`
        })
      }
     handleClose()
    }else if(noteModal.actionType === "edit"){
      console.log("this one is edit which is called")
      if(props.type === "shared"){ 
  
        if(!noteModal.edited.includes(user.userId)){
          noteObj["edited"] = [...noteModal.edited,user.userId]
        }
      }
      const noteRef = doc(db, `${noteModal.sharingType === "personal" ? "notes" : "sharedNotes"}`, noteModal.noteId)

      if(noteModal.noteType === 'task'){
        if(props.type === "shared"){
          noteObj["assignedTo"] = personName
        }
        try {
           await updateDoc(noteRef, {
         ...noteObj,
          subTasks: subTask,
          allDone: false,
        })
        toast.success("Note Updated Successfully!", {autoClose: 2000,
          position: toast.POSITION.BOTTOM_RIGHT
        });
        } catch (error) {
          toast.error("Something went wrong!", {autoClose: 2000,
            position: toast.POSITION.BOTTOM_RIGHT
          });
        }
       
      }else{
        try {
           await updateDoc(noteRef, {
          ...noteObj,
           subTasks: subTask,
         })
         toast.success("Note Updated Successfully!", {autoClose: 2000,
          position: toast.POSITION.BOTTOM_RIGHT
        });
        } catch (error) {
          toast.error("Something went wrong!", {autoClose: 2000,
            position: toast.POSITION.BOTTOM_RIGHT
          });
        }
       
      }
      if(noteModal.sharingType === "shared"){
        await addDoc(collection(db, "notification"), {
          collection: shareCollection.shareCollId,
          photo: user.photo,
          time: serverTimestamp(),
          sentTo: members,
          by: user.email,
          readt: [],
          message: `${user.name === null ? "GuestUser" : user.name} added a new ${noteModal.type} named "${noteTitle}" in  #${shareCollection.shareCollName}`
        })
      }
      handleClose()
    }
  }


  const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


  const addTags = async (value :string, label :string)=>{
 await addDoc(collection(db, "tags"), {
  value: value,
  label: label,
  collection: `${noteModal.sharingType === "personal" ? note.noteId : shareCollection.shareCollId}`,
 })
  }

  useEffect(()=>{
getMembers()
  }, [])

  return (
    <Modal style={customStyles} isOpen={noteModal} >
      <div className="bg-slate-200  z-10   flex items-center no-scrolll justify-center">
        <div
          className={`${color} w-screen max-w-xs sm:max-w-lg p-3 no-scrolll opacity-100`}
        >
          <h1 className="text-xl font-medium px-3 mb-3">{noteModal.actionType} {noteModal.noteType}</h1>
          <input
          value={noteTitle}
          onChange={(e)=>{setNoteTitle(e.target.value)}}
            type="text"
            placeholder={`${noteModal.noteType} title`}
            className="bg-transparent text-gray-800 border-0 outline-0 border-b border-black text-xl font-medium px-3 py-1 w-full"
          />
          <textarea
          value={noteDesc}
          onChange={(e)=>{setNoteDesc(e.target.value)}}
            name="name"
            className="bg-transparent text-gray-800 resize-none w-full outline-none border-0 outline-0  text-base font-normal px-3 py-1 mt-3"
            placeholder={`${noteModal.noteType} description`}
            cols={30}
            rows={noteModal.noteType === "note" ? 5 : 3}
          ></textarea>

{noteModal.noteType === "task" && (
            <div className="w-full my-3 items-center">
              <div>

              {subTask && 
              subTask?.map((e, index) => (
        <SubTask
          key={index}
          taskName={e.taskName}
          isDone={e.isDone}
          onChange={(newTaskName, status) => updateTaskName(index, newTaskName, status)}
          onDelete={()=> deleteTask(index) }
        />
      ))}
              </div>
              <div className="text-slate-600 cursor-pointer" onClick={addTask}><AddRoundedIcon />  add sub task</div>
            </div>
          )}

          <CreatableReactSelect
            className="bg-transparent"
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                backgroundColor: state.isFocused
                  ? "transparent"
                  : "transparent",
              }),
              option: (provided, state) => ({
                ...provided,
                backgroundColor: state.isSelected
                  ? "transparent"
                  : state.isFocused
                  ? "transparent"
                  : "transparent",
                color: state.isSelected ? "white" : "black",
                cursor: "pointer",
              }),
            }}
            onCreateOption={(label) => {
              const valueId = uuidv4()
              setSelectedTags([
                ...selectedTags,
                { label: label, value: valueId },
              ]);
              addTags(valueId, label);
            }}
            value={selectedTags}
            options={noteAllTags?.docs.map((e)=>{
              return {value: e.data().value, label: e.data().label}
            })}
            onChange={(tags) =>
              setSelectedTags(
                tags.map((tag) => {
                  return { label: tag.label, value: tag.value };
                })
              )
            }
            isMulti
          />
<div className="bg-red-300">

</div>
<div className="bg-blue-300">

</div>
<div className="bg-yellow-300">

</div>
<div className="bg-green-300">

</div>
<div className="bg-slate-300">

</div>
          <div className="w-full flex gap-2 my-3">
            <div
              onClick={handleColor}
              id="white"
              className={`h-6 w-6 cursor-pointer bg-white rounded-full ${
                color === "bg-white" && "outline outline-2 outline-black"
              }`}
            />
            <div
              onClick={handleColor}
              id="red"
              className={`h-6 w-6 cursor-pointer bg-red-300 rounded-full ${
                color === "bg-red-100" && "outline outline-2 outline-black"
              }`}
            />
            <div
              onClick={handleColor}
              id="blue"
              className={`h-6 w-6 cursor-pointer bg-blue-300 rounded-full ${
                color === "bg-blue-100" && "outline outline-2 outline-black"
              }`}
            />
            <div
              onClick={handleColor}
              id="green"
              className={`h-6 w-6 cursor-pointer bg-green-300 rounded-full ${
                color === "bg-green-100" && "outline outline-2 outline-black"
              }`}
            />
            <div
              onClick={handleColor}
              id="yellow"
              className={`h-6 w-6 cursor-pointer bg-yellow-300 rounded-full ${
                color === "bg-yellow-100" && "outline outline-2 outline-black"
              }`}
            />
            <div
              onClick={handleColor}
              id="slate"
              className={`h-6 w-6 cursor-pointer bg-slate-300 rounded-full ${
                color === "bg-slate-100" && "outline outline-2 outline-black"
              }`}
            />
          </div>
         

       

          {
            props.type === "shared" && noteModal.noteType === "task" && <div>
            <FormControl sx={{ m: 1, width: 300 }}>
              <InputLabel id="demo-multiple-chip-label">Assigned to</InputLabel>
              <Select
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                multiple
                value={personName}
                onChange={handleChange}
                input={<OutlinedInput id="select-multiple-chip" label="Assiged to" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {membersOptions.map((name) => (
                  <MenuItem
                    key={name}
                    value={name}
                    style={getStyles(name, personName, theme)}
                  >
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
           
          }
           <div className="flex gap-2">
            <Button
            disabled={noteTitle.length <= 2 && noteDesc.length === 0}
            
            className="!bg-slate-600 disabled:!text-gray-400"
              onClick={handleNoteSave}
              variant="contained"
              startIcon={<CheckRoundedIcon />}
            >
              Save
            </Button>
            <Button
            className="!bg-slate-600"
              onClick={handleClose}
              variant="contained"
              startIcon={<CloseRoundedIcon />}
            >
              Cancel
            </Button>
          </div>

          <IconButton
            onClick={handleClose}
            className="!absolute top-1 right-1 !text-red-600"
          >
            <CloseRoundedIcon fontSize="large" />
          </IconButton>
        </div>
      </div>
    </Modal>
  );
}

export default AddNoteModal;
