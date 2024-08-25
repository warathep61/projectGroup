import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import Loading from "../components/Loading";

export default function Home() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //ดึงข้อมูลมาแสดง
  useEffect(() => {
    setLoading(true); //loading เป็น true เพื่อแสดงว่ากำลังโหลดข้อมูล
    const unsub = onSnapshot( //ใช้ onSnapshot เพื่อติดตามการเปลี่ยนแปลงในคอลเล็กชัน "users"
      collection(db, "users"),
      (snapshot) => {
        let list = []; //เพื่อเก็บข้อมูลผู้ใช้ที่ได้จาก Firestore
        snapshot.docs.forEach((doc) => { //snapshot.docs.forEach เพื่อวนลูปผ่านเอกสารทั้งหมดในคอลเล็กชัน "users"
          list.push({ id: doc.id, ...doc.data() }); //สร้างอ็อบเจกต์ใหม่ที่มี id เป็น id ของเอกสารและข้อมูลอื่นๆ จากเอกสาร
        });
        setUsers(list);
        setLoading(false);
      },
      (error) => {
        console.log(error);
      }
    );

//เรียก unsub() เมื่อคอมโพเนนต์ถูก unmount หรือเกิดการเรียก
// useEffect ใหม่ ซึ่งจะทำให้ยกเลิกการติดตามการเปลี่ยนแปลงในคอลเล็กชัน "users" ที่ Firestore
    return () => {
      unsub();
    };
  }, []);

  //หากกำลังโหลดข้อมูล ให้แสดงหน้านี้ก่อน หรือจะให้แสดง UI อะไรก็ได้
  if (loading) {
    return <Loading/>
  }

  //Delete data
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete data")) { //กล่องข้อความยืนยัน (window.confirm) ที่ถามผู้ใช้ว่าต้องการลบข้อมูลหรือไม่
      try {
        await deleteDoc(doc(db, "users", id));  //deleteDoc ถูกเรียกเพื่อลบเอกสารที่มี id เป็น id ที่ถูกส่งเข้ามาจาก Firestore
        setUsers(users.filter((user) => user.id !== id));
      } catch (error) {
        console.log(error);
      }
    }
  };


  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <>
    <div>
      <button className="btn bg-danger text-white" onClick={logout}>Logout</button>
    </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">NameProduct</th>
            <th scope="col">Detail</th>
            <th scope="col">Content</th>
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {/* เริ่มต้นโดยการตรวจสอบว่า users มีค่า (truthy) หรือไม่ ถ้ามี users จะเข้าสู่บล็อก map เพื่อแสดงข้อมูลผู้ใช้
          การใช้ {users && ...} เป็นการป้องกันการเข้าสู่บล็อก map ในกรณีที่ users มีค่าเป็น null หรือ undefined ซึ่งอาจทำให้เกิดข้อผิดพลาด */}
          
          {/* สรุปการใช้ users && users เพราะถ้าข้อมูมีบางส่วนที่ false, 0, "", null, undefined, ก็จะยังให้สามารถแสดงข้อมูลได้   */}
          {users &&
            users.map((item, key) => (
              <tr key={key}>
                <th scope="row">{item.product}</th>
                <td>{item.detail}</td>
                <td>{item.content}</td>
                <td>
                  <img src={item.img1} width={100} height={50} />
                </td>
                <td>
                  <img src={item.img2} width={100} height={50} />
                </td>
                <td>
                  <img src={item.img3} width={100} height={50} />
                </td>
                <td>
                  <button onClick={() => navigate(`/adddata/${item.id}`)}>
                    Edit
                  </button>
                </td>
                <td>
                  <button onClick={() => handleDelete(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
}
