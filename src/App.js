import { useState } from "react";
import './App.css';

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
  
];
function Button({children,onClick})
  {  return(
    <button className="button" onClick={onClick}>{children}</button >
  );
  }
function App() {
  const[friends,setFriends]=useState(initialFriends);   
  const[showAddfriend,setShowAddfriend]=useState(false);
  const[selectFriend,setselectFriend]=useState(null);

  function handalShowAddFriend()
  {   
    setShowAddfriend((show)=>!show);
  }
  function handalAddFriend(friend)
  {  
    setFriends((friends)=>[...friends,friend]);
   setShowAddfriend(false) 
   
  }
  function handalSelection(friend)
  {
    //  setselectFriend(friend);
    setselectFriend((selected) => (selected?.id === friend.id ? null:friend) )
    setShowAddfriend(false);
    
  }
  function handalBillSplit(value)
  {    setFriends((friends)=>
    friends.map((friend)=>
    friend.id === selectFriend.id 
    ?{...friend,balance :friend.balance + value}
    :friend));
    setselectFriend(null);
  }
  return (
   <div className='app'>
    <div className='sidebar'>
      
      <FriendList 
        friends={friends}
        selectFriend={selectFriend}
         onselection={handalSelection}/>

      {showAddfriend && <FormAddFriend onaddfriends={handalAddFriend}/>}
      <Button onClick={handalShowAddFriend}>
        {showAddfriend ?"close":"Add Friend"}</Button>      
    </div>
  {selectFriend && 
  <FromSplitBill 
        selectFriend={selectFriend}     
        onSplitBill={handalBillSplit} 
        key={selectFriend.id}/>}

   </div>
  );
}
function FriendList({friends,onselection,selectFriend})
{ 
  return(
   
   <ul>

    {friends.map((friends) =>
      <Friend 
      friend={friends}
       key={friends.id}
      selectFriend={selectFriend}
       onselection={onselection}/>
       
       )}
    </ul>
   
  );
}
function Friend({friend,onselection,selectFriend})
{
  const isselected = selectFriend?.id === friend.id;
  return(
    <li className={isselected ? "selected":""}>
     <img src={friend.image} alt={friend.name}/> 
      <h3>  {friend.name}</h3>

      {friend.balance < 0 &&(
      <p className='red'>
        You Own {friend.name}{Math.abs(friend.balance)}$</p>)}

      {friend.balance > 0 &&(
      <p className='green'>
        {friend.name} Owes You {Math.abs(friend.balance)}$</p>)}

      {friend.balance === 0 &&
      <p>You And {friend.name} are even </p>}
     
     <Button onClick={()=>onselection(friend)}>
      {isselected ? "close":"select"}
      </Button>
       </li>
       
  );
}
function FormAddFriend({onaddfriends})
{
  const[name,setname]=useState("")
  const[image,setimage]=useState("https://i.pravatar.cc/48")

  function hanadalSubmit(e)
  {
    e.preventDefault();
    
   if(!name || !image) return;
    const id = crypto.randomUUID();
    const  newFriend={
      id,
      name,
      image:`${image}?=${id}`,
      balance:0,
    };

 onaddfriends(newFriend);
     
    setname("");
    setimage("https://i.pravatar.cc/48");

  }
  return(
    <form className="from-add-frend" onSubmit={hanadalSubmit}>
      <label>👫 friend Name</label>
      <input type="text" value={name} 
      onChange={(e)=> setname(e.target.value)}/>

      <label>🌄Image Url </label>
      <input type="text" value={image} 
      onChange={(e)=> setimage(e.target.value)}/>

      <Button> Add</Button>
    </form>
  );
}
function FromSplitBill({selectFriend,onSplitBill})
{
  const[bill,setBill]=useState("")
  const[paidByUser,setPaidByUser]=useState("")
  const PayedByFriend =bill? bill-paidByUser:"";
  const[whoIsPaying,setWhoIsPaying]=useState("user")
 
  function hanadalSubmit(e)
  {
    e.preventDefault();
   if(!bill || !paidByUser)return;
   onSplitBill(whoIsPaying === "user" ? PayedByFriend : -paidByUser);
  }
   
  return(
  <form className="form-split-bill" onSubmit={hanadalSubmit} >
    <h2>Split Bill With {selectFriend.name}</h2>

    <label> 💰 Bill Value </label>
      <input type="text" value={bill} 
      onChange={(e)=>setBill(Number(e.target.value))} />

    <label>🧍‍♀️ Your expance </label>
    <input type="text" value={paidByUser}  
    onChange={(e)=>setPaidByUser(Number(e.target.value)>bill ? paidByUser :Number(e.target.value))}/>

    <label> 👫{selectFriend.name}'s  expanse </label>
    <input type="text" disabled value={PayedByFriend }/>

   <label>🤑 Who is paying the Bill</label>
   <select value={whoIsPaying} 
     onChange={(e)=>setWhoIsPaying(e.target.value)}>
    <option value="user">You</option>
    <option value="friend">{selectFriend.name}</option>
   </select>
   <Button>Split Bill</Button>
  </form>
  );
}

export default App;

