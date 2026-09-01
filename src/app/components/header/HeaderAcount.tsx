import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
export const HeaderAccount = () => {
    const { isLogin, inforUser } = useAuth();
    const router = useRouter();
    const handleLogout = () => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/account/logout`, {
            credentials: 'include',
        }).then((res) => res.json()).then((data) => {
            router.push('/user/login');
        })
    }
    if (isLogin == false) {
        return (
            <> <Link href="/user/login" className="">
                Đăng Nhập
            </Link>
                <span className="">/</span>
                <Link href="/user/register" className="">
                    Đăng Ký
                </Link>   </>)
    } else if (isLogin == true) {
        return (
            <>
                <Link href="/user-manage/profile" className="">{inforUser.fullName}</Link>
                <ul className="absolute top-[100%] right-[0px] w-[200px] bg-[#000065] hidden group-hover/sub-1:block z-[999]">
                    <li className="py-[10px] px-[16px] rounded-[4px] flex items-center justify-between hover:bg-[#000096] relative group/sub-2">
                        <Link href="/user-manage/profile" className="text-white font-[600] text-[16px]">
                            Thông tin cá nhân
                        </Link>
                    </li>
                    <li className="py-[10px] px-[16px] rounded-[4px] flex items-center justify-between hover:bg-[#000096] relative group/sub-2">
                        <Link href="/user-manage/cv/list" className="text-white font-[600] text-[16px]">
                            Quản lý CV đã gửi
                        </Link>
                    </li>
                    <li className="py-[10px] px-[16px] rounded-[4px] flex items-center justify-between hover:bg-[#000096] relative group/sub-2">
                        <button onClick={handleLogout} className="text-white font-[600] text-[16px]">
                            Đăng xuất
                        </button>
                    </li>
                </ul>
            </>
        )
    }

} 