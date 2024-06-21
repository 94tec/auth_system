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
    messages: [],
  },
  reducers: {
    setMessage(state, action) {
      state.messages = [{ content: action.payload.content, type: action.payload.type, id: new Date().getTime() }];
    },
    clearMessage(state) {
      state.messages = [];
    },
    setNewMessage(state, action) {
      state.messages.push({ content: action.payload.content, type: action.payload.type, id: new Date().getTime() });
    },
    clearSpecificMessage(state, action) {
      state.messages = state.messages.filter(message => message.id !== action.payload);
    },
  },
});

export const { setMessage, clearMessage, setNewMessage, clearSpecificMessage } = messageSlice.actions;

// Async action to clear message after a delay
export const setMessageWithTimeout = (message, timeout = 9000) => (dispatch) => {
  const id = new Date().getTime();
  dispatch(setNewMessage({ ...message, id }));

  setTimeout(() => {
    dispatch(clearSpecificMessage({ id }));
  }, timeout);
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authSlice.reducer,
  message: messageSlice.reducer,
  // Add additional reducers as needed
});

// Configure store
const store = configureStore({
  reducer: rootReducer
});

export default store;
