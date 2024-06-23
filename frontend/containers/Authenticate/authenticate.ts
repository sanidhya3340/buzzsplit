"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation"; 

const Authenticate = ({children}: {children:React.ReactNode}) => {
    const router = useRouter();
    useEffect(() => {
        if(!localStorage.getItem('csrftoken')){
            router.push('/login')
        }
    },[router])

    return children;
}
export default Authenticate