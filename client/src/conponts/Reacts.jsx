// import React, { useState } from "react";

// function Reacts() {
//   const [user, setUser] = useState({ name: "james", age: 32 });
//   function cahnHandler(e) {
//      setUser((old)=> {
//       return {...old, name:e.target.value}
//      })

     
//   }
//  function addAge(e) {
//    setUser((age)=> {
//     return {...age,age:e.target.value}
//    })
//  }
//   return (
//     <div>
//       <div>react</div>

//       <div>
//         {" "}
//         name {user.name} my age is: {user.age}
//       </div>

//       <form action="">
//         <input
//           type="text"
//           placeholder="input  ur name"
//           onChange={cahnHandler}
//           name=""
//           id=""
//         />
//         <br />
//         <input
//           type="text"
//           placeholder="input  ur age"
//           onChange={addAge}
//           name=""
//           id=""
//         />
//       </form>
//     </div>
//   );
// }

// export default Reacts;


 import React from 'react'
 
 function Reacts() {

  const car=[
  "car",'car2','car3','car4'
  ]
   return (
     <div>
       <div>
        <h3>{car.map((item)=> {
          <li> {item[0]} </li>
        })}</h3>

       </div>
     </div>
   )
 }
 
 export default Reacts
