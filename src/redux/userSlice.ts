import { createSlice } from '@reduxjs/toolkit';


const userSlice = createSlice({
  name: 'user',
  initialState:{
    userDetails: null,
    notificationOpen: false,
    newNotification: false,
    isSidebarOpen: false,
  },
  reducers: {
    loginOfUser: (state, action) => {
      state.userDetails = action.payload;
    },
    openNoti: (state) =>{
      state.notificationOpen = true;
    },
    closeNoti: (state)=>{
      state.notificationOpen = false;
    },
    openNewNotification: (state)=>{
      state.newNotification = true;
    },
    closeNewNotification: (state)=>{
      state.newNotification = false;
    },
    openSidebar: (state)=>{
      state.isSidebarOpen = true;
    },
    closeSidebar:(state)=>{
      state.isSidebarOpen = false;
    }
  },
});

export const { loginOfUser, openNoti, closeNoti, openNewNotification, closeNewNotification, openSidebar, closeSidebar } = userSlice.actions;

export default userSlice.reducer;
