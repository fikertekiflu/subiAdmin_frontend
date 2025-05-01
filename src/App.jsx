import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import MainContent from './pages/MainContent'; // Assuming you have a MainContent component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/admin/*" 
          element={
            <div className="flex h-screen bg-gray-100">
              <Sidebar />
              <MainContent />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;