import React, { Fragment, useState, useRef, useEffect, useContext } from 'react';
import { useRecoilState } from 'recoil';
import { modalState } from '../atoms/modalAtom';
import { Dialog, Transition} from '@headlessui/react';
import { CameraIcon } from '@heroicons/react/outline';

import AuthContext from '../context/AuthContext'

let photoFile;

const Modal = (props) => {

    const [open, setOpen] = useRecoilState(modalState);
    const filePickerRef = useRef(null);
    const captionRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    
    let [authTokens2, setAuthTokens2] = useState(()=>localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)

    const createPost = async (event) => {
        event.preventDefault()
        setLoading(true)

        const formData = new FormData();  
        formData.append('photo', photoFile)
        formData.append('content', captionRef.current.value);

        let response = await fetch('http://127.0.0.1:8000/moments/', {
            method:'POST',
            headers:{
                'Authorization':'Bearer ' + String(authTokens2.access)
            },
            body: formData,
        })

        .then((response) => response)
        .then((data) => console.log(data))
        .catch(err => console.log(err));

        setLoading(false)    
        setOpen(false)    
        document.location.reload();
    
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

        <Transition.Root show={open} as={Fragment}>
            <Dialog
                as='div'
                className='fixed z-10 inset-0 overflow-y-auto'
                onClose={setOpen}
            >
            <div className='flex items-end justify-center min-h-[800px]
                            sm:min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom='opacity-0'
                    enterTo='opacity-100'
                    leave="ease-in duration-200"
                    leaveFrom='opacity-100'
                    leaveTo='opacity-0'
                >
                    <Dialog.Overlay className='fixed inset-0 bg-gray-500
                                            bg-opacity-75 transition-opacity' />

                </Transition.Child>

                <span
                    className='hidden sm:inline-block sm:align-middle sm:h-screen'
                    aria-hidden='true'
                    >
                    &#8203;
                </span>

                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                    enterTo='opacity-100 translate-y-0 sm:scale-100'
                    leave="ease-in duration-200"
                    leaveFrom='opacity-100 translate-y-0 sm:scale-100'
                    leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                >
                    <div className='inline-block align-bottom bg-white rounded-lg
                                    px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl
                                    transform transition-all sm:my-8 sm:align-middle
                                    sm:max-w-sm sm:w-full sm:p-6'>
                        <div>
                            {selectedFile ? (
                                <img src={selectedFile}
                                        className="w-fill object-contain cursor-pointer"
                                        //
                                        type='file'
                                        accept="image/jpeg, image/png, image/gif"
                                        // onChange={(e) => {
                                        //     handleImageChange(e);}}
                                        //
                                        onClick={() => setSelectedFile(null)} alt="" />
                            ) : (
                                <div onClick={() => filePickerRef.current.click()}
                                    
                                    className='mx-auto flex items-center justify-center
                                    h-12 w-12 rounded-full bg-gray-100 cursor-pointer'>
                                    <CameraIcon
                                        className='h-6 w-6 text-blue-500'
                                        aria-hidden='true'
                                    />
                                </div>
                            )}
                            
                            <div>
                                <div className='mt-3 text-center sm:mt-5'>
                                    <Dialog.Title
                                        as='h3'
                                        className='text-lg leading-6 font-medium text-gray-900'>
                                        Upload Photo
                                    </Dialog.Title>

                                    <div>
                                        <input
                                            ref={filePickerRef}
                                            type='file'
                                            hidden
                                            onChange={addImageToPost}
                                        />
                                    </div>

                                    <div className='mt-2'>
                                        <input
                                            className='border-none focus-ring-0 w-full text-center'
                                            type='text'
                                            ref={captionRef}
                                            placeholder="What's happening?"
                                            maxLength={80}

                                        />

                                    </div>
                                </div>
                            </div>

                            <div className='mt-5 sm:mt-6'>
                            <button type="button" className="btn__primary className='inline-flex justify-center w-full rounded-md
                                    border border-transparent shadow-sm px-4 py-2 bg-blue-600
                                    text-base font-medium text-white hover:bg-blue-700
                                    focus:outline-none focus:ring-2 focus:ring-offset-2
                                    focus:ring-blue-500 sm:text-sm disabled:bg-gray-300
                                    disabled:cursor-not-allowed hover:disabled:bg-gray-300'" id="post__button" onClick={createPost} >Share</button>
                            </div>
                        </div>
                    </div>
                </Transition.Child>
                
            </div>
            
            </Dialog>
        </Transition.Root>
    )
}

export default Modal;

