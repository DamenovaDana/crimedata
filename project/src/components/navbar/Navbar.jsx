import { ArrowDropDown, Shield } from '@mui/icons-material';
import './navbar.scss';
import {useState } from 'react';
import {Link} from 'react-router-dom';

const Navbar = () => {

  const [isScrolled, setIsScrolled] = useState(false);

  window.onscroll = () =>{
    setIsScrolled(window.pageYOffset === 0 ? false : true);
    return () => (window.onscroll =null);
  };
  return (
    <div className={isScrolled ? "navbar scrolled" : "navbar  "}>
      <div className='container'>
        <div className="left">   
          <Shield className="icon"/>
          <h2>Crime Detector</h2>
        </div>
        <div className="right">
            <Link to='/' className='link'>
              <span>Regression</span>
            </Link>
            <Link to='/wcrimes' className='link'> 
              <span>Regression with Crimes</span>
            </Link> 
            <Link to='/classification' className='link'> 
              <span>Classification</span>
            </Link>
            <Link to='/columns' className='link'> 
              <span>Manual training</span>
            </Link>
            <Link to='/results' className='link'> 
              <span>Saved Results</span>
            </Link>
            <Link to='/charts' className='link'> 
              <span>Crime Statistics</span>
            </Link>
            
        </div>
      </div>
    </div>
  )
}

export default Navbar
