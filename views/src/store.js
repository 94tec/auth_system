import { configureStore, createSlice, combineReducers } from '@reduxjs/toolkit';

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    user: null,
  },
  reducers: {
    loginSuccess(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logoutSuccess(state) {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;

// Message slice
const messageSlice = createSlice({
  name: 'message',
  initialState: {
    content: '',
    type: '',
  },
  reducers: {
    setMessage(state, action) {
      state.content = action.payload.content;
      state.type = action.payload.type;
    },
    clearMessage(state) {
      state.content = '';
      state.type = '';
    },
  },
});

export const { setMessage, clearMessage } = messageSlice.actions;
// Async action to clear message after a delay
export const setMessageWithTimeout = (message, timeout = 9000) => (dispatch) => {
  dispatch(setMessage(message));

  setTimeout(() => {
    dispatch(clearMessage());
  }, timeout);
};


// Combine reducers
const rootReducer = combineReducers({
  auth: authSlice.reducer,
  message: messageSlice.reducer, // Use messageSlice.reducer instead of messageSlice itself
});

// Configure store
const store = configureStore({
  reducer: rootReducer,
});

export default store;
