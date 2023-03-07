import React, {useState, useEffect, useContext, useRef} from 'react'
import AuthContext from '../context/AuthContext'
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
// import '../App.css'

let photoFile;

const EditPage = () => {

    // let { edit } = useParams();
    // let { userId } = useParams();
    let [moments, setMoments] = useState([])
    let {authTokens, logoutUser} = useContext(AuthContext)
    let [user, setUser] = useState(()=>localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null)

    let [displayName, setDisplayName] = useState([])
    let [profileData, setProfileData] = useState()
    let [registration, setRegistration] = useState(false)

    let {loginUser} = useContext(AuthContext)
    const filePickerRef = useRef(null);

    const navigate = useNavigate()

    useEffect(() => {
        getProfile()
    }, [])

    const [username, setUsername] = useState('');
    const [bioText, setBioText] = useState('');
    const [website, setWebsite] = useState('');
    const [email, setEmail] = useState('');
    const [passwordOne, setPasswordOne] = useState('');
    const [passwordTwo, setPasswordTwo] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [profilePic, setProfilePic] = useState('');

    const ref = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);

    // const handleClick = () => {
    //     console.log("username", username);
    //     console.log("bioText", bioText);
    //     console.log("website", website);
    //     console.log("passwordOne", passwordOne);
    //     console.log("passwordTwo", passwordTwo);
    // };

    let getProfile = async() => {

        let profileResponse = await fetch('http://127.0.0.1:8000/profiles/'+user.user_id+'/', {
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer ' + String(authTokens.access)
            }
        })

        let profileData = await profileResponse.json()

        // console.log("** profileData", profileData)

        if(profileResponse.status === 200){
            setProfileData(profileData)
            setUsername(profileData.username)
            setBioText(profileData.bio)
            setWebsite(profileData.website)
            setEmail(profileData.email)
            setFirstName(profileData.first_name)
            setLastName(profileData.last_name)
            setProfilePic(profileData.profilepic)

            // console.log("** profileData.profilepic", profileData.profilepic)
            // console.log("** profilePic", profilePic)

        }
        // else if(profileResponse.statusText === 'Unauthorized'){
        //     logoutUser()
        // }
    }

    const updateProfile = async (event) => {
        event.preventDefault()

        const formData = new FormData();  
        formData.append('username', username)
        formData.append('bio', bioText)
        formData.append('website', website)
        formData.append('email', email)
        formData.append('first_name', firstName)
        formData.append('last_name', lastName)
        formData.append('profilepic', photoFile)
        // console.log("profilePic", photoFile)

        // console.log("user.user_id", user.user_id)
        let response = await fetch('http://127.0.0.1:8000/profiles/'+user.user_id+'/', {
            method:'PUT',
            headers:{
                // 'Content-Type':'application/json',
                'Authorization':'Bearer ' + String(authTokens.access)
            },
            body: formData,
        })

        .then((response) => response)
        // .then((data) => console.log(data))
        .catch(err => console.log(err));

        navigate('/user/'+user.user_id+'/')
    
    }

    const addImageToPost = (e) => {
        const reader = new FileReader();
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0]);
            photoFile = e.target.files[0]
            
        }

        reader.onload = (readerEvent) => {
            setSelectedFile(readerEvent.target.result);
            
        };
    };

    return (

        <div class="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div class="w-full max-w-md space-y-8">
                <div>
                
                {registration
                ?
                <h2 class="mt-6 text-center text-lg tracking-tight text-gray-900">sign up</h2>
                :
                <h2 class="mt-6 text-center text-lg tracking-tight text-gray-900">edit profile</h2>
                }
                </div>
                <form class="mt-8 space-y-6"> 
                {/* action="#" method="POST" */}
                <input type="hidden" name="remember" value="true" />

                <div class="-space-y-px rounded-md shadow-sm">
                    <label for="username" className='sm:text-sm font-bold'>profile picture</label>
                    <div  class="flex items-center w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                    

                    {selectedFile ? (
                                <img src={selectedFile}
                                        className="rounded-full h-16 w-16 border p-1 mr-3"
                                        type='file'
                                        accept="image/jpeg, image/png, image/gif"
                                        onClick={() => setSelectedFile(null)} alt="" />
                            ) : (
                                <img src={profilePic}
                                        className="rounded-full h-16 w-16 border p-1 mr-3"
                                        type='file'
                                        accept="image/jpeg, image/png, image/gif"
                                        onClick={() => filePickerRef.current.click()} alt="" />
                    )}

                    <input type="file" className='text-sm' onChange={addImageToPost} accept="image/*" id="profilePic" name="profilePic" required />
                    </div>
                </div>
                
                <div class="-space-y-px rounded-md shadow-sm">
                    <div>
                    <label for="username" className='sm:text-sm font-bold'>username</label>
                    <input ref={filePickerRef} type="text" value={username} onChange={event => setUsername(event.target.value)} id="username" name="username" required class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"/>
                    </div>
                </div>
                {/* {registration
                ?
                <div>
                    <div>
                    <label for="password" className='sm:text-sm font-bold'>password</label>
                    <input type="password" value={passwordOne} onChange={event => setPasswordOne(event.target.value)} id="passwordone" name="passwordone" required class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"/>
                    </div>
                    <div>
                    <label for="password2" className='sm:text-sm font-bold'>re-enter password</label>
                    <input type="password" value={passwordTwo} onChange={event => setPasswordTwo(event.target.value)} id="passwordtwo" name="passwordtwo" required class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"/>
                    </div>
                    
                </div>
                :
                <div></div>
                } */}

                <div class="-space-y-px rounded-md shadow-sm">
                    <div>
                    <label for="email" className='sm:text-sm font-bold'>email</label>
                    <input type="text" value={email} onChange={event => setEmail(event.target.value)} id="email" name="email" required class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"/>
                    </div>
                </div>

                <div class="-space-y-px rounded-md shadow-sm">
                    <div>
                    <label for="firstname" className='sm:text-sm font-bold'>first name</label>
                    <input type="text" value={firstName} onChange={event => setFirstName(event.target.value)} id="firstname" name="firstname" required class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"/>
                    </div>
                    <div>
                    <label for="lastname" className='sm:text-sm font-bold'>last name</label>
                    <input type="text" value={lastName} onChange={event => setLastName(event.target.value)} id="lastname" name="lastname" required class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"/>
                    </div>
                </div>


                {registration
                ?
                    <div></div>
                :
                    <div class="rounded-md shadow-sm">
                        <div>
                        <label for="bio" className='sm:text-sm font-bold'>bio</label>
                        <input type="text" value={bioText} onChange={event => setBioText(event.target.value)} id="bio" name="bio" required class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"/>
                        </div>
                        <br />
                        <div>
                        <label for="webiste" className='sm:text-sm font-bold'>website</label>
                        <input type="url" value={website} onChange={event => setWebsite(event.target.value)}  id="website" name="website" required class="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" />
                        </div>
                    </div>
                }
                
                <br />
                <div>
{/* 
                    {registration
                    ? 
                    <button type="submit" onClick={register} class="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    register
                    </button>
                    :
                    <button type="submit" onClick={updateProfile} class="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    save
                    </button>
                    } */}

                    <button type="submit" onClick={updateProfile} class="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        save
                    </button>
                    
                    <br />
                    
                </div>
                </form>

            </div>
            </div>

    )
}

export default EditPage