import React, {useContext} from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import '../App.css';
import { useRecoilState, RecoilRoot } from 'recoil';
import { modalState} from '../atoms/modalAtom';
import TopRightMenu from './TopRightMenu';

function Header () {

    // let {user, logoutUser} = useContext(AuthContext)
    const [open, setOpen] = useRecoilState(modalState);
        
    return (

      <div className='App-header shadow-sm border-b sticky top-0 z-50'>
          <div className='Title absolute inset-y-0 pl-3 flex items-center'>
              <a href='/'><h2 className='bg-white'>momenta</h2></a>
          </div>

          
          <div className='flex justify-end bg-white'>
                <h2 onClick={() => setOpen(true)} className='mt-9 mr-8 bg-white cursor-pointer'>share</h2>

                
          </div>

      </div>

    )
}

export default Header