import React from 'react';
import { Outlet } from 'react-router-dom';
import ProtectedNav from './ProtectedNav'

const ProtectedLayout = () => {
    return (
        <main className="App">
            <ProtectedNav />
            <Outlet />
        </main>
    );
};

export default ProtectedLayout;

// import React, { useContext } from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import { AuthContext } from '../../context/AuthContext';
// import { Dashboard, Profile } from '../../pages';

// function ProtectedLayout({ children }) {
//     const { currentUser } = useContext(AuthContext);

//     return (
//         <>
//             { currentUser ? (
//                 <Routes>
//                     <Route path="/dashboard" element={ <Dashboard /> } />
//                     <Route path="/profile" element={ <Profile /> } />
//                     { children }
//                 </Routes>
//             ) : (
//                 <Navigate to="/login" />
//             ) }
//         </>
//     );
// }

// export default ProtectedLayout;

