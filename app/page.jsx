"use client"
import Image from 'next/image'
import React from 'react';

import { useSession, signIn, signOut } from "next-auth/react"
import { collection, getDocs, getFirestore, query } from 'firebase/firestore';
import app from './Shared/firebaseConfig';
import { useEffect, useState } from 'react';
import PinList from './components/Pins/PinList';

export default function Home() {
  const db=getFirestore(app);
  const [listOfPins,setListOfPins]=useState([]);
  
  useEffect(()=>{
    getAllPins();
  },[])
  const getAllPins = async () => {
    const q = query(collection(db, 'pinterest-post'));
    const querySnapshot = await getDocs(q);
    const pins = [];
    querySnapshot.forEach((doc) => {
      pins.push(doc.data());
    });
    setListOfPins(pins);
  };
  

  return (
    <>
    
    <div className='p-3 bg-white h-[100vh] md:h-[100vh] lg:h-[100vh] '>

      <PinList listOfPins={listOfPins} />
      </div>
      
    </>
  )
}
