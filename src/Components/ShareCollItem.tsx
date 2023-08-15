import { AvatarGroup, Avatar, IconButton } from "@mui/material";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../config/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { useDispatch } from "react-redux";
import { setShareColl } from "../redux/noteSlice";

type ShareCollItemProps = {
    name: string,
    members: string[],
    collId: string,
}

function ShareCollItem({name, members, collId}:ShareCollItemProps) {

     
    const q = query(collection(db, "userDetails"), where("userId", "in", members))
const [photo] = useCollection(q)

const dispatch = useDispatch()

const handleClick =()=>{
  dispatch( setShareColl({shareCollId: collId, shareCollName: name}))
}
   

  return (
    <div onClick={handleClick} className='mt-5 cursor-pointer hover:bg-slate-200 transition-all hover:shadow-lg bg-white w-[300px] h-[200px] border-2 flex flex-col items-center justify-center border-gray-400 rounded-xl'>
      <p className='text-3xl font-bold '>#{name}</p>
      <AvatarGroup max={4} className="!w-fit mt-2">
        {photo?.docs.map((e)=>{
            return  <Avatar src={e.data().photo}/>
        })}
        </AvatarGroup>
    </div>
  )
}

export default ShareCollItem
