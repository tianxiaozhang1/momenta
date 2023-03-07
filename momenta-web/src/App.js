import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { RecoilRoot } from 'recoil';

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import EditPage from './pages/EditPage'
import MomentPage from './pages/MomentPage'
import Header from './components/Header'
import Footer from './components/Footer';
import Modal from './components/Modal';

function App() {
  return (
      <div className="App">
          <RecoilRoot>

              <Header />
              <Modal />

              <Router>
                        
                  <AuthProvider>

                      <Routes>                        
                          <Route path="/" exact element={<HomePage />}></Route>
                          <Route path="/user/:userId" exact element={<ProfilePage />}></Route>
                          <Route path="/moment/:momentId" exact element={<MomentPage />}></Route>
                          <Route path="/edit" exact element={<EditPage />}></Route>
                      </Routes>

                  </AuthProvider>

                        <Routes>    
                            <Route path="/:login" element={<LoginPage />}></Route>
                            <Route path="/:register" element={<LoginPage />}></Route>
                        </Routes>


                  <Footer />
              </Router>

          </RecoilRoot>
      </div>
  );
}

export default App;