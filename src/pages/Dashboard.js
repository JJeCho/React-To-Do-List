import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { query, collection, getDocs, where ,onSnapshot, addDoc, serverTimestamp, orderBy} from "firebase/firestore";
import {TextField , Button } from '@mui/material';
import Task from '../components/Task';
import { auth,
    db,
    logout, } from '../database/config';
function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const [tasks, setTasks]=useState([]);
  const [input, setInput]=useState('');
  const [color, setColor] = useState('');
  const navigate = useNavigate();
  const fetchUserName = async () => {
    try {
        if(user.isAnonymous==true) {
            setName("Guest");
        }
        else {
            const q = query(collection(db, "users"), where("uid", "==", user.uid));
            const doc = await getDocs(q);
            const data = doc.docs[0].data();
            setName(data.name);
        }
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

  useEffect(() => {
    const q = query(collection(db, "tasks"),where("uid", "==", user.uid),orderBy('timestamp','desc'));
    onSnapshot(q,(snapshot)=>{
        setTasks(snapshot.docs.map(doc=>({
          id: doc.id,
          item: doc.data()
        })))
   })
},[input]);

const addTask=(e)=>{
    e.preventDefault();
       addDoc(collection(db,'tasks'),{
         task:input,
         timestamp: serverTimestamp(),
         color:color,
         uid:user.uid
       })
       console.log('click')
      setInput('')
  };

  const randColor = () =>  {
    return "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0').toUpperCase();
}

  const addRandomTask=(e)=>{
    var randomColor = randColor();
    console.log(randomColor)
    e.preventDefault();
    fetch('http://www.boredapi.com/api/activity/')
    .then(res => res.json())
    .then(res => addDoc(collection(db,'tasks'),{
      task: res.activity,
      accessibility: res.accessibility,
      type: res.accessibility,
      participants: res.participants,
      price: res.price,
      link: res.link,
      timestamp: serverTimestamp(),
      color:randomColor,
      uid:user.uid
    }))
      console.log('click')
      setInput('')
  };

  

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchUserName();
  }, [user, loading]);


  return (
    <div className="dashboard">
        <div className="dashboard__container">
        Logged in as
         <div>{name}</div>
         <div>{user?.email}</div>
         <button className="dashboard__btn" onClick={logout}>
          Logout
         </button>
       </div>
       <form>
         <TextField label="Make Task" style={{margin:"0px 5px"}} size="small" value={input}
         onChange={e=>setInput(e.target.value)} />
        <label for="color">Select your color:</label>
        <input type="color" id="color" name="color" list="presets" value={color} onInput={e=>setColor(e.target.value)}></input>
        <datalist id="presets">
          <option value="#ffffff">White</option>
          <option value="#e0ffff">Cyan</option>
          <option value="#add8e6">Blue</option>
          <option value="#90ee90">Green</option>
          <option value="#fafad2">Yellow</option>
          <option value="#ffb6c1">Pink</option>
        </datalist>
        <Button onClick={addTask}  >Add Task</Button>
        <Button onClick={addRandomTask}  >Add Random Task</Button>
      </form>
      <ul>
          {tasks.map(item=> 
          <Task key={item.id} arr={item}></Task>)
          }
      </ul>
     </div>
  );
}
export default Dashboard;