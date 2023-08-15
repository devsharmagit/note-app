import React, {useState} from 'react'
import AddNoteButton from './AddNoteButton'
import NoteList from './NoteList'
import { useDispatch, useSelector } from 'react-redux'
import { IconButton } from "@mui/material";
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { setNoteCollection, setShareColl } from '../redux/noteSlice';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

function ShareNoteDisplay() {

  const shareCollection = useSelector((state :any)=> state.note.shareCollection)
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const handleClose = async(isTrue :boolean)=>{
    if(isTrue === true){
  setOpen(false)
  const collRef = doc(db, "sharedColl", shareCollection.shareCollId)
  const q = query(collection(db, "sharedNotes"), where("belongTo", "==", shareCollection.shareCollId))
  const data = await getDocs(q)
  data.docs.map( async(document)=>{
    const docRef = doc(db, "sharedNotes", document.id)
    await deleteDoc(docRef)
  
  })
  await deleteDoc(collRef)
  
  dispatch(setShareColl(null))
    }else{
  setOpen(false)
    }
  }
  
  const handleDelete =()=>{
    setOpen(true)
  }

  return (<>
      <div className='flex items-center justify-between'>
            <span className='text-3xl font-semibold text-gray-700'> # {shareCollection.shareCollName} </span> <IconButton onClick={handleDelete}> <DeleteRoundedIcon /> </IconButton>
          </div>
          <AddNoteButton type="shared"/>
          <NoteList type="shared" />
{/* <NoteList /> */}
<Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Do you want to delete the collection?"}
        </DialogTitle>
        
        <DialogActions className='!pb-3'>
          <Button className='!bg-red-500 !text-white !font-medium !py-1' onClick={()=>{handleClose(false)}}>Cancel</Button>
          <Button className='!bg-slate-800 !text-white !font-medium !py-1' onClick={()=>{handleClose(true)}} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
  </>
    
  )
}

export default ShareNoteDisplay
