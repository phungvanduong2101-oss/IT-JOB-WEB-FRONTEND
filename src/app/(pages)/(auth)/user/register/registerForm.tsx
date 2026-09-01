"use client" 
import { useEffect } from "react"
import JustValidate from "just-validate" 
import { useRouter } from "next/navigation"  
import {Notyf} from "notyf" 
import "notyf/notyf.min.css"; 

export const RegisterForm = () => { 
    const router = useRouter(); 
    useEffect(() => {  
        const notyf = new Notyf({ 
            position: {
                x: "right",
                y: "top",
            }
        });
        const validation = new JustValidate("#registerForm"); 
        validation.addField("#fullName", [
            {
                rule: "required", 
                errorMessage: "Họ tên không được để trống",
            },]) 
            .addField("#email", [
                {
                    rule: "required", 
                    errorMessage: "Email không được để trống", 
                },
                {
                    rule: "email", 
                    errorMessage: "Email không hợp lệ",
                },
            ]).addField("#password", [
                {
                    rule: "required", 
                    errorMessage: "Mật khẩu không được để trống",
                },
                { 
                    rule: "minLength", 
                    value: 6, 
                    errorMessage: "Mật khóa phải nhất 6 ký tự",
                },
            ]).onSuccess((event: any) => {  
                const email = event.target.email.value;
                const password = event.target.password.value;
                const fullName = event.target.fullName.value;
                 
                const dataFinal = {
                    email: email, 
                    password: password,
                    fullName: fullName,
                }; 
                 
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/account/register`, {
                    method: "POST", 
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(dataFinal),
                }).then((res) => res.json()).then((data) => {
                    if (data.code === "success") {
                        notyf.success(data.message);
                        router.push("/user/login");
                    } else {
                        notyf.error(data.message);
                    }
                })
            })
            
        }, [])
        return (
            <form action="" className="grid grid-cols-1 gap-y-[15px]" id="registerForm">
                <div className="">
                    <label htmlFor="fullName" className="block font-[500] text-[14px] text-black mb-[5px]">
                        Họ tên *
                    </label>
                    <input
                        type="text"
                        name="fullName"
                        id="fullName"
                        className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
                    />
                </div>
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
                        Đăng ký
                    </button>
                </div>
            </form>
        )
    }