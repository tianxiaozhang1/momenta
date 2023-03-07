import React, {useState, useEffect} from 'react' //, useEffect, useContext, useRef 
// import AuthContext from '../context/AuthContext';
import jwt_decode from "jwt-decode";
import { useParams, useNavigate, useLocation } from "react-router-dom"; 

const LoginPage = () => {

    let { login } = useParams();
    let [authTokens, setAuthTokens] = useState(()=>localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)   
    let [user, setUser] = useState(()=>localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null)

    let [loginStatus, setLoginStatus] = useState(true)
    let [editPage, setEditPage] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        if (login === "register") {
            setLoginStatus(false)
        } else if (login === "edit") {
            setEditPage(true)
        }
    }, [])

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordTwo, setPasswordTwo] = useState('');

    const loginUser = async (e) => {
        e.preventDefault()

        const formData = new FormData();  
        formData.append('username', username)
        formData.append('password', password)

        let response = await fetch('http://127.0.0.1:8000/token/', {
            method: 'POST',
            body: formData
            
        })
        let data = await response.json()
        
        if (response.status === 200) {
            setAuthTokens(data)
            setUser(jwt_decode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))

            navigate('/')
            
        } else {
            console.log("response.status != 200")
        }
    }

    const register = async (event) => {
        event.preventDefault()

        const formData = new FormData();  
        formData.append('username', username)
        formData.append('password', password)
        formData.append('password2', passwordTwo)
        formData.append('email', email)

        let response = await fetch('http://127.0.0.1:8000/register/', {
            method:'POST',
            body: formData,
        })

        .then((response) => response)
        .then((data) => console.log(data))
        .catch(err => console.log(err));

        setUser(null)
        localStorage.removeItem('authTokens')

        let regResponse = await fetch('http://127.0.0.1:8000/token/', {
            method: 'POST',
            body: formData
            
        })
        let regData = await regResponse.json()
        
        if (regResponse.status === 200) {
            setAuthTokens(regData)
            setUser(jwt_decode(regData.access))
            localStorage.setItem('authTokens', JSON.stringify(regData))

            setLoginStatus(true)
            
        } else {
            console.log("response.status != 201")
        }

    }

    return (
        <div>
        {editPage 
        ?
        <div></div>
        :
        <div class="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div class="w-full max-w-md space-y-8">

                <div>
                {loginStatus
                ?
                <h2 class="mt-6 text-center text-lg tracking-tight text-gray-900">welcome back</h2>
                :
                <h2 class="mt-6 text-center text-lg tracking-tight text-gray-900">join us</h2>
                }
                </div>

                <form class="mt-8 space-y-6"> 

                <input type="hidden" name="remember" value="true" />
                <div class="-space-y-px rounded-md shadow-sm">
                    <div>
                    <label for="username" className='sm:text-sm font-bold'>username</label>
                    <input type="text" value={username} onChange={event => setUsername(event.target.value)} id="username" name="username" required class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"/>
                    </div>
                    <div>
                    <label for="password" className='sm:text-sm font-bold'>password</label>
                    <input type="password" value={password} onChange={event => setPassword(event.target.value)} id="password" name="password" required class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"/>
                    </div>
                </div>

                {loginStatus
                ?
                <div></div>
                :
                <div>
                    <div>
                    <label for="password2" className='sm:text-sm font-bold'>re-enter password</label>
                    <input type="password" value={passwordTwo} onChange={event => setPasswordTwo(event.target.value)} id="passwordtwo" name="passwordtwo" required class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"/>
                    </div>
                    <div>
                    <label for="password2" className='sm:text-sm font-bold'>email</label>
                    <input type="email" value={email} onChange={event => setEmail(event.target.value)} id="email" name="email" required class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"/>
                    </div>
                </div>
                }
                <div>
                    {loginStatus
                    ? 
                    <button type="submit" onClick={loginUser} class="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    sign in
                    </button>
                    :
                    <button type="submit" onClick={register} class="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    register
                    </button>
                    }
                    <br />
                </div>
                </form>

               <div>
                    {loginStatus
                    ?
                    <p class='mt-6 text-center text-lg tracking-tight text-gray-900 cursor-pointer' onClick={() => setLoginStatus(false)}>or sign up an account</p>
                    :
                    <p class='mt-6 text-center text-lg tracking-tight text-gray-900 cursor-pointer' onClick={() => setLoginStatus(true)}>or sign in</p>
                    }
               </div>

            </div>
        </div>
        }
        </div>

    )
}

export default LoginPage