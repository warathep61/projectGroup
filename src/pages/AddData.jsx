import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { db, storage } from "../firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";

const initialState = {
  product: "",
  detail: "",
  content: "",
  img1: "",
  img2: "",
  img3: "",
};
export default function AddData() {
  const [data, setData] = useState(initialState);  //ต้องการเก็บข้อมูลอะไร ก็กำหนดใน initialState
  const { product, detail, content } = data;
  // const [file, setFile] = useState(null);
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [file3, setFile3] = useState(null);
  const [progress, setProgress] = useState(null);
  const [errors, setErrors] = useState({});
  // const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();

  // id จากการ Edit
  const { id } = useParams();

  // ใช้ useEffect เพื่อเรียก getSingleUser เมื่อ id มีค่าเปลี่ยนแปลง
  useEffect(() => {
    id && getSingleUser();
  }, [id]);

  // ฟังก์ชันที่ใช้ async เพื่อดึงข้อมูลของผู้ใช้เพียงคนเดียว
  const getSingleUser = async () => {
      // สร้างอ้างอิงไปยังเอกสารที่เฉพาะเจาะจงใน Firebase Firestore โดยใช้ id ที่กำหนด
    const docRef = doc(db, "users", id); // ดึงข้อมูลของเอกสารด้วย getDoc
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) { // ตรวจสอบว่าเอกสารมีอยู่จริงหรือไม่
      setData({ ...snapshot.data() }); // ถ้ามี เราจะอัปเดต state ด้วยข้อมูลที่ดึงมาใหม่
    }
  };

  //Upload file ที่ใช้ useEffect เพราะเมื่อมีการเลือกไฟล์ใน <input> แล้ว จะทำการอัพโหลด (firebaase) ทันที
  // useEffect(() => {
    const uploadFile = (file, setProgress, setUrl) => {
      // เมื่อมีการเปลี่ยนแปลงใน `file` (ไฟล์ที่ผู้ใช้เลือก), `useEffect()` จะถูกเรียกใช้.
      const name = new Date().getTime() + file.name;
      // สร้าง reference ไปยังโฟลเดอร์ใน Firebase Storage โดยใช้ชื่อไฟล์
      const storageRef = ref(storage, file.name);
      // เริ่มกระบวนการอัปโหลดไฟล์ด้วย `uploadBytesResumable()`
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        // ติดตามสถานะการอัปโหลดของไฟล์ด้วย `uploadTask.on()` โดยรายงานความคืบหน้าและสถานะของการอัปโหลดในแต่ละขั้นตอน
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100; //ส่วนนี้คำนวณความคืบหน้าของการอัปโหลดในรูปแบบของเปอร์เซ็นต์
          setProgress(progress); //อัปเดตค่าความคืบหน้า เพื่อทำให้ UI แสดงความคืบหน้าที่ถูกต้อง.
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is Pause");
              break;
            case "running":
              console.log("Upload is Running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        // เมื่อการอัปโหลดเสร็จสมบูรณ์ `() => {...}` จะถูกเรียก เพื่อดึง URL ของไฟล์ที่อัปโหลดเสร็จสมบูรณ์ด้วย
        //`getDownloadURL()` และเพิ่ม URL นี้ในข้อมูล `data` โดยใช้ `setData()`
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setUrl(downloadURL)
          });
        }
      );
    };
    // ถ้ามีไฟล์ที่เลือกอยู่ ให้เริ่มกระบวนการอัปโหลด
  //   file && uploadFile();
  // }, [file]);

  //รับค่าจาก <input>
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    //เป็นการสร้างออบเจ็กต์ใหม่ของข้อมูลโดยนำข้อมูลเดิมมา และแทนที่ค่าของฟิลด์ที่เปลี่ยนแปลงด้วยค่าใหม่ที่ผู้ใช้ป้อนเข้ามา
  };
  const handleFile1Change = (e) => {
    setFile1(e.target.files[0]);
  };

  const handleFile2Change = (e) => {
    setFile2(e.target.files[0]);
  };

  const handleFile3Change = (e) => {
    setFile3(e.target.files[0]);
  };

  useEffect(() => {
    file1 && uploadFile(file1, setProgress, (url) => setData((prev) => ({ ...prev, img1: url })));
  }, [file1]);

  useEffect(() => {
    file2 && uploadFile(file2, setProgress, (url) => setData((prev) => ({ ...prev, img2: url })));
  }, [file2]);

  useEffect(() => {
    // ตรวจสอบว่า file3 มีค่าหรือไม่ (ต้องไม่เป็น null หรือ undefined)
    if (file3) {
        // ถ้า file3 มีค่า เรียกใช้ฟังก์ชัน uploadFile
        // ฟังก์ชันนี้รับพารามิเตอร์ file3 (ไฟล์ที่จะอัปโหลด), setProgress (ฟังก์ชันสำหรับอัปเดตสถานะความคืบหน้า), และ callback function สำหรับตั้งค่า URL ของไฟล์หลังจากอัปโหลดสำเร็จ
        uploadFile(file3, setProgress, (url) => {
            // เมื่ออัปโหลดสำเร็จ callback function จะถูกเรียกใช้ และ url ของไฟล์ที่อัปโหลดจะถูกส่งมา
            // อัปเดต state 'data' โดยใช้ฟังก์ชัน setData
            // การอัปเดต state ใช้ prev (ค่าเดิมของ state 'data') และเพิ่มฟิลด์ 'img3' พร้อมกับค่า URL ของไฟล์ที่อัปโหลด
            setData((prev) => ({ ...prev, img3: url }));
        });
    }
}, [file3]); // useEffect จะรันใหม่เมื่อ file3 เปลี่ยนแปลง


  //สร้าง Function สำหรับการตรวจสอบว่าได้ใส่ข้อมูลตามที่ต้องการรึเปล่า ในที่นี้คือ ห้ามมีค่าว่าง
  const validata = () => {
    let errors = {};
    if (!product) {
      errors.name = "Name is Required";
    }
    if (!detail) {
      errors.age = "Age is Required";
    }
    if (!content) {
      errors.age = "Age is Required";
    }

    return errors;
  };

  //Function อัพข้อมูล
  const handleSubmit = async (e) => {
    e.preventDefault(); //กันการ Refresh จำเป็น
    let errors = validata();
    if (Object.keys(errors).length) { // ถ้ามีข้อผิดพลาด
      return setErrors(errors); // ตั้งค่า errors ใน state และหยุดการทำงานของฟังก์ชัน
    } else {
      setErrors({}); // เคลียร์ errors ใน state
      //setIsSubmit(true); // ตั้งค่า isSubmit เป็น true เพื่อแสดงว่าข้อมูลกำลังถูกส่ง
      if (!id) { // ถ้าไม่มี id (เพิ่มข้อมูลใหม่)
        try {
          await addDoc(collection(db, "users"), {
            ...data,
            timestamp: serverTimestamp(),
          });
        } catch (error) {
          console.log(error);
        }
      } else { // ถ้ามี id (อัปเดตข้อมูล)
        try {
            await updateDoc(doc(db, "users", id), {
              ...data,
              timestamp: serverTimestamp(),
            });
          } catch (error) {
            console.log(error);
          }
      }
      navigate("/");
    }
  };

  return (
    <>
      <div>
        <h1>{id ? "Update Data" : "Add Data"}</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name Product:</label>
          <input
            type="text"
            className="form-control"
            name="product"
            value={product}
            autoFocus
            onChange={handleChange}
            placeholder={errors.product ? errors.product : "Name Product..."}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Detail</label>
          <input
            type="text"
            className="form-control"
            name="detail"
            value={detail}
            autoFocus
            onChange={handleChange}
            placeholder={errors.detail ? errors.detail : "Detail..."}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Content</label>
          <input
            type="text"
            className="form-control"
            name="content"
            value={content}
            autoFocus
            onChange={handleChange}
            placeholder={errors.content ? errors.content : "Content..."}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Image 1</label>
          <input
            type="file"
            className="form-control"
            // onChange={(e) => setFile(e.target.files[0])}
            onChange={handleFile1Change}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Image 2</label>
          <input
            type="file"
            className="form-control"
            // onChange={(e) => setFile(e.target.files[0])}
            onChange={handleFile2Change}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Image 3</label>
          <input
            type="file"
            className="form-control"
            // onChange={(e) => setFile(e.target.files[0])}
            onChange={handleFile3Change}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={progress !== null && progress < 100}
          //ในกรณีที่ค่าของตัวแปร progress ไม่ใช่ null และค่าของ progress น้อยกว่า 100% ในการอัปโหลดไฟล์.
          //เพราะว่า หากไฟล์กำลังอยู่ในขั้นตอนกำลังส่งไฟล์ จะไม่สามารถกดปุ่มได้ กันการเกิดข้อผืดพลาด * สำคัญ
        >
          Submit
        </button>
      </form>
    </>
  );
}
