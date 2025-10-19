import DescriptionIcon from '@mui/icons-material/Description';
import SunnyIcon from '@mui/icons-material/Sunny';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LogoutIcon from '@mui/icons-material/Logout';

import { NavLink } from 'react-router-dom'
import { useContextAPI } from '../ContextAPI.jsx';

export default function Header() {
    const { theme, toggleTheme } = useContextAPI();

    const handleThemeToggle = () => {
        toggleTheme(theme === 'light' ? 'dark' : 'light');
    }

    return (
      <header className="w-full sticky top-0 left-0 z-50">
        
        <nav className='px-2 sm:px-4 py-2.5'>
        
          <div className='flex flex-wrap justify-between items-center mx-auto max-w-screen-xl'>
                  
            <NavLink to='/'>
              <div className='flex justify-center items-center lg:ml-20 sm:gap-2 gap-1'>
                  <DescriptionIcon fontSize="large" className=""/>
                  <span className='text-[28px] sm:text-3xl font-semibold'>TODO List</span>
              </div>
            </NavLink>

            <div className='flex justify-center items-center gap-2 lg:mr-30'>
                      
              {/* Single toggle button instead of two separate buttons */}
              <button  onClick={handleThemeToggle} className='cursor-pointer'>
                
                { theme === 'light' ? (
                    <DarkModeIcon 
                        fontSize="medium" 
                        className={`transition-colors duration-300 ${
                            theme === 'light' ? 'text-zinc-900 ' : 'text-gray-300'
                        }`} 
                    /> ) : (
                    <SunnyIcon 
                        fontSize="medium" 
                        className={`transition-colors duration-300 ${
                            theme === 'dark' ? 'text-zinc-300' : 'text-gray-700'
                        }`} 
                    />)
                }

              </button>                
            
            <NavLink to='/login'>
              
              <button className={`cursor-pointer font-bold text-2xl hover:scale-110 
                ${ theme === 'dark' ? ''  : '' }`}>
                  Login
              </button>
            
            </NavLink>
                  
            </div>
          
          </div>
        
        </nav>
      
      </header>
    );
}