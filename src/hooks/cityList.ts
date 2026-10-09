
import { usePathname } from "next/navigation"; 
import { useEffect, useState } from "react" 

export const getCityList = () => { 
    const [cityList, setCityList] = useState<any>([]) 
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/auth/city`, { 
            credentials: 'include',
        }).then((res) => res.json()).then((data) => { 
            if (data.code === 'success') { 
                setCityList(data.City) 
            } else { 
                setCityList([]) 
            }
        })
    },[]) 
    return { cityList : cityList }
}
     


