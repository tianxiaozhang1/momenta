import React, { useState, useEffect, useContext } from "react";
import { Link, BrowserRouter as Router, Route } from "react-router-dom";
import AuthContext from '../context/AuthContext'
import { useParams } from "react-router-dom";
import Post from '../components/Post'

const MomentPage = () => {

    let { momentId } = useParams();

    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState();
    let {authTokens, logoutUser} = useContext(AuthContext)
  
    useEffect(() => {
      fetch(`http://127.0.0.1:8000/moments/${momentId}/`, {
        method:'GET',
        headers:{
            'Content-Type':'application/json',
            'Authorization':'Bearer ' + String(authTokens.access)
        }
      })
        .then((res) => res.json())
        .then((response) => {
          setData(response);
          setIsLoading(false);
        })
        .catch((error) => console.log(error));
    }, [momentId]);
  
    return (
        <>
        {!isLoading && (
          <>
            <main className='Home-page 
            md:grid-cols-3 md:max-w-3xl
            xl:grid-cols-3 xl:max-w-4xl mx-auto'>
            {/* LEFT */}

            <section className='col-span-2'>
                <Post
                    id={data.id}
                    username={data.owner}
                    img={data.photo}
                    caption={data.content}
                    owner_id={data.owner_id}
                    created={data.created}

                />
            </section>

            </main>
          </>
        )}
      </>
    );
};
  
export default MomentPage