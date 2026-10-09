"use client"
import { useEffect, useState } from 'react';
import JustValidate from 'just-validate';
import { Notyf } from 'notyf';
import "notyf/notyf.min.css";
import { useRouter } from 'next/navigation';
import { useAuth } from "@/hooks/useAuth";
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';
registerPlugin(FilePondPluginImagePreview);

export const ProfileForm = () => {
   const { isLogin, inforUser } = useAuth();
   const [fullName, setFullName] = useState("");
   const [email, setEmail] = useState("");
   const [phone, setPhone] = useState("");
   const [avatar, setAvatar] = useState<any[]>([]);

   useEffect(() => {
      if (!inforUser) return;

      setFullName(inforUser.fullName);
      setEmail(inforUser.email);
      setPhone(inforUser.phone || '');
      setAvatar(
         inforUser.avatar
            ? [inforUser.avatar]
            : []
      );
   }, [inforUser]);


   useEffect(() => {
      if (!isLogin || !inforUser) {
         return
      }
      const notyf = new Notyf({
         position: {
            x: "right",
            y: "top",
         }
      });
      const validation = new JustValidate('#profileForm');
      validation.addField('#fullName', [
         {
            rule: 'required',
            errorMessage: 'Họ tên không được để trống',
         },
      ]).addField('#email', [
         {
            rule: 'required',
            errorMessage: 'Email không được để trống',
         },
         {
            rule: 'email',
            errorMessage: 'Email không hợp lệ',
         },
      ]).onSuccess((event: any) => {
         const fullName = event.target.fullName.value;
         const email = event.target.email.value;
         const phone = event.target.phone.value;
         const newAvatar = avatar[0]?.file ?? null;
         const formData: any = new FormData();

         formData.append('fullName', fullName);
         formData.append('email', email);
         formData.append('phone', phone);
         if (newAvatar instanceof File) {
            formData.append('avatar', newAvatar);
         }

         fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/account/update-profile`, {
            method: 'PATCH',
            credentials: 'include',
            body: formData
         }).then((res) => res.json()).then((data) => {
            if (data.code === 'success') {
               notyf.success(data.message);
            } else {
               notyf.error(data.message);
            }
         })
      })

      return () => {
         validation.destroy();
      };

   }, [isLogin, inforUser, avatar]);
   if (isLogin == true && inforUser) {
      return (
         <>
            <form action="" className="grid sm:grid-cols-2 grid-cols-1 gap-x-[20px] gap-y-[15px]" id="profileForm">
               <div className="sm:col-span-2">
                  <label htmlFor="fullName" className="block font-[500] text-[14px] text-black mb-[5px]">
                     Họ tên *
                  </label>
                  <input
                     type="text"
                     name="fullName"
                     id="fullName"
                     className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
                     value={fullName}
                     onChange={(e) => setFullName(e.target.value)}
                  />
               </div>
               <div className="sm:col-span-2">
                  <label htmlFor="avatar" className="block font-[500] text-[14px] text-black mb-[5px]">
                     Avatar
                  </label>
                  <FilePond
                     name="avatar"
                     id="avatar"
                     allowMultiple={false}
                     files={avatar}
                     onupdatefiles={(fileItems) => {
                        setAvatar(fileItems)
                     }}
                     acceptedFileTypes={['image/*']}
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
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                  />
               </div>
               <div className="">
                  <label htmlFor="phone" className="block font-[500] text-[14px] text-black mb-[5px]">
                     Số điện thoại
                  </label>
                  <input
                     type="text"
                     name="phone"
                     id="phone"
                     value={phone}
                     onChange={(e) => setPhone(e.target.value)}
                     className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
                  />
               </div>
               <div className="sm:col-span-2">
                  <button className="bg-[#0088FF] rounded-[4px] h-[48px] px-[20px] font-[700] text-[16px] text-white">
                     Cập nhật
                  </button>
               </div>
            </form>
         </>
      )
   }
}