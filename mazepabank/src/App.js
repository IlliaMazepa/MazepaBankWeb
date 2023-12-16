import './App.css';
import LogIn from './components/Login/LogIn';
import TestComponent from './components/test';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './components/Main/Main';
import SignUp from './components/SignUp/SignUp'
import Transactions from './components/Transactions/Transactions';
import Currencies from './components/Currencies/Currencies';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<LogIn/>} />
          <Route path="/Transactions" element={<Transactions/>} />
          <Route path="/Currencies" element={<Currencies/>} />
          <Route path="/new-page" element={<MainPage/>} />
          <Route path="/SignUp" element={<SignUp/>} />
        </Routes>
      </Router>
      
    </div>
  );
}

export default App;
