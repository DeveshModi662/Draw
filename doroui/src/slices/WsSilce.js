import { createSlice } from '@reduxjs/toolkit'

export const ssoSlice = createSlice({
  name: 'wsclient',
  initialState: {
    wsClient : () => {}
  },
  reducers: {
    removeCursor: (state) => {
        console.log('removeCursor', state) ;      
        state.wsClient() ;
    },
    addRemover: (state, action) => {
        console.log('loginUser', state, action) ;           
        state.user = action.user ;
        state.jsonWebToken = action.jsonWebToken
        state.isLoggedIn = true ;             
    }
  },
})

export const { removeCursor, addRemover } = wsSlice.actions

export default wsSlice.reducer