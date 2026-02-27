
// Auth Selectors 
export const authSelector = (state: any) => state.auth;
export const tokenSelector = (state: any) => state.auth.token;
export const currentUserSelector = (state: any) => state.auth.currentUser;

//Errors
export const globalErrorSelector  = (state: any) => state.errorSlice.error