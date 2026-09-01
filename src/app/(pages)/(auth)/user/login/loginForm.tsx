"use client"
import { useEffect } from "react"
import JustValidate from "just-validate"
import { useRouter } from "next/navigation"
import { Notyf } from "notyf"
import "notyf/notyf.min.css";

export const LoginForm = () => {
    const router = useRouter();
    useEffect(() => {
        const notyf = new Notyf({
            position: {
                x: "right",
                y: "top",
            }
        });

        const validation = new JustValidate("#loginForm");
        validation.addField("#email", [
            {
                rule: "required",
                errorMessage: "Email không được để trống",
            },
            {
                rule: "email",
                errorMessage: "Email không hợp lệ",
            },
        ]);
        validation.addField("#password", [
            {
                rule: "required",
                errorMessage: "Mật khẩu không được để trống",
            },
        ]).onSuccess((event: any) => {
            const email = event.target.email.value;
            const password = event.target.password.value;

            const dataFinal = {
                email: email,
                password: password,
            };

            fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/account/login`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }, 
                body: JSON.stringify(dataFinal),
            }).then((res) => (res.json())).then((data) => {
                if (data.code === 'error') {
                    notyf.error(data.message);
                } else {
                    notyf.success(data.message);
                    router.push("/");
                }
            })
        })
    }, []);

    return (
        <form action="" className="grid grid-cols-1 gap-y-[15px]" id="loginForm">
            <div className="">
                <label htmlFor="email" className="block font-[500] text-[14px] text-black mb-[5px]">
                    Email *
                </label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
                />
            </div>
            <div className="">
                <label htmlFor="password" className="block font-[500] text-[14px] text-black mb-[5px]">
                    Mật khẩu *
                </label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
                />
            </div>
            <div className="">
                <button className="bg-[#0088FF] rounded-[4px] w-[100%] h-[48px] px-[20px] font-[700] text-[16px] text-white">
                    Đăng nhập
                </button>
            </div>
        </form>
    )
} 