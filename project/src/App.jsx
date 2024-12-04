import './app.scss';
import Navbar from './components/navbar/Navbar';
import Classification from './pages/classification/Classification';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Home from './pages/home/Home';
import Regcrimes from './pages/regcrimes/Regcrimes';
import Columns from './pages/columns/Columns';

const App = () => {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/classification' element={<Classification/>} />
        <Route path='/wcrimes' element={<Regcrimes/>} />
        <Route path="/columns" element={<Columns />} /> 
      </Routes>
    </Router>
  )
}

export default App
