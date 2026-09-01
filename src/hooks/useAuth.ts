
import { usePathname } from "next/navigation"; 
import { useEffect, useState } from "react" 

export const useAuth = () => {
    const pathname = usePathname()
    const [isLogin, setIsInfor] = useState(false)  
    const [inforUser, setInforUser] = useState<any>(null)

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/auth`, { 
            credentials: 'include',
        }).then((res) => res.json()).then((data) => { 
         
            if (data.code === 'success') {
                setIsInfor(true); 
                setInforUser(data.inforUser); 
            } else {  
                setIsInfor(false) 
            }
        })
    }, [pathname])
    return { isLogin : isLogin, inforUser : inforUser } }
     


