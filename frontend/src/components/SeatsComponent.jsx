// import React, { useState, useEffect } from 'react'
// import { getFloors } from '../services/FloorService';
// import { useParams } from 'react-router-dom';

// const SeatsComponent = () => {
//   const [seats, setSeats] = useState([]);
//   const [seatAvailable, setSeatAvailable] = useState([]);
//   const [seatReserved, setSeatReserved] = useState([]);

//   const { floorId, roomId } = useParams();

//   const ToggleSidebarAlways = () => {
//     setIsopen(true);
//   }

//   useEffect(() => {
//     getFloors().then((response) => {
//       const newSeats = [];
//       response.data.map(floor => {
//         floor.rooms.map(room => {
//           if (floorId == floor.floorNumber && roomId == room.roomNumber) {
//             room.seats.map(seat => {
//               newSeats.push(seat.seatNumber);
//             });
//           }
//         })
//       });
//       setSeats(newSeats);
//       setSeatAvailable(newSeats);
//     }).catch(error => {
//       console.error(error);
//     })
//   }, []);


//   const onClickData = (seat) => {

//     if (seatReserved.indexOf(seat) > -1) {
//       setSeatAvailable(seatAvailable.concat(seat));
//       setSeatReserved(seatReserved.filter(res => res != seat));
//     } else {
//       ToggleSidebarAlways();
//       const userDTO = {
//         "username": "asd",
//         "seat": { "seatNumber": seat }
//       }
//       console.log(JSON.stringify(userDTO));
//       reserveSpot(JSON.stringify(userDTO)).then((response) => {
//         console.log(response.data);
//       });

//       setSeatReserved(seatReserved.concat(seat));
//       setSeatAvailable(seatAvailable.filter(res => res != seat));
//     }
//   }

//   const DrawGrid = () => {
//     return (
//       <div className="container">
//         <table className="grid position-absolute top-50 start-50 translate-middle">
//           <tbody>
//             <tr>
//               {seats.map((seat, idx) =>
//                 <td
//                   className='seat-button fa fa-times'
//                   key={idx} onClick={e => onClickData(seat)}>{seat}
//                   <i className="fa fa-bars"></i> </td>)}
//             </tr>
//           </tbody>
//         </table>
//       </div>
//     )
//   }

//   return (
//     <div>
//       <h1 class='header-title'
//         className='text-center display-2  text-light font-weight-bold position-absolute top-0 start-50 translate-middle mt-5'>FMI DeskSpot</h1>
//       <DrawGrid />
//     </div>
//   )
// }

// export default SeatsComponent