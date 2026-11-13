"use client"
import { useEffect, useState } from 'react';
import JustValidate from 'just-validate';
import { Notyf } from 'notyf';
import "notyf/notyf.min.css";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';
import { getCityList } from '@/hooks/cityList';
import { EditorMCE } from '@/app/components/editor/EditorMCE';
import { useRef } from 'react';

registerPlugin(FilePondPluginImagePreview);


export const ProfileForm = () => {
  const { isLogin, inforCompany } = useAuth();
  const { cityList } = getCityList();
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [companyModel, setCompanyModel] = useState("");
  const [companyEmployees, setCompanyEmployees] = useState("");
  const [workOvertime, setWorkOvertime] = useState("");
  const [workTime, setWorkTime] = useState("");
  const [description, setDescription] = useState("");
  const [avatar, setAvatar] = useState<any[]>([]);
  const editorRef = useRef(null);
  useEffect(() => {
    if (!inforCompany) return;
    setCompanyName(inforCompany.companyName);
    setEmail(inforCompany.email);
    setPhone(inforCompany.phone);
    setCity(inforCompany.city);
    setAddress(inforCompany.address);
    setCompanyModel(inforCompany.companyModel);
    setCompanyEmployees(inforCompany.companyEmployees);
    setWorkOvertime(inforCompany.workOvertime);
    setWorkTime(inforCompany.workTime);
    setDescription(inforCompany.description);
    setAvatar(inforCompany.avatar ? [inforCompany.avatar] : []);
  }, [isLogin, inforCompany]);

  useEffect(() => {
    if (!isLogin || !inforCompany) {
      return
    }

    const notyf = new Notyf({
      position: {
        x: "right",
        y: "top",
      }
    });

    const validation = new JustValidate('#profileCompanyForm');
    validation.addField('#companyName', [
      {
        rule: 'required',
        errorMessage: 'Tên công ty là bắt buộc',
      },
    ]).addField('#email', [
      {
        rule: 'required',
        errorMessage: 'Email là bắt buộc',
      },
      {
        rule: 'email',
        errorMessage: 'Email không hợp lệ'
      }
    ]).addField('#phone', [
      {
        rule: 'required',
        errorMessage: 'Số điện thoại là bắt buộc',
      },
      {
        rule: 'minLength',
        value: 10,
        errorMessage: 'Số điện thoại phải được nhất 10 số',
      },
      {
        rule: 'maxLength',
        value: 10,
        errorMessage: 'Số điện thoại phải được nhất 11 số',
      },
      {
        rule: 'number',
        errorMessage: 'Số điện thoại không hợp lệ',
      }
    ]).onSuccess((event: any) => {
      const companyName = event.target.companyName.value;
      const email = event.target.email.value;
      const phone = event.target.phone.value;
      const city = event.target.city.value;
      const address = event.target.address.value;
      const companyModel = event.target.companyModel.value;
      const companyEmployees = event.target.companyEmployees.value;
      const workTime = event.target.workTime.value;
      const workOvertime = event.target.workOvertime.value;
      const newAvatar = avatar[0]?.file ?? null;
      let description = "";

      if (editorRef.current) {
        description = (editorRef.current as any).getContent();
      }


      const formData = new FormData();
      formData.append('id', inforCompany._id);
      formData.append('companyName', companyName);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('city', city);
      formData.append('address', address);
      formData.append('companyModel', companyModel);
      formData.append('companyEmployees', companyEmployees);
      formData.append('workOvertime', workOvertime);
      formData.append('workTime', workTime);
      formData.append('description', description);

      if (newAvatar instanceof File) {
        formData.append('avatar', newAvatar);
      }

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/account/update-profile`, {
        method: "PATCH",
        body: formData,
        credentials: "include",
      }).then((res) => {
        res.json().then((data) => {
          if (data.code === "success") {
            notyf.success(data.message);
          } else {
            notyf.error(data.message);
          }
        })
      })


    })

  }, [isLogin, inforCompany, avatar]);
  return (
    <>
      <form action="" className="grid sm:grid-cols-2 grid-cols-1 gap-x-[20px] gap-y-[15px]" id="profileCompanyForm">
        <div className="sm:col-span-2">
          <label htmlFor="companyName" className="block font-[500] text-[14px] text-black mb-[5px]">
            Tên công ty *
          </label>
          <input
            type="text"
            name="companyName"
            id="companyName"
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="logo" className="block font-[500] text-[14px] text-black mb-[5px]">
            Logo
          </label>

          <FilePond
            files={avatar}
            onupdatefiles={(fileItems) => {
              setAvatar(fileItems)
            }}
            allowMultiple={false}
            name="avatar"
            id="avatar"

            acceptedFileTypes={['image/*']}
          />

        </div>
        <div className="">
          <label htmlFor="city" className="block font-[500] text-[14px] text-black mb-[5px]">
            Thành phố
          </label>
          <select
            name="city"
            id="city"
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            {cityList.map((item: any) => (
              <option key={item.code} value={item.name}>
                {item.name}
              </option>
            ))}

          </select>
        </div>
        <div className="">
          <label htmlFor="address" className="block font-[500] text-[14px] text-black mb-[5px]">
            Địa chỉ
          </label>
          <input
            type="text"
            name="address"
            id="address"
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="">
          <label htmlFor="companyModel" className="block font-[500] text-[14px] text-black mb-[5px]">
            Mô hình công ty
          </label>
          <input
            type="text"
            name="companyModel"
            id="companyModel"
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
            value={companyModel}
            onChange={(e) => setCompanyModel(e.target.value)}
          />
        </div>
        <div className="">
          <label htmlFor="companyEmployees" className="block font-[500] text-[14px] text-black mb-[5px]">
            Quy mô công ty
          </label>
          <input
            type="text"
            name="companyEmployees"
            id="companyEmployees"
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
            value={companyEmployees}
            onChange={(e) => setCompanyEmployees(e.target.value)}
          />
        </div>
        <div className="">
          <label htmlFor="workingTime" className="block font-[500] text-[14px] text-black mb-[5px]">
            Thời gian làm việc
          </label>
          <input
            type="text"
            name="workTime"
            id="workTime"
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
            value={workTime}
            onChange={(e) => setWorkTime(e.target.value)}
          />
        </div>
        <div className="">
          <label htmlFor="WorkOvertime" className="block font-[500] text-[14px] text-black mb-[5px]">
            Làm việc ngoài giờ
          </label>
          <input
            type="text"
            name="workOvertime"
            id="WorkOvertime"
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
            value={workOvertime}
            onChange={(e) => setWorkOvertime(e.target.value)}
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
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="description" className="block font-[500] text-[14px] text-black mb-[5px]">
            Mô tả chi tiết
          </label>
          {/*
          <textarea
            name="description"
            id="description"
            className="w-[100%] h-[350px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea> */}

        <EditorMCE inforCompany={inforCompany} description={description} editorRef={editorRef} />
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