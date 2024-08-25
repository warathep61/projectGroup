import { signInWithPopup } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth, provider } from "../firebase";
import Home from "./Home"
import '../App.css';

export default function Login() {
  // กำหนด state ชื่อ 'value' และฟังก์ชัน 'setValue' เพื่อจัดการสถานะ email
  const [value, setValue] = useState("");

  // ฟังก์ชัน handleClick ทำการเข้าสู่ระบบผ่าน popup เมื่อผู้ใช้คลิกปุ่ม Signin
  const handleClick = () => {
    signInWithPopup(auth, provider).then((data) => {
      // เมื่อเข้าสู่ระบบสำเร็จ เก็บ email ของผู้ใช้ลงใน state และ localStorage
      setValue(data.user.email);
      localStorage.setItem("email", data.user.email);
    });
  };

//   localStorage เป็นส่วนหนึ่งของ Web Storage API ที่ใช้เก็บข้อมูลในเว็บเบราว์เซอร์ของผู้ใช้ 
//ข้อมูลที่เก็บใน localStorage จะถูกเก็บไว้อย่างถาวรจนกว่าจะถูกลบออก ไม่เหมือนกับ sessionStorage ที่จะถูกลบเมื่อปิดแท็บหรือเบราว์เซอร์

  // ใช้ useEffect เพื่อดึง email ที่เก็บไว้ใน localStorage มาแสดงเมื่อ component โหลดครั้งแรก
  useEffect(() => {
    setValue(localStorage.getItem("email"));
  });

  return (
    <div>
      {/* ถ้ามี email ใน state จะแสดงหน้า Home แต่ถ้าไม่มีก็จะแสดงปุ่ม Signin */}
        {value ? <Home/> : 
        <button className="button bg-success text-white" onClick={handleClick}>Login</button>}
    </div>
  );
}
