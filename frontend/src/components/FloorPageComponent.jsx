import React, { useState, useEffect } from 'react'
import './FloorPageComponent.css'
import logo from '../assets/fmi-deskspot-high-resolution-logo-white-transparent.png';
import userIcon from '../assets/user-icon.png';
import { getFloors, uploadFile } from '../services/FloorService';
import { BsFillDoorOpenFill } from "react-icons/bs";

import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'

const FloorPageComponent = ({ setRoom }) => {

  const [newRooms, setNewRooms] = useState([]);
  const [floors, setFloors] = useState([]);
  const [floorNumbers, setFloorNumbers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);

  const user = decodedToken.sub;


  const navigator = useNavigate();


  const setButtonColor = (room) => {
    console.log("Room type here: " + room.roomType)
    if (room.roomType == 'COMPUTER') {
      return 'primary';
    } else if (room.roomType == 'SEMINAR') {
      return 'success';
    } else if (room.roomType == 'NORMAL') {
      return 'secondary';
    }
  }

  useEffect(() => {
    getFloors(token).then((response) => {
      const newFloors = [];
      const newMap = [];
      response.data.map(floor => {
        newFloors.push(floor.floorNumber);
        floor.rooms.map(room => {
          newMap.push({ floorNumber: floor.floorNumber, room: room, roomColor: setButtonColor(room) });
        })
      });
      setFloors(response.data);
      setFloorNumbers(newFloors);
      setNewRooms(newMap);

    }).catch(error => {
      console.error(error);
    })
  }, []);

  const navigateToUserSettings = () => {
    navigator('/settings');
  }

  const OpenUserSettings = () => {
    return (<><div className='container'>
      <button className='btn btn-user-settings-2 btn-success text-start font-weight-bold' onClick={navigateToUserSettings}>
        <img src={userIcon} width={60} height={60} alt='Responsive image' className='img-fluid mr-5' />
        <h4 className='header-user-icon'>{user}</h4>
      </button>
    </div></>)
  }

  const showRooms = (floorNumber) => {
    const newMap = [];
    floors.map(floor => {
      if (floor.floorNumber === floorNumber) {
        floor.rooms.map(room => {
          newMap.push({ floorNumber: floor.floorNumber, room: room, roomColor: setButtonColor(room) });
        })
      }
    })

    setNewRooms(newMap);
    setIsOpen(true);
  }


  const SeatsComponent = () => {

    const onClickOpenRoom = (floor, room) => {
      setRoom(room);
      navigator(`/welcome/floors/${floor}/rooms/${room.roomNumber}`);
    }

    const GenerateRooms = () => {
      return (
        <div className="container">
          <div className="position-absolute top-50 start-50 translate-middle">
            {isOpen && newRooms.map((floorAndRoom, idx) =>
              <button
                className={`btn-${floorAndRoom.roomColor} m-4 p-3 text-light text-center`} key={idx} onClick={() => onClickOpenRoom(floorAndRoom.floorNumber, floorAndRoom.room)}>
                <BsFillDoorOpenFill size={30} className='mr-2' />
                {floorAndRoom.room.roomNumber}</button>)}

          </div>
          <ul className='example-rooms bg-dark text-light p-2'>
            Types of rooms:
            <li
              className={`btn-primary m-4 p-3 text-light text-center`} >
              <BsFillDoorOpenFill size={20} className='mr-2' />
              Computer
            </li>
            <li
              className={`btn-success m-4 p-3 text-light text-center`} >
              <BsFillDoorOpenFill size={20} className='mr-2' />
              Seminar
            </li>
            <li
              className={`btn-secondary m-4 p-3 text-light text-center`} >
              <BsFillDoorOpenFill size={20} className='mr-2' />
              Normal
            </li>
          </ul>
        </div>
      )
    }

    return (
      <div>
        <h1 class='header-title'
          className='text-center display-1 fw-bold text-light font-weight-bold position-absolute top-0 start-50 translate-middle mt-5'>FMI DeskSpot</h1>
        <GenerateRooms />
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

            <div className="dropdown">
              <a class="btn dropdown-floors btn-secondary dropdown-toggle bt-5" type="button" data-bs-toggle="dropdown" aria-expanded="false" data-bs-theme="dark">
                Floors
              </a>
              <ul class="dropdown-menu dropdown-floors-item dropdown-menu-dark text-center">
                {floorNumbers.map((floor, idx) => {
                  return <li key={idx}><a className="dropdown-item" onClick={() => showRooms(floor)}>{floor}</a></li>
                })}

              </ul>
            </div>
          </div>
        </div>

      </>
    )
  }

  const UploadFile = () => {


    const handleFileSelected = (e) => {
      const newFormData = new FormData();
      const file = e.target.files[0];
      newFormData.append('file', file, file.name);
      uploadFile(newFormData, token).then((response) => {
        console.log("Response" + response.data)
      })
        .catch((error) => {
          console.log("error: " + error);
        })
    }

    return (<>
      <div class="custom-file-3 mb-3">
        <input type="file" class="custom-file-input" id="validatedCustomFile" onChange={handleFileSelected} required />
        <label class="custom-file-label col-md-2" for="validatedCustomFile">Choose file...</label>
      </div>
    </>)
  }

  return (
    <>
      <SidebarLeftComponent />
      <SeatsComponent />
      <UploadFile />
      <OpenUserSettings />
    </>
  )
}

export default FloorPageComponent