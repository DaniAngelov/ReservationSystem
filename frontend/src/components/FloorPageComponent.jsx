import React, { useState, useEffect } from 'react'
import './FloorPageComponent.css'
import logo from '../assets/fmi-deskspot-high-resolution-logo-white-transparent.png';
import { getFloors } from '../services/FloorService';

import { useNavigate } from 'react-router-dom';

const FloorPageComponent = () => {

  const [newRooms, setNewRooms] = useState([]);
  const [floors, setFloors] = useState([]);
  const [floorNumbers, setFloorNumbers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const navigator = useNavigate();

  useEffect(() => {
    getFloors().then((response) => {
      const newRooms = [];
      const newFloors = [];
      const newMap = [];
      response.data.map(floor => {
        newFloors.push(floor.floorNumber);
        floor.rooms.map(room => {
          newMap.push({ floorNumber: floor.floorNumber, roomNumber:room.roomNumber});
          newRooms.push(room.roomNumber);
        })
      });
      setFloors(response.data);
      setFloorNumbers(newFloors);
      setNewRooms(newMap);
      
    }).catch(error => {
      console.error(error);
    })
  }, []);

  const showRooms = (floorNumber) => {
    const newMap = [];
    floors.map(floor => {
      if(floor.floorNumber === floorNumber){
        floor.rooms.map(room => {
          newMap.push({ floorNumber: floor.floorNumber, roomNumber:room.roomNumber});
        })
      }
    })
    
    setNewRooms(newMap);
    setIsOpen(true);
  }


  const SeatsComponent = () => {

    const onClickOpenRoom = (floor,room) => {
      console.log(floor);
      console.log(room);
      navigator(`/welcome/floors/${floor}/rooms/${room}`);
    }

    const DrawGrid = () => {
      return (
        <div className="container">
          <table className="grid position-absolute top-50 start-50 translate-middle">
            <tbody>
              <tr>
                {isOpen && newRooms.map((floorAndRoom,idx) =>
                  <td
                    className='room'
                    key={idx} onClick={e => onClickOpenRoom(floorAndRoom.floorNumber,floorAndRoom.roomNumber)}>
                    {floorAndRoom.roomNumber} </td>)}
              </tr>
            </tbody>
          </table>
        </div>
      )
    }

    return (
      <div>
        <h1 class='header-title'
          className='text-center display-1 fw-bold text-light font-weight-bold position-absolute top-0 start-50 translate-middle mt-5'>FMI DeskSpot</h1>
        <DrawGrid />
      </div>
    )
  }

  const SidebarLeftComponent = () => {
    return (
      <>
        <div className="container-fluid mt-3">
          <div className="sidebar-left">
            <div className="sd-header">
              <img src={logo} width={135} height={135} alt='Responsive image' className='img-fluid logoImage' />
            </div>

            <div className="sd-body drop">
              <a class="btn btn-secondary dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Floors
              </a>
              <ul class="dropdown-menu">
                {floorNumbers.map((floor,idx) => {
                 return <li key ={idx}><a  className="dropdown-item" onClick={() => showRooms(floor)}>{floor}</a></li>
                })}
              </ul>
              <ul>
                <li><button className="btn btn-primary submitButton sd-link text-light">Reserve your spot now!</button></li>
              </ul>
            </div>
          </div>
        </div>

      </>
    )
  }

  return (
    <div>
      <SidebarLeftComponent />
      <SeatsComponent />
    </div>
  )
}

export default FloorPageComponent