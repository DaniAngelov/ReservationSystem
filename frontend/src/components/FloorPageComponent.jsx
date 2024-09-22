import React, { useState, useEffect } from 'react'
import './FloorPageComponent.css'
import logo from '../assets/fmi-deskspot-high-resolution-logo-white-transparent.png';
import userIcon from '../assets/user-icon.png';
import { getFloors, uploadFile, getEvents, endEvent, addRoomImage } from '../services/FloorService';
import { BsFillDoorOpenFill } from "react-icons/bs";

import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'
import { Gi3dStairs } from "react-icons/gi";
import { FaPersonWalkingDashedLineArrowRight } from "react-icons/fa6";
import { RiLogoutBoxLine } from "react-icons/ri";
import { IoSettingsSharp } from "react-icons/io5";
import axios from 'axios';
import { Button } from "react-bootstrap";

const FloorPageComponent = ({ setRoom, setFaculty }) => {

  const [newRooms, setNewRooms] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [floorNumbers, setFloorNumbers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [roomImageContent, setRoomImageContent] = useState('');
  const [events, setEvents] = useState([]);
  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const [generateRoomsEnabled, setGenerateRoomsEnabled] = useState(false);
  const [chosenFaculty, setChosenFaculty] = useState('');
  const [chosenFloor, setChosenFloor] = useState('');
  const [chosenRoom, setChosenRoom] = useState('');
  const [userPreferenceForm, setUserPreferenceForm] = useState(false);

  const [roomImageInputEnable, setRoomImageInputEnable] = useState(false);
  const [showRoomImage, setShowRoomImage] = useState(false);
  const [roomOptionsForm, setRoomOptionsForm] = useState(false);
  const [roomOptionsFormPart2, setRoomOptionsFormPart2] = useState(false);
  const [showImageInputField, setShowImageInputField] = useState(true);

  const user = decodedToken.sub;

  const role = decodedToken.role;

  const navigator = useNavigate();

  const setButtonColor = (room) => {
    if (room.roomType == 'COMPUTER') {
      return 'primary';
    } else if (room.roomType == 'SEMINAR') {
      return 'success';
    } else if (room.roomType == 'NORMAL') {
      return 'secondary';
    }
  }

  useEffect(() => {
    getEvents(token)
      .then((response) => {
        console.log("RESPONSE:");
        console.log(response.data);
        const newEvents = [];
        response.data.map(event => {
          newEvents.push(event);
        })
        setEvents(newEvents);
      }).catch(error => {
        console.error(error);
      })
  }, []);

  useEffect(() => {
    getFloors(token).then((response) => {
      const newFloors = [];
      const newMap = [];
      console.log(response.data);
      response.data.map(faculty => {
        faculty.floors.map(
          floor => {
            newFloors.push({ facultyName: faculty.name, floorNumber: floor.floorNumber });
            floor.rooms.map(room => {
              newMap.push({ facultyName: faculty.name, floorNumber: floor.floorNumber, room: room, roomColor: setButtonColor(room) });
            })
          })
      });
      console.log()
      setFaculties(response.data);
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
      <button className='btn btn-user-settings-2 btn-success text-start font-weight-bold' onClick={toggleUserPreferencesForm}>
        <img src={userIcon} width={60} height={60} alt='Responsive image' className='img-fluid' />
        <h4 className='header-user-icon'>{user}</h4>
      </button>
    </div></>)
  }

  const closeShowImageInputField = () => {
    return setShowImageInputField(false);
  }

  const toggleRoomImageInputEnable = () => {
    return setRoomImageInputEnable(!roomImageInputEnable);
  }

  const closeRoomImageInputEnable = () => {
    return setRoomImageInputEnable(false);
  }

  const toggleRoomOptionsForm = () => {
    return setRoomOptionsForm(!roomOptionsForm);
  }

  const closeRoomOptionsForm = () => {
    return setRoomOptionsForm(false);
  }

  const toggleRoomOptionsFormPart2 = () => {
    return setRoomOptionsFormPart2(!roomOptionsFormPart2);
  }

  const closeRoomOptionsFormPart2 = () => {
    return setRoomOptionsFormPart2(false);
  }

  const toggleShowRoomImage = () => {
    return setShowRoomImage(!showRoomImage);
  }

  const closeShowRoomImage = () => {
    return setShowRoomImage(false);
  }

  const toggleGenerateRoomsEnabled = () => {
    return setGenerateRoomsEnabled(!generateRoomsEnabled);
  }

  const toggleUserPreferencesForm = () => {
    return setUserPreferenceForm(!userPreferenceForm);
  }

  const showRooms = (floorNumber, facultyName) => {
    const newMap = [];

    faculties.map(faculty => {
      faculty.floors.map(floor => {
        if (faculty.name == facultyName && floor.floorNumber == floorNumber) {
          floor.rooms.map(room => {
            newMap.push({ facultyName: faculty.name, floorNumber: floor.floorNumber, room: room, roomColor: setButtonColor(room) });
          })
        }
      })
    })

    console.log("newMap")
    console.log(newMap)

    setNewRooms(newMap);
    setIsOpen(true);
  }

  const openRoomImage = () => {
    return (<div>
      <img className='room-content-image' src={roomImageContent} width={175} height={175}></img>
    </div>);
  }

  const onClickOpenRoom = (floor, room, facultyName) => {
    setRoom(room);
    setFaculty(facultyName);
    navigator(`/welcome/floors/${floor}/rooms/${room.roomNumber}`);
  }

  const addNewRoomImage = (e) => {
    e.preventDefault();
    const floorNumber = chosenFloor;
    const roomNumber = chosenRoom.roomNumber;
    const faculty = chosenFaculty;

    const requestDTO = {
      "facultyName": faculty,
      "floorNumber": floorNumber,
      "roomNumber": roomNumber,
      "roomImage": roomImageContent
    }

    console.log(JSON.stringify(requestDTO));
    addRoomImage(JSON.stringify(requestDTO), token).then((response) => {
      alert("Image added successfully!");
      setShowImageInputField(true);
      console.log(response.data);
    }).catch((error) => {
      alert(error.response.data);
      console.log(error);
    });
  }

  const blobToDataURL = (blob, callback) => {
    var a = new FileReader();
    a.onload = function (e) { callback(e.target.result); }
    a.readAsDataURL(blob);
  }

  const callTurningToData = (roomImage) => {
    axios({
      method: 'get',
      url: roomImage,
      responseType: 'blob'
    }).then(function (response) {
      var reader = new FileReader();
      reader.readAsDataURL(response.data);
      blobToDataURL(response.data, function (dataurl) {
        return setRoomImageContent(dataurl);
      });

    })
  }

  const SeatsComponent = () => {


    const GenerateRooms = () => {

      const newRoomsPartOne = newRooms.slice(0, newRooms.length / 2);
      const newRoomsPartTwo = newRooms.slice(newRooms.length / 2, newRooms.length);

      return (

        <div>
          <h2 className='text-light header-floor-position'>{chosenFaculty}, Floor {chosenFloor}</h2>
          <Gi3dStairs size={70} className='stairs-icon-start text-light' />


          <div className="rooms-container border row align-items-start">
            {roomOptionsForm && callRoomOptionsForm()}
            {isOpen && newRoomsPartOne.map((floorAndRoom, idx) => <button onMouseEnter={() => {
              if (floorAndRoom.room.roomImage != null) {
                setRoomImageContent(floorAndRoom.room.roomImage);
                toggleShowRoomImage();
              }
            }} onMouseLeave={() => {
              closeShowRoomImage();
            }}
              className={`room-item-button btn-${floorAndRoom.roomColor} m-5 p-3 text-light text-center`} key={idx} onClick={() => {
                if (role == 'ADMIN') {
                  closeRoomOptionsFormPart2()
                  toggleRoomOptionsForm();
                  closeRoomImageInputEnable();
                  setChosenRoom(floorAndRoom.room);
                } else {
                  onClickOpenRoom(floorAndRoom.floorNumber, floorAndRoom.room, floorAndRoom.facultyName)
                }
              }
              }>

              <BsFillDoorOpenFill size={30} className='mr-2' />
              {floorAndRoom.room.roomNumber}</button>)}
          </div>

          <FaPersonWalkingDashedLineArrowRight size={70} className='person-walking-icon text-light' />
          <Gi3dStairs size={70} className='stairs-icon-end text-light' />

          <div className="rooms-container border row align-items-end">
            {roomOptionsFormPart2 && callRoomOptionsFormPart2()}
            {isOpen && newRoomsPartTwo.map((floorAndRoom, idx) => <button
              onMouseEnter={() => {
                if (floorAndRoom.room.roomImage != null) {
                  setRoomImageContent(floorAndRoom.room.roomImage);
                  toggleShowRoomImage();
                }
              }} onMouseLeave={() => {
                closeShowRoomImage();
              }}
              className={`room-item-button btn-${floorAndRoom.roomColor} m-5 p-3 text-light text-center`} key={idx} onClick={() => {
                if (role == 'ADMIN') {
                  closeRoomOptionsForm();
                  toggleRoomOptionsFormPart2();
                  closeRoomImageInputEnable();
                  setChosenRoom(floorAndRoom.room);
                } else {
                  onClickOpenRoom(floorAndRoom.floorNumber, floorAndRoom.room, floorAndRoom.facultyName)
                }
              }}>
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
        </div >
      )
    }

    return (
      <div>
        {generateRoomsEnabled && GenerateRooms()}
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
                Faculty - Floor
              </a>
              <ul class="dropdown-menu dropdown-floors-item dropdown-menu-dark text-center">

                {floorNumbers.map((floor, idx) => {
                  return <li key={idx}><a className="dropdown-item" onClick={() => {
                    setChosenFaculty(floor.facultyName);
                    setChosenFloor(floor.floorNumber);
                    { generateRoomsEnabled == false && toggleGenerateRoomsEnabled() }
                    showRooms(floor.floorNumber, floor.facultyName);
                  }
                  }>
                    {floor.facultyName}- Floor {floor.floorNumber}</a></li>
                })
                }
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
        console.log(response.data);
      })
        .catch((error) => {
          console.log("error: " + error);
          console.log(error);
        })
    }

    return (<>
      {role == 'ADMIN' && <div class="border custom-file-3 mb-3">
        <input type="file" class="custom-file-input" onChange={handleFileSelected} required />
        <label class="custom-file-label col-md-2 input-label-file" >Choose file...</label>
      </div>}
    </>)
  }

  const checkIfEventStillContinues = () => {

    console.log("THIS EVENTS")
    console.log(events)
    events.map(event => {
      let eventEndDate = event.duration.endDate.replace('T', ' ');
      const nowTime = new Date(Date.now());
      const newEndDate = new Date(eventEndDate);
      if (Date.parse(nowTime) > Date.parse(newEndDate)) {
        const request = {
          "name": event.name
        }
        console.log(JSON.stringify(request))
        endEvent(JSON.stringify(request), token).then((response) => {
          console.log("response");
          console.log(response.data);
        }).catch((error) => {
          console.log("error");
          console.log(error);
        })
      }
    })
  }

  const logOut = () => {
    localStorage.clear();
    navigator('/login');
  }

  const callLogOut = () => {
    return (<div>
      <button className='btn btn-danger text-light' onClick={() => { logOut() }}>
        Log out
      </button>
    </div>)
  }

  const callUserPreferenceForm = () => {
    return (<div>
      <button className='btn-navigate-user-settings-floors btn btn-outline-success my-2 my-sm-0' onClick={() => {
        navigateToUserSettings();
      }}>
        <IoSettingsSharp size={30} /> Settings
      </button>
      <button className='btn-user-logout-setting-floors btn btn-outline-info my-2 my-sm-0' onClick={() => {
        logOut();
      }}>
        <RiLogoutBoxLine size={30} /> Log out
      </button>
    </div>)
  }

  const callRoomOptionsForm = () => {
    return (<div className='row room-options-buttons'>

      <Button className='btn-primary p-2 w-25' onClick={() => {
        onClickOpenRoom(chosenFloor, chosenRoom, chosenFaculty)
      }}>Enter</Button>

      <Button className='btn-primary p-2 ml-2 w-25' onClick={() => {
        toggleRoomImageInputEnable();
        closeRoomOptionsForm();
      }}>Add image</Button>

    </div>)
  }

  const callRoomOptionsFormPart2 = () => {
    return (<div className='row room-options-buttons'>

      <Button className='btn-primary p-2 w-25' onClick={() => {
        onClickOpenRoom(chosenFloor, chosenRoom, chosenFaculty)
      }}>Enter</Button>

      <Button className='btn-primary p-2 ml-2 w-25' onClick={() => {
        toggleRoomImageInputEnable();
        closeRoomOptionsFormPart2();
      }}>Add image</Button>

    </div>)
  }

  const openImageForm = () => {
    return <div>
      {showImageInputField && <div class="form-floating room-img-form text-center mb-3 mt-4 bg-light">
        <input class="form-control text-center" id="floatingInput10" placeholder="Image insert" onPasteCapture={(e) => {
          setRoomImageContent(URL.createObjectURL(e.clipboardData.files[0]));
          closeShowImageInputField();
        }} />
        <label for="floatingInput10 text-center mt-3">Paste image</label>
      </div>}
      {showImageInputField == false &&
        <img src={roomImageContent} className='room-content-image-preview' width={175} height={175} />}
      {callTurningToData(roomImageContent)}
      {showImageInputField == false && <Button className='btn-add-room-image p-3 btn-success mt-3' onClick={(e) => {
        toggleRoomImageInputEnable();
        addNewRoomImage(e)
      }}>Add new image</Button>}

    </div>
  }

  return (
    <>
      <SidebarLeftComponent />
      {SeatsComponent()}
      <UploadFile />
      <OpenUserSettings />
      {callLogOut()}
      {checkIfEventStillContinues()}
      {showRoomImage && openRoomImage()}
      {userPreferenceForm && callUserPreferenceForm()}
      {roomImageInputEnable && openImageForm()}
    </>
  )
}

export default FloorPageComponent