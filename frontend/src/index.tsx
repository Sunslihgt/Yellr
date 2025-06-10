import React from 'react';
import { createRoot } from 'react-dom/client';
// import App from './App';

const container = document.getElementById('root');
if (container === null) {
    throw new Error('Something went wrong!');
}

const root = createRoot(container)

root.render(
    <React.StrictMode>
        <h1>Hello world</h1>
        {/* <App /> */}
    </React.StrictMode>
);
