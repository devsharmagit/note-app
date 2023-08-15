import { collection, orderBy, query, where } from 'firebase/firestore'
import React, {useEffect} from 'react'
import { useCollection } from 'react-firebase-hooks/firestore'
import { useDispatch, useSelector } from 'react-redux'
import { auth, db } from '../config/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import NotificationItem from './NotificationItem'
import { closeNewNotification, openNewNotification } from '../redux/userSlice'

function Notification() {

    const userDetails = useSelector((state :any)=> state.appRedux.userDetails)
    const isNotificationOpen = useSelector((state :any)=> state.appRedux.notificationOpen)

    const [user1, loading, error] = useAuthState(auth)

    const q = query(collection(db, "notification"), where("sentTo", "array-contains", user1?.uid), orderBy("time", "desc"))

    const [notifications, loading1, error1] = useCollection(q)

    const dispatch = useDispatch()

const checkNewNotification = ()=>{
  let me:boolean = false;
  notifications?.docs.forEach((e)=>{
    if(!e.data().readt.includes(user1?.uid)){
      console.log("readt function and positive value is here")
      dispatch(openNewNotification())
      me = true;
    }
  })
  if(!me){
    dispatch(closeNewNotification())
  }
  console.log("new notification function is completed here")
}
    
useEffect(()=>{
checkNewNotification()
}, [notifications, isNotificationOpen])
    

  return (
    <div className={`bg-slate-800 w-80 h-full p-2 origin-top-right right-0 opacity-100 absolute z-10 transition-transform ${isNotificationOpen ? "w-64 scale-x-100": "scale-x-0 opacity-0"}`}>
     {
        notifications?.docs.map((e)=>{
            return <NotificationItem  docId={e.id} readBy={e.data().readt} key={e.id} photo={e.data().photo} message={e.data().message as string} />
        })
     }
    </div>
  )
}

export default Notification
