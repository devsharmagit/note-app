import React, { useEffect, useState } from 'react'
import { useStateManager } from 'react-select';
import { Button, IconButton } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

type SubTaskProps = {
    taskName: string;
    isDone: boolean;
    onChange: (newTaskName :string, isDone :boolean) => void;
    onDelete: ()=> void;
  };

function SubTask({taskName, isDone, onChange, onDelete }: SubTaskProps) {

    const [done, setDone] = useState<boolean>(isDone)
    const [newTaskname, setNewTaskName] = useState<string>("")

   useEffect(()=>{
    onChange(newTaskname, done)
   }, [newTaskname, done])
  return (
    <div className='flex items-center'>
    <input 
      type="checkbox"
      name="checkbox"
      id="checkbox"
      className="h-5 w-5 mr-2  text-indigo-600 transition duration-150 ease-in-out"
     checked={done}
     onChange={(e)=>{setDone(e.target.checked)}}
    />
    <input
     value={taskName}
     onChange={(e)=>{setNewTaskName(e.target.value)}}
      type="text"
      placeholder="sub task title"
      className="bg-transparent border-0 flex-1 outline-0 outline-none border-b border-black text-base  px-1 py-1 "
    />
    <IconButton onClick={()=>{onDelete()}} >
        <CloseRoundedIcon />
    </IconButton>
    
  </div>
  )
}

export default SubTask
