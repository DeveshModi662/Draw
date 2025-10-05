import { createSlice } from '@reduxjs/toolkit'

export const ssoSlice = createSlice({
  name: 'sso',
  initialState: {
    user : '',
    jsonWebToken : '',
    isLoggedIn : false
  },
  reducers: {
    logoutUser: (state) => {
        console.log('logoutUser', state) ;      
        state.user = '' ;
        state.jsonWebToken = '' ;
        state.isLoggedIn = false ;      
    },
    loginUser: (state, action) => {
        console.log('loginUser', state, action) ;           
        state.user = action.user ;
        state.jsonWebToken = action.jsonWebToken
        state.isLoggedIn = true ;             
    },
  },
})

export const { logoutUser, loginUser } = ssoSlice.actions

export default ssoSlice.reducer