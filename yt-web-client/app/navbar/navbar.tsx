'use client';
import Image from "next/image"
import Link from "next/link"
import styles from "./navbar.module.css"
import SignIn from "./sign-in"
import { onAuthStateChangedHelper } from "../firebase/firebase"
import { useEffect, useState } from "react"
import { User } from "firebase/auth"

export default function Navbar() {
  //init user null
  const[user,setUser] = useState<User | null>(null);

  useEffect(() =>{
    const unsubscribe = onAuthStateChangedHelper((user) =>{
      setUser(user);
    })
    //cleanup subscription on unmount
     return () => unsubscribe();
  },[]);



  return (
    <nav className={styles.nav}>
        <Link href="/" >
            <Image width={100} height={100} 
                src="/ytlogo.svg" alt="youtube logo"  
            />
      </Link>

      <SignIn user={user} />
    </nav>
  )
}

