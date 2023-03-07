import React, {useState, useEffect, useContext} from 'react'
import AuthContext from '../context/AuthContext'
import '../App.css';
import dayjs from 'dayjs';
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

function Post({ id, username, img, caption, owner_id, created }) {

    const profileUrl = 'http://127.0.0.1:3000/user/'+owner_id+'/'

    var relativeTime = require('dayjs/plugin/relativeTime')
    dayjs.extend(relativeTime)

    let {authTokens, logoutUser} = useContext(AuthContext)
    let [user, setUser] = useState(()=>localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null)

    let [ownPost, setOwnPost] = useState(false)

    let [deleteMode, setDeleteMode] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        getProfile()

        if (user.user_id === owner_id) {
            setOwnPost(true)
        }
        
    }, [])

    const [profilePic, setProfilePic] = useState('');

    
    const deleteAction = async() => {
        console.log("Delete", 'http://127.0.0.1:8000/moments/'+id+'/')

        let deleteResponse = await fetch('http://127.0.0.1:8000/moments/'+id+'/', {
            method:'DELETE',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer ' + String(authTokens.access)
            }
        })

        navigate('/')
    }

    const tempClick = (e) => {
        console.log("NO")
    }

    let getProfile = async() =>{
        let profileResponse = await fetch('http://127.0.0.1:8000/profiles/'+owner_id+'/', {
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer ' + String(authTokens.access)
            }
        })
            let userData = await profileResponse.json()

            if (userData.profilepic !== null) {
                setProfilePic(userData.profilepic)
            } else {
                setProfilePic('https://avatars.githubusercontent.com/u/83477953')
            }
            
    }

    return (
        
        <div className='Post bg-white my-2 border rounded-lg'>
            <div className='flex items-center p-4'>
                <img src={profilePic}
                
                    className='rounded-full h-12 w-12
                    object-contain border p-1 mr-3' alt='' />
                <a href={profileUrl}><p className='flex-1 font-bold '>{username}</p></a>
                <p>&nbsp;&nbsp;</p><p className='text-gray-400 text-xs'>{dayjs(created).fromNow()}</p>
                
                {ownPost === true
                ?
                    deleteMode
                    ?
                    <div className='Float-right flex float-right text-red-500 cursor-pointer'>
                    <p onClick={() => setDeleteMode(false)}>are you sure?&nbsp;</p>
                    <p onClick={deleteAction}>yes</p><p onClick={() => setDeleteMode(false)}>&nbsp;/ no</p>
                    </div>
                    :
                    <p className='Float-right float-right text-gray-400 cursor-pointer' onClick={() => setDeleteMode(true)}>delete</p>
                    
                :
                <div></div>
                }

            </div>
            
            <img src={img} className="object-cover w-full" alt="" />

            <div className='flex justify-between px-4 pt-4'>
                <div className='flex space-x-4'>

                </div>
                
            </div>
            <div className='flex items-center p-3'>
                <a href={profileUrl}><img src={profilePic}
                    className='rounded-full h-10 w-10
                    object-contain border p-1 mr-3' alt='' /></a>
                
                <p>{caption}</p>

            </div>

            <form className='flex items-center p-4'>
                <input type='text'
                    placeholder='Add a comment...'
                    className='border-none flex-1 focus:ring-0 outline-none' />
                <button className='font-semibold text-blue-500'>Share</button>

            </form>
        </div>
    )
}

export default Post
