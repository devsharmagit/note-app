import React from 'react'
import Sidebar from './Sidebar'
import NotesConsole from './NotesConsole'
import { useSelector } from 'react-redux'
import ArchiveNotes from './ArchiveNotes'
import Notification from './Notification'



function Main() {

  const archiveNote = useSelector((state :any)=> state.note.noteArchive)

  return (
    <div style={{height: 'calc(100vh - 56px)'}} className="w-100 relative flex overflow-hidden bg-white ">

    <Sidebar  />
    {archiveNote ? <ArchiveNotes /> : <NotesConsole /> }
    <Notification />
    
    </div>
  )
}

export default Main
