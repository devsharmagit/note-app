import { collection, query, where } from 'firebase/firestore'
import { useCollection } from 'react-firebase-hooks/firestore'
import { db } from '../config/firebase'
import { useSelector } from 'react-redux'
import ShareCollItem from './ShareCollItem'
import emptyImg from "../assets/images/empty-box.png"
import Skeleton from '@mui/material/Skeleton';


function ShareCollList() {

    const user = useSelector((state :any)=> state.appRedux.userDetails)

    const q = query(collection(db, "sharedColl"), where("members", "array-contains", user.userId))
    const [shareColl, loading] = useCollection(q)

  return (
    <div className='w-full'>

{
  loading && <div className='mt-5'>
    <Skeleton  width={300} height={200} animation="wave" variant="rectangular" />
    <Skeleton  width={300} height={200} animation="wave" variant="rectangular" />
    <Skeleton  width={300} height={200} animation="wave" variant="rectangular" />
  </div>
}

{shareColl?.empty && 
<div className='w-full flex flex-col justify-center items-center'>
<img className='w-32 h-32 object-cover' src={emptyImg}  />
        <p className="font-medium text-xl mb-2 text-slate-700">No Shared Collections to show.</p>
        <p className="font-medium text-xl mb-2 text-slate-700">Make a Shared Collection and add Notes there.</p>
</div>
}

<div className='flex flex-wrap gap-3'>

      {shareColl?.docs.map((e)=>{
        return <ShareCollItem key={e.id} name={e.data().collectionName} members={e.data().members} collId={e.id} />
      })}
      </div>
    </div>
  )
}

export default ShareCollList
