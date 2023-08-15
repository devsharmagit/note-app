import { collection, query, where } from 'firebase/firestore'
import React from 'react'
import { useCollection } from 'react-firebase-hooks/firestore'
import { db } from '../config/firebase'
import { useSelector } from 'react-redux'
import ShareCollItem from './ShareCollItem'


function ShareCollList() {

    const user = useSelector((state :any)=> state.appRedux.userDetails)

    const q = query(collection(db, "sharedColl"), where("members", "array-contains", user.userId))
    const [shareColl, loading, error] = useCollection(q)

  return (
    <div>
      {shareColl?.docs.map((e)=>{
        return <ShareCollItem name={e.data().collectionName} members={e.data().members} collId={e.id} />
      })}
    </div>
  )
}

export default ShareCollList
