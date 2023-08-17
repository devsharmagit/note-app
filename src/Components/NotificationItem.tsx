import { doc, updateDoc } from 'firebase/firestore';
import {useEffect} from 'react'
import { useSelector } from 'react-redux';
import { auth, db } from '../config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import Avatar from '@mui/material/Avatar';

type NotiItemProps ={
    message: string;
    readBy: string[];
    docId: string;
    photo: string
}

function NotificationItem({message, readBy,photo, docId}:NotiItemProps) {

    const [user1] = useAuthState(auth)
    const notificationOpen = useSelector((state :any) => state.appRedux.notificationOpen)

    const checkRead = ()=>{
        if(user1?.uid && notificationOpen){
            if(!readBy.includes(user1?.uid)){
                console.log("checkRead function is called here")
                updateDoc(doc(db, "notification", docId), {
                    readt: [...readBy, user1?.uid]
                })
            }
        }
    }

    useEffect(()=>{
        checkRead()
    }, [notificationOpen])
    
  return (
    <div className='p-2 bg-slate-50 m-2 rounded-sm flex items-center gap-2'>
      <Avatar src={photo} /> <p className='leading-none '> {message} </p>
    </div>
  )
}

export default NotificationItem
