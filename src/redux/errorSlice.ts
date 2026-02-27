import { createSlice } from '@reduxjs/toolkit';

const errorSlice = createSlice({
    name: 'error',
    initialState: {},
    reducers: {
        setAccessDeniedObj(state: any, { payload }) {
            state.error = payload
        },
    },
});

export const { setAccessDeniedObj } = errorSlice.actions;

export default errorSlice.reducer;

