import React, {useState, useEffect, useContext} from 'react'
import AuthContext from '../context/AuthContext'
import Post from '../components/Post'
import jwt_decode from "jwt-decode";
import '../App.css';
import dayjs from 'dayjs';

const HomePage = () => {
    let [moments, setMoments] = useState([])
    let {authTokens, logoutUser} = useContext(AuthContext)
    let [user, setUser] = useState(()=>localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null)
    // let [authTokens2, setAuthTokens2] = useState(()=>localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)

    let momentList = [];
    let momentFullList = [];

    var relativeTime = require('dayjs/plugin/relativeTime')
    dayjs.extend(relativeTime)

    function dynamicSort(property) {
        var sortOrder = 1;
        if(property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a,b) {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    }

    useEffect(() => {
        getMoments()
    }, [])

    let getMoments = async() =>{

        let ownResponse = await fetch('http://127.0.0.1:8000/users/'+user.user_id+'/', {
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer ' + String(authTokens.access)
            }
        })
            let ownData = await ownResponse.json()

            momentList = ownData.moments

        let followResponse = await fetch('http://127.0.0.1:8000/profiles/'+user.user_id+'/', {
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer ' + String(authTokens.access)
            }
        })

            let followData = await followResponse.json()

            for (let i = 0; i < followData.following.length; i++) {

                let individualFollowResponse = await fetch('http://127.0.0.1:8000/users/'+followData.following[i].id+'/', {
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':'Bearer ' + String(authTokens.access)
                }
                })

                let individualFollowData = await individualFollowResponse.json()

                momentList = momentList.concat(individualFollowData.moments)

            }
        
        for (let j = 0; j < momentList.length; j++) {

            let individualMomentResponse = await fetch('http://127.0.0.1:8000/moments/'+momentList[j]+'/', {
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer ' + String(authTokens.access)
                }
            })

                let individualMomentData = await individualMomentResponse.json()

            momentFullList.push(individualMomentData)

            // console.log("momentFullList", momentFullList)


        }

        momentFullList.sort(dynamicSort("-created"))

        setMoments(momentFullList)

    
    }

    return (
        <main className='Home-page 
        md:grid-cols-3 md:max-w-3xl
        xl:grid-cols-3 xl:max-w-4xl mx-auto'>
        {/* LEFT */}
        <section className='col-span-2'>

        {/* <Stories /> */}
        {moments.map((moment, index)=>(
              <Post
                  key={moment.id}
                  id={moment.id}
                  username={moment.owner}
                  owner_id={moment.owner_id}
                  // userImg={moment.userImg}
                //   profilepic={moment.profilepic}
                  img={moment.photo}
                  caption={moment.content}
                  created={moment.created}
              />
            ))}

        </section>

        {/* RIGHT
        <section className='hidden xl:inline-grid md:col-span-1'>
        <div className='Mini-profile fixed top-30'>
        <MiniProfile />
        </div>
        </section> */}

        </main>


    )
}

export default HomePage