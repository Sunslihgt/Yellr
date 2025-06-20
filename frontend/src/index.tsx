import React from 'react';
import { createRoot } from 'react-dom/client';
import './main.css';
import Navbar from './components/Navbar';
import MessageCard from './components/MessageCard';
import Footer from './components/Footer';
import UserCard from './components/UserCard';
// import App from './App';

const container = document.getElementById('root');
if (container === null) {
    throw new Error('Something went wrong!');
}

const root = createRoot(container)

root.render(
    <React.StrictMode>
        <div className='bg-gray-100 dark:bg-gray-800 min-h-screen flex flex-col'>
            <Navbar />
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 p-4">
                
                <div className="lg:col-span-3">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm h-[calc(100vh-8rem)] overflow-hidden">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">What's new ?</h1>
                        </div>
                        <div className="overflow-y-auto h-[calc(100%-4rem)] scrollbar-hide">
                            <MessageCard />
                            <MessageCard />
                            <MessageCard />
                            <MessageCard />
                            <MessageCard />
                            <MessageCard />
                            <MessageCard />
                            <MessageCard />
                            <MessageCard />
                            <MessageCard />
                            <MessageCard />
                            <MessageCard />
                            <MessageCard />
                            <MessageCard />
                            <MessageCard />
                        </div>
                    </div>
                </div>
                
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm h-[calc(100vh-8rem)] overflow-hidden">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Friends</h1>
                        </div>
                        <div className="overflow-y-auto h-[calc(100%-4rem)] p-4 scrollbar-hide">
                            <UserCard />
                            <UserCard />
                            <UserCard />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    </React.StrictMode>
);
