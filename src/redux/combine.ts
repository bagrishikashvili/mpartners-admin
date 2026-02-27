import { combineReducers } from '@reduxjs/toolkit'

import auth from './authSlice';

const combineSlices = combineReducers({
    auth
});

export default combineSlices;