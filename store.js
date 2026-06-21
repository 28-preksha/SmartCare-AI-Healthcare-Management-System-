import { configureStore } from '@reduxjs/toolkit';

// Safe check to prevent JSON.parse from crashing the app on undefined/null data
const safeParse = (key) => {
  try {
    const data = localStorage.getItem(key);
    if (!data || data === "undefined") return null;
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
};

// Clear store configuration without demanding external authSlice files
export const store = configureStore({
  reducer: {
    // Temporary empty reducer to keep the Provider happy without breaking imports
    auth: (state = { user: safeParse('user'), token: localStorage.getItem('token') || null }) => state,
  },
});