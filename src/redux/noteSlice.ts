import { createSlice } from '@reduxjs/toolkit';

const noteSlice = createSlice({
  name: 'note',
  initialState:{
    path: "home",
    noteCollection: null,
    noteModal: null,
    noteArchive: false,
    sharedCollModal: false,
    shareCollection: null,
    copiedNotes: null,
    selectedNotes: null,
    globalSelectNote: false,
  },
  reducers: {
    setNoteCollection: (state, action) => {
      state.noteCollection = action.payload;
    },
    openNoteModal: (state, action)=>{
      state.noteModal = action.payload
    },
    closeNoteModal: (state) =>{
      state.noteModal = null
    },
    openNoteArchive: (state) =>{
      state.noteArchive = true
    },
    closeNoteArchive: (state)=> {
      state.noteArchive = false
    },
    openSharedCollModal: (state)=>{
      state.sharedCollModal = true
    },
    closeSharedCollModal: (state)=>{
      state.sharedCollModal = false
    },
    setShareColl: (state, action)=>{
      state.shareCollection = action.payload
    },
    setPath: (state, action)=>{
      state.path = action.payload
    },
    setCopiedNotes: (state, action)=>{
      state.copiedNotes = action.payload
    },
    setSelectedNotes: (state, action)=>{
      state.selectedNotes = action.payload
    },
    setGlobalSelectNote: (state, action)=>{
      state.globalSelectNote = action.payload
    }
  },
});

export const { setNoteCollection,setGlobalSelectNote,setSelectedNotes,setPath,setCopiedNotes, openNoteModal, closeNoteModal, openNoteArchive, closeNoteArchive, openSharedCollModal,setShareColl, closeSharedCollModal } = noteSlice.actions;

export default noteSlice.reducer;
