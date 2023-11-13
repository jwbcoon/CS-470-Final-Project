import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import MasterDataProvider from './util/DataContexts.js';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <MasterDataProvider>
            <App />
        </MasterDataProvider>
    </React.StrictMode>
);

