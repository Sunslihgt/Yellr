import React from 'react';
import { createRoot } from 'react-dom/client';
import './main.css';
// import App from './App';

const container = document.getElementById('root');
if (container === null) {
    throw new Error('Something went wrong!');
}

const root = createRoot(container)

root.render(
    <React.StrictMode>
        <h1 className="text-3xl font-bold underline">Bonjour Tailwind !</h1>
        {/* <App /> */}
    </React.StrictMode>
);
