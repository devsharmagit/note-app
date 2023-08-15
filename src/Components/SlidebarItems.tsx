import { Avatar } from '@mui/material';
import React, { ReactComponentElement } from 'react'
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import AddNoteSidebar from './AddNoteSidebar';
import { useDispatch, useSelector } from 'react-redux';
import { jsx } from '@emotion/react';
import { closeNoteArchive, openNoteArchive, setNoteCollection, setPath, setShareColl } from '../redux/noteSlice';
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { setServers } from 'dns/promises';

type SidebarItemsProps ={
avatar?: boolean;
isCollection?: boolean;
icon?: boolean;
IconType?: React.ComponentType<{}>;
iconText?: string;
}

function SlidebarItems({avatar, isCollection, icon, IconType,iconText}: SidebarItemsProps) {

  const user = useSelector((state :any)=> state.appRedux.userDetails)
  const noteColl = useSelector((state :any)=> state.note.noteCollection)
  const notePath = useSelector((state :any)=> state.note.path)
  const dispatch = useDispatch()
 
  const handleLogout = async () => {
    await signOut(auth);
  };

const handleClick = ()=>{
  if(iconText === 'Archive'){
    dispatch(openNoteArchive())
    dispatch(setPath("archive"))
  }else if(iconText === 'Logout'){
    handleLogout()
    dispatch(setNoteCollection(null))
    dispatch(setShareColl(null))
    dispatch(setPath("home"))
  }else if(iconText === 'Home'){
    dispatch(closeNoteArchive())
    dispatch(setNoteCollection(null))
    dispatch(setShareColl(null))
    dispatch(setPath("home"))
  }
}

  return (
    <div className='w-full bg-slate-700  flex items-center '>
        {avatar && user &&  <div className='px-2 py-3 w-full flex items-center '>
          {user.photo ? 
            <Avatar sx={{ width: 56, height: 56 }} className='!w-[56] !h-[56]' src={user?.photo} />
          : <Avatar sx={{ width: 56, height: 56 }} className='!w-[56] !h-[56]'>G</Avatar>}
        <div className='ml-4'>
      <h2 className='text-white mb-0 text-2xl'> {user.name ? user.name : "Guest"} </h2>
      <p className='text-white opacity-80 text-sm '>{user.email ? user?.email : "Guest@note.com"}</p>
        </div>
        </div> }
    {
        isCollection && <>
        <AddNoteSidebar />
        </>
    }

    {
      IconType && <div onClick={handleClick} className={`flex gap-2 ${(iconText === "Archive" && notePath === "archive") ? "bg-slate-800" : "" } ${(iconText === "Home" && notePath === "home") ? "bg-slate-800" : "" } text-white cursor-pointer px-2 py-3 w-full hover:bg-slate-800 transition-all`}>
        <IconType />
        <span> {iconText} </span>
      </div>
    }

        
    </div>
  )
}

export default SlidebarItems
