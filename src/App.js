import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import './style.css';
import { Home, Dashboard, Login, Signup, Profile } from './pages';
import { Layout, ProtectedLayout } from './components/layout';
import { AuthContext } from './context/AuthContext';

function App() {
  const { currentUser } = useContext(AuthContext);

  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={ <Layout /> }>
            <Route path="/signup" element={ <Signup /> } />
            <Route path="/login" element={ <Login /> } />
        
            <Route path="/home" element={ <Home /> } />
            <Route path="/dashboard" element={ <Dashboard /> } />
            <Route path="/profile" element={ <Profile /> } />
          </Route>
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
