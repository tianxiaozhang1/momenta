import React, {useState, useEffect, useContext} from 'react'
import AuthContext from '../context/AuthContext'
import jwt_decode from "jwt-decode";
import { useParams } from "react-router-dom";
import '../App.css';

const ProfilePage = () => {

    let { userId, IDNumber } = useParams();
    let [moments, setMoments] = useState([])
    let {authTokens, logoutUser} = useContext(AuthContext)
    let [user, setUser] = useState(()=>localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null)

    let [displayName, setDisplayName] = useState([])
    let [profileData, setProfileData] = useState([])
    let [ownAccount, setOwnAccount] = useState(false)
    let [following, setFollowing] = useState(false)
    let [profilePic, setProfilePic] = useState(false)
    let [websiteURL, setWebsiteURL] = useState()

    let apiPhotos = [];

    useEffect(() => {
        getMoments()
        getProfile()
    }, [])

    let followUnfollow = async (data) => {
        let followAction;
        if (following === true) {
            followAction = "unfollow"
        } else {
            followAction = "follow"
        }

        let followingClick = await fetch('http://127.0.0.1:8000/follow/'+displayName+'/', {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer ' + String(authTokens.access)
            },
            body: JSON.stringify({"action": followAction})
        })
        if(followingClick.status === 200){
            if (followAction === "unfollow") {
                setFollowing(false)
            } else {
                setFollowing(true)
            }
        }
    }

    let getProfile = async() => {

        let profileResponse = await fetch('http://127.0.0.1:8000/profiles/'+userId+'/', {
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer ' + String(authTokens.access)
            }
        })

        let profileData = await profileResponse.json()

        if(profileResponse.status === 200){
            setProfileData(profileData)
            setProfilePic(profileData.profilepic)
            const sURL = profileData.website;

            //Strip http:// of URL
            setWebsiteURL(sURL.slice(sURL.indexOf("//")+2, sURL.length))

        }
        else if(profileResponse.statusText === 'Unauthorized'){
            logoutUser()
        }
    }

    let getMoments = async() => {

        let response = await fetch('http://127.0.0.1:8000/users/'+userId+'/', {
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer ' + String(authTokens.access)
            }
        })

        let data = await response.json()

        if(response.status === 200){

            if (data.detail) {
            } else {

                setDisplayName(data.username)

                let APIurl;

                for (let i = 0; i < data.moments.length; i++) {
                    APIurl = 'http://127.0.0.1:3000/moment/'+data.moments[i]+'/'

                    let APIresponse = await fetch('http://127.0.0.1:8000/moments/'+data.moments[i]+'/', {
                        method:'GET',
                        headers:{
                            'Content-Type':'application/json',
                            'Authorization':'Bearer ' + String(authTokens.access)
                        }
                    })

                    let APIdata = await APIresponse.json()
            
                    if(APIresponse.status === 200){
                        apiPhotos.push([APIdata.photo, APIurl])
                    }
                }

                setMoments(apiPhotos)

            }

        }else if(response.statusText === 'Unauthorized'){
            logoutUser()
        }
        
        //user.user_id is the logged in user, data.id is the displayed user
        if (parseInt(user.user_id) === parseInt(data.id)) { 
            setOwnAccount(true)
        } else {
            setOwnAccount(false)
        }

        let followingStatus = await fetch('http://127.0.0.1:8000/follow/'+data.username+'/', {
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':'Bearer ' + String(authTokens.access)
                }
            })

            let followingData = await followingStatus.json()

            if(followingStatus.status === 200){
                if (followingData.is_following === true) {
                    setFollowing(true)
                }
            }
   
    }

    return (

        <div className='max-w-6xl mx-5 p-10 xl:mx-auto text-gray-500'>
            
            <div class="grid grid-cols-12 gap-4">
                <div class="col-span-3"></div>
                <div class="col-span-6">
                    <div class="grid grid-cols-12 gap-4">
                        <div class="col-span-4">
                            <div class='grid grid-cols-12'>
                                <div class='col-span-4'></div>
                                <div class='col-span-8'>
                                    <img className='mt-0 rounded-full h-28 w-28 border p-1 ml-2' src={profilePic} />
                                </div>
                            </div>
                        </div>
                        <div class="col-span-8 ml-4">
                            <span className='text-gray-500 text-3xl mr-4'>{displayName}</span>

                            {ownAccount
                            ? <a href='http://127.0.0.1:3000/edit/'><div className='cursor-pointer inline text-sm text-gray-400 p-1 px-2 border border-gray-300 rounded mr-2'>edit profile</div></a>
                            : 
                                following
                                ? <div className='cursor-pointer inline text-sm text-gray-100 bg-emerald-500 hover:bg-emerald-600 p-1 px-2 border border-gray-300 rounded mr-4' onClick={followUnfollow}>unfollow user</div>
                                : <div className='cursor-pointer inline text-sm text-gray-100 bg-sky-500 hover:bg-sky-600 p-1 px-2 border border-gray-300 rounded mr-4' onClick={followUnfollow}>follow user</div>

                            }

                            <div className='flex'>
                                    <div><span className='font-semibold'>{moments.length}</span> moments</div>
                                    <div className='ml-4'><span className='font-semibold'>{profileData.follower_count}</span> followers</div>
                                    <div className='ml-4'><span className='font-semibold'>{profileData.following_count}</span> following</div>
                            </div>
                            <div className=''>
                                <span className='text-lg font-semibold text-gray-700 mr-2'>{profileData.bio}</span>
                                <a href={profileData.website}><p className='text-base text-blue-700 mr-2'>{websiteURL}</p></a>
                            </div>

                        </div>
                
                    </div>
                </div>
                <div class="col-span-3"></div>
            </div>
            
            <br />
            
            
            <div className='grid grid-cols-3 gap-5'>
                    {moments.map((moment, index)=>(
                        <div>
                            <a href={moment[1]}><img className='h-120 overflow-hidden object-cover w-full
                                                                cursor-pointer' src={moment[0]} alt='' /></a>
                        </div>
                    ))}
            </div>
                   
        </div>

    )
}

export default ProfilePage