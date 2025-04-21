"use client"
import React,{useState} from 'react'
import UploadImage from './UploadImage'
import { useSession} from "next-auth/react"
import {getDownloadURL, getStorage, ref, uploadBytes} from "firebase/storage"
import UserTag from './UserTag'
import app from '../Shared/firebaseConfig'
import { doc, getFirestore, setDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

function Form() {
    const {data:session}=useSession();
    const [title,setTitle]=useState();
    const [desc,setDesc]=useState();
    const [link,setLink]=useState();
    const [file,setFile]=useState();
    const [loading,setLoading]=useState(false);
    const router=useRouter();
    const storage=getStorage(app)
    const db=getFirestore(app);
    const postId=Date.now().toString();
    const onSave=()=>{
       setLoading(true)
       uploadFile();
   

    }

    const uploadFile = () => {
        if (!file) {
          alert("Please upload an image first!");
          setLoading(false);
          return;
        }
      
        const storageRef = ref(storage, 'pinterest/' + file.name);
        uploadBytes(storageRef, file)
          .then(() => {
            console.log("File Uploaded");
            return getDownloadURL(storageRef);
          })
          .then(async (url) => {
            console.log("DownloadUrl", url);
            const postData = {
              title: title || "", // fallback to empty string
              desc: desc || "",
              link: link || "",   // ✅ avoid undefined
              image: url,
              userName: session?.user?.name || "Unknown",
              email: session?.user?.email || "no-email@example.com",
              userImage: session?.user?.image || "",
              id: postId
            };
      
            try {
              await setDoc(doc(db, 'pinterest-post', postId), postData);
              console.log("Saved");
              setLoading(false);
              router.push("/" + session.user.email);
            } catch (error) {
              console.error("Error saving post:", error);
              setLoading(false);
            }
          })
          .catch((err) => {
            console.error("Upload error:", err);
            setLoading(false);
          });
      };
          
   
   
  return (
    <div className=' bg-white p-16 rounded-2xl '>
        <div className='flex justify-end mb-6'>
            <button onClick={()=>onSave()}
             className='bg-red-500 p-2
            text-white font-semibold px-3 
            rounded-lg'>
              {loading?  <Image src="/loading-indicator.png" 
                width={30} 
                height={30} 
                alt='loading'
                className='animate-spin'  />:
                <span>Save</span>}</button>
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-10'>
           
            <UploadImage setFile={(file)=>setFile(file)} />
          
       <div className="col-span-2">
       <div className='w-[100%]'>
        <input type="text" placeholder='Add your title'
            onChange={(e)=>setTitle(e.target.value)}
        className='text-[35px] outline-none font-bold w-full
        border-b-[2px] border-gray-400 placeholder-gray-400'/>
        <h2 className='text-[12px] mb-8 w-full  text-gray-400'>The first 40 Charaters are 
        what usually show up in feeds</h2>
        <UserTag user={session?.user} />
        <textarea type="text"
          onChange={(e)=>setDesc(e.target.value)}
            placeholder='Tell everyone what your pin is about' 
        className=' outline-none  w-full mt-8 pb-4 text-[14px]
        border-b-[2px] border-gray-400 placeholder-gray-400'/>
          
    </div>
       </div>
        
        </div>
    </div>
  )
}

export default Form