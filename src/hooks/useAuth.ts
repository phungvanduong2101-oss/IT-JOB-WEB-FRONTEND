
import { usePathname } from "next/navigation"; 
import { useEffect, useState } from "react" 

export const useAuth = () => {
    const pathname = usePathname()
    const [isLogin, setIsInfor] = useState(false)  
    const [inforUser, setInforUser] = useState<any>(null)
    const [inforCompany, setInforCompany] = useState<any>(null)
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/auth`, { 
            credentials: 'include',
        }).then((res) => res.json()).then((data) => { 
         
            if (data.code === 'success') {
                setIsInfor(true); 
                if (data.inforUser) {
                    setInforUser(data.inforUser)
                } else
                if (data.inforCompany) {
                    setInforCompany(data.inforCompany)
                } else {
                    setInforUser(null)
                    setInforCompany(null)
                }
            } else {  
                setIsInfor(false)  
                setInforUser(null)
                setInforCompany(null)
            }
        })
    }, [pathname])
    return { isLogin : isLogin, inforUser : inforUser , inforCompany : inforCompany } }
     


