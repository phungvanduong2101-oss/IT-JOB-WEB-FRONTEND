"use client" 
import {useEffect, useState} from 'react'; 
import JustValidate from 'just-validate'; 
import { Notyf } from 'notyf';
import "notyf/notyf.min.css"; 
import { useRouter } from 'next/navigation';
export default function RegisterForm() {    
    const router = useRouter();
    useEffect(() => {  
        const notyf = new Notyf({ 
            position: {
                x: "right",
                y: "top",
            }
        });
        const validation = new JustValidate("#registerForm"); 
        validation.addField("#companyName", [
            {
                rule: "required", 
                errorMessage: "Tên công ty là bắt buộc",
            },])
            .addField("#email", [
                {
                    rule: "required", 
                    errorMessage: "Email là bắt buộc",
                },
                {
                    rule: "email",
                    errorMessage: "Email không hợp lệ"
                }
            ])
            .addField("#password", [
                {
                    rule: "required",
                    errorMessage: "Mật khẩu là bắt buộc"
                },
                {
                    rule: "minLength",
                    value: 6,
                    errorMessage: "Mật khẩu phải có ít nhất 6 ký tự"
                }, 
                {
                    rule: "maxLength", 
                    value: 32,
                    errorMessage: "Mật khẩu không được vượt quá 32 ký tự"
                }
            ]);
            validation.onSuccess((event: any) => {
                const companyName = event.target.companyName.value;
                const email = event.target.email.value;
                const password = event.target.password.value;
                 
                const dataFinal = {
                    companyName: companyName,
                    email: email, 
                    password: password, 
                }; 

                fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/account/register`, { 
                    method: "POST", 
                    headers: {
                        "Content-Type": "application/json",
                    }, 
                    body: JSON.stringify(dataFinal), 
                }).then((res) => res.json())
                .then((data) => {
                    if (data.code === "error") { 
                        notyf.error(data.message); 
                    } else {
                        notyf.success(data.message); 
                        router.push("/company/login"); 
                    }
                });
            });
    }, []);
    return( 
        <> 
         <form action="" className="grid grid-cols-1 gap-y-[15px]" id="registerForm">
              <div className="">
                <label htmlFor="companyName" className="block font-[500] text-[14px] text-black mb-[5px]">
                  Tên công ty *
                </label>
                <input 
                  type="text" 
                  name="companyName" 
                  id="companyName" 
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
        </>
    )
}