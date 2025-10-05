import { configureStore } from '@reduxjs/toolkit' ;
import SsoReducer from '../slices/SsoSlice' ;

export default configureStore(
    {
        reducer : {
            sso : SsoReducer,
        },
    }
) ;