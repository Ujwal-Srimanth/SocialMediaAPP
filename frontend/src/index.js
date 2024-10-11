import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import authReducer from './state'; // Importing the authReducer from your state file

import { configureStore } from '@reduxjs/toolkit'; // Importing configureStore to create a Redux store
import { Provider } from 'react-redux'; // Importing Provider to wrap the App and provide the Redux store

import { 
    persistStore,    // Creates a persisted version of the Redux store
    persistReducer,  // Allows you to use reducers that persist the state
    FLUSH,           // Middleware actions for persistence
    REHYDRATE,       // Used to rehydrate the store with the persisted state
    PAUSE,           // Used to pause persistence
    PERSIST,         // Action to trigger persistence
    PURGE,           // Purges the persisted state
    REGISTER         // Registers the persisted store
} from 'redux-persist'; // Importing functionalities from redux-persist
import storage from "redux-persist/lib/storage";
import { PersistGate } from 'redux-persist/integration/react';

const persistConfig = {key:"root",storage,version:1}
const persistedReducer = persistReducer(persistConfig,authReducer)
const store = configureStore({
  reducer:persistedReducer,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH,REHYDRATE,PAUSE,PERSIST,PURGE,REGISTER],
      }
    })
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistStore(store)}>
      <App />
      </PersistGate>     
    </Provider>
   
  </React.StrictMode>
);