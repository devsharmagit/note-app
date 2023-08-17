import { collection, orderBy, query, where } from 'firebase/firestore'
import  {useEffect} from 'react'
import { useCollection } from 'react-firebase-hooks/firestore'
import { useDispatch, useSelector } from 'react-redux'
import { auth, db } from '../config/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import NotificationItem from './NotificationItem'
import { closeNewNotification, openNewNotification } from '../redux/userSlice'
import bell from "../assets/images/bell2.png"

function Notification() {

    const isNotificationOpen = useSelector((state :any)=> state.appRedux.notificationOpen)

    const [user1] = useAuthState(auth)

    const q = query(collection(db, "notification"), where("sentTo", "array-contains", user1?.uid), orderBy("time", "desc"))

    const [notifications] = useCollection(q)

    const dispatch = useDispatch()

const checkNewNotification = ()=>{
  let me:boolean = false;
  notifications?.docs.forEach((e)=>{
    if(!e.data().readt.includes(user1?.uid)){
      dispatch(openNewNotification())
      me = true;
    }
  })
  if(!me){
    dispatch(closeNewNotification())
  }
}
    
useEffect(()=>{
checkNewNotification()
}, [notifications, isNotificationOpen])
    

  return (
    <div className={`bg-slate-800 w-80 h-full overflow-scroll no-scrolll p-2 origin-top-right right-0 opacity-100 absolute z-10 transition-transform ${isNotificationOpen ? "w-64 scale-x-100": "scale-x-0 opacity-0"}`}>
      {notifications?.empty && <div className='w-full flex justify-center items-center gap-2 flex-col'>
<img className='h-10 w-10 object-cover' src={bell} />
        <p className='text-white'>Notifications will be shown here</p>
      </div>
        }
     {
        notifications?.docs.map((e)=>{
            return <NotificationItem  docId={e.id} readBy={e.data().readt} key={e.id} photo={e.data().photo} message={e.data().message as string} />
        })
     }
    </div>
  )
}

export default Notification
