// import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
// import PrivateRoute from './utils/PrivateRoute'
import { AuthProvider } from './context/AuthContext'

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import Header from './components/Header'

function App() {
  return (
    <div className="App" style={{backgroundColor: "#F5F3F2"}}>
      
        <Router>
            <AuthProvider>
                <Header />
                
                <Routes>
                    {/* <Route element={HomePage} path="/" exact/> */}
                    <Route path="/" exact element={<HomePage />}></Route>
                    <Route path="/login" element={<LoginPage />}></Route>
    
                </Routes>

            </AuthProvider>
        </Router>
        
    </div>
  );
}

export default App;