// // import React, { createContext, useEffect, useState, useReducer } from "react";
// // import AuthReducer from "./AuthReducer"

// // const INITIAL_STATE = {
// //     currentUser: JSON.parse(localStorage.getItem("user")) || { username: "Guest" },
// // }

// // export const AuthContext = createContext(INITIAL_STATE)

// // export const AuthContextProvider = ({ children }) => {
// //     const [ state, dispatch ] = useReducer(AuthReducer, INITIAL_STATE)

// //     useEffect(() => {
// //         localStorage.setItem("user", JSON.stringify(state.currentUser))
// //     }, [ state.currentUser ])

// //     console.log("currentUser in AuthContext:", state.currentUser);

// //     return (
// //         <AuthContext.Provider value={ { currentUser: state.currentUser, dispatch } }>
// //             { children }
// //         </AuthContext.Provider>
// //     )
// // }

// import { createContext, useEffect, useReducer } from "react";
// import AuthReducer from "./AuthReducer";
// import { auth } from "../firebase/firebase";

// const INITIAL_STATE = {
//     currentUser: JSON.parse(localStorage.getItem("user")) || {
//         username: "User",
//         userId: "",
//         email: ""
//     },
// };

// export const AuthContext = createContext(INITIAL_STATE);

// export const AuthContextProvider = ({ children }) => {
//     const [ state, dispatch ] = useReducer(AuthReducer, INITIAL_STATE);

//     useEffect(() => {
//         const unsubscribe = auth.onAuthStateChanged((user) => {
//            console.log("currentUser in AuthContext:", state.currentUser);

//             if (user) {
//                 const { uid, username, email } = user;
//                 dispatch({
//                     type: "SET_CURRENT_USER",
//                     payload: {
//                         username: user.displayName || "User",
//                         userId: user.uid,
//                         email: user.email,
//                     }
//                 });
//             } else {
//                 dispatch({ type: "SET_CURRENT_USER", payload: null });
//             }
//         });

//         return unsubscribe;
//     }, []);

//     return (
//         <AuthContext.Provider value={ { currentUser: state.currentUser, dispatch } }>
//             { children }
//         </AuthContext.Provider>
//     );
// };



// import React, { useState, useEffect, createContext } from 'react';
// import { getAuth, onAuthStateChanged } from 'firebase/auth';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//     const [ currentUser, setCurrentUser ] = useState(null);
//     const [ loading, setLoading ] = useState(true);

//     useEffect(() => {
//         const auth = getAuth();
//         const unsubscribe = onAuthStateChanged(auth, (user) => {
//             setCurrentUser(user);
//             setLoading(false);
//         });

//         return unsubscribe;
//     }, []);

//     return (
//         <AuthContext.Provider value={ { currentUser: currentUser } }>
//             { !loading && children }
//         </AuthContext.Provider>
//     );
// };

import React, { useState, useEffect, createContext } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [ currentUser, setCurrentUser ] = useState(null);
    const [ loading, setLoading ] = useState(true);

    const login = (user) => {
        setCurrentUser(user);
    };

    const logout = () => {
        setCurrentUser(null);
    };

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
            } else {
                setCurrentUser(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider value={ { currentUser, login, logout } }>
            { !loading && children }
        </AuthContext.Provider>
    );
};

