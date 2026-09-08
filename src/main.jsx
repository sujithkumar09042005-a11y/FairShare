import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { GroupsProvider } from './context/GroupsContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GroupsProvider>
      <App />
    </GroupsProvider>
  </React.StrictMode>
);
