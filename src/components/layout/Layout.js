import React from 'react';
import { Outlet } from 'react-router-dom';
import ProtectedNav from './ProtectedNav';

const Layout = () => {
    return (
        <main className="App">
            <ProtectedNav />
            <Outlet />
        </main>
    );
};

export default Layout;