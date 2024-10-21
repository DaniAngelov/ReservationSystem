import React, { useState, useEffect } from 'react'
import './FloorPageComponent.css'
import logo from '../assets/fmi-deskspot-high-resolution-logo-white-transparent.png';
import dataJson from '../assets/data.json';
import teamsDataJson from '../assets/teams.json';
import userIcon from '../assets/user-icon.png';
import { getFloors, uploadFile, getEvents, endEvent, addRoomImage, exportData, getSpecificEvent } from '../services/FloorService';
import { BsFillDoorOpenFill } from "react-icons/bs";

import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'
import { Gi3dStairs } from "react-icons/gi";
import { FaPersonWalkingDashedLineArrowRight } from "react-icons/fa6";
import { RiLogoutBoxLine } from "react-icons/ri";
import { IoSettingsSharp } from "react-icons/io5";
import axios from 'axios';
import { Button } from "react-bootstrap";
import { HiDesktopComputer } from "react-icons/hi"
import { LuCable } from "react-icons/lu";
import { getUserByUsername, getUsers, reserveTeam, reserveTeamJSON } from '../services/UserService';

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

  const [importDataForm, setImportDataForm] = useState(false);

  const [newLanguage, setNewLanguage] = useState('');

  const [uploadFileAlert, setUploadFileAlert] = useState(false);
  const [uploadFileTeamsAlert, setUploadFileTeamsAlert] = useState(false);

  const [teamName, setTeamName] = useState('');
  const [teamNumber, setTeamNumber] = useState(0);
  const [teamEvent, setTeamEvent] = useState('');
  const [teamOccupiesCharger, setTeamOccupiesCharger] = useState(false);
  const [teamOccupiesComputer, setTeamOccupiesComputer] = useState(false);

  const [uploadDataText, setUploadDataText] = useState('');

  const user = decodedToken.sub;

  const role = decodedToken.role;

  const navigator = useNavigate();

  const [importDataFromJson, setImportDataFromJson] = useState(true);
  const [importDataForTeam, setImportDataForTeam] = useState(false);

  const [computerColor, setComputerColor] = useState('white');
  const [chargerColor, setChargerColor] = useState('white');

  const toggleOccupiesComputer = () => {
    return setTeamOccupiesComputer(!teamOccupiesComputer);
  }

  const toggleOccupiesCharger = () => {
    return setTeamOccupiesCharger(!teamOccupiesCharger);
  }

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
    getUserByUsername(user, token).then((response) => {
      console.log("response for current user")
      console.log(response.data);
      setNewLanguage(response.data.languagePreferred);
    }).catch((error) => {
      console.log("error");
      console.log(error);
    })
  }, []);

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

  const toggleImportDataFromJson = () => {
    return setImportDataFromJson(true);
  }

  const closeImportDataFromJson = () => {
    return setImportDataFromJson(false);
  }

  const toggleImportDataForTeam = () => {
    return setImportDataForTeam(true);
  }

  const closeImportDataForTeam = () => {
    return setImportDataForTeam(false);
  }

  const toggleUploadFileTeamsAlert = (text) => {
    setUploadDataText(text);
    return setUploadFileTeamsAlert(true);
  }

  const closeUploadFileTeamsAlert = () => {
    return setUploadFileTeamsAlert(false);
  }


  const toggleUploadFileAlert = (text) => {
    setUploadDataText(text);
    return setUploadFileAlert(true);
  }

  const closeUploadFileAlert = () => {
    return setUploadFileAlert(false);
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

  const toggleImportDataForm = () => {
    return setImportDataForm(!importDataForm);
  }

  const closeImportDataForm = () => {
    return setImportDataForm(false);
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

  const closeGenerateRoomsEnabled = () => {
    return setGenerateRoomsEnabled(false);
  }

  const toggleUserPreferencesForm = () => {
    return setUserPreferenceForm(!userPreferenceForm);
  }

  const closeUserPreferencesForm = () => {
    return setUserPreferenceForm(false);
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
      { newLanguage == 'ENG' && alert("Image added successfully!") }
      { newLanguage == 'BG' && alert("Изобржанието е добавено!") }
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
          <h2 className='text-light header-floor-position'>{chosenFaculty},
            {newLanguage == 'ENG' && ' Floor '}
            {newLanguage == 'BG' && ' Етаж '}
            {chosenFloor}</h2>
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
            {newLanguage == 'ENG' && 'Types of rooms:'}
            {newLanguage == 'BG' && 'Типове стаи:'}
            <li
              className={`btn-primary m-3 p-3 text-light text-center`} >
              <BsFillDoorOpenFill size={20} className='mr-2' />
              {newLanguage == 'ENG' && 'Computer'}
              {newLanguage == 'BG' && 'Компютърна'}
            </li>
            <li
              className={`btn-success m-3 p-3 text-light text-center`} >
              <BsFillDoorOpenFill size={20} className='mr-2' />
              {newLanguage == 'ENG' && 'Seminar'}
              {newLanguage == 'BG' && 'Семинарна'}
            </li>
            <li
              className={`btn-secondary m-3 p-3 text-light text-center`} >
              <BsFillDoorOpenFill size={20} className='mr-2' />
              {newLanguage == 'ENG' && 'Normal'}
              {newLanguage == 'BG' && 'Нормална'}
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
        <div className="container-fluid">
          <div className="sidebar-left">
            <div className="sd-header">
              <img src={logo} width={135} height={135} alt='Responsive image' className='img-fluid logoImage' />
            </div>

            <div className="dropdown">
              <a class="btn dropdown-floors btn-secondary dropdown-toggle bt-5" type="button" data-bs-toggle="dropdown" aria-expanded="false" data-bs-theme="dark">
                {newLanguage == 'ENG' && 'Faculty - Floor'}
                {newLanguage == 'BG' && 'Факултет - Етаж'}
                {console.log("newLanguage")}
                {console.log(newLanguage)}
              </a>
              <ul class="dropdown-menu dropdown-floors-item dropdown-menu-dark text-center">

                {floorNumbers.map((floor, idx) => {
                  return <li key={idx}><a className="dropdown-item" onClick={() => {
                    setChosenFaculty(floor.facultyName);
                    setChosenFloor(floor.floorNumber);
                    { generateRoomsEnabled == false && toggleGenerateRoomsEnabled() }
                    showRooms(floor.floorNumber, floor.facultyName);
                    closeImportDataForm();
                    closeUserPreferencesForm();
                    closeUploadFileAlert();
                  }
                  }>
                    {floor.facultyName} -
                    {newLanguage == 'ENG' && ' Floor '}
                    {newLanguage == 'BG' && ' Етаж '}
                    {floor.floorNumber}</a></li>
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
        { newLanguage == 'ENG' && toggleUploadFileAlert('Successful import of file!'); }
        { newLanguage == 'BG' && toggleUploadFileAlert('Успешно зареждане на файла!') }
      })
        .catch((error) => {
          { newLanguage == 'ENG' && toggleUploadFileAlert(`Failed import of file! Error: ${error.response.data}`) }
          { newLanguage == 'BG' && toggleUploadFileAlert(`Неуспешно зареждане на файла! Грешка: "${error.response.data}"`) }
          console.log("error: " + error);
          console.log(error);
        })
    }

    return (<>
      <div class=" custom-file-3 mb-3">
        <input type="file" class="custom-file-input" onChange={handleFileSelected} required />
        <label class="custom-file-label" >
          {newLanguage == 'ENG' && 'Choose file...'}
          {newLanguage == 'BG' && 'Избери файл...'}
        </label>
      </div>
    </>)
  }

  const UploadTeamsFile = () => {
    const handleFileSelectedTeams = (e) => {
      const newFormData = new FormData();
      const file = e.target.files[0];
      newFormData.append('file', file, file.name);
      reserveTeamJSON(newFormData, token).then((response) => {
        console.log("Response" + response.data)
        console.log(response.data);
        { newLanguage == 'ENG' && toggleUploadFileAlert('Team successfully created and seats reserved!'); }
        { newLanguage == 'BG' && toggleUploadFileAlert('Успешно създаване на отбор и запазване на места!') }
      })
        .catch((error) => {
          { newLanguage == 'ENG' && toggleUploadFileAlert(`Failed import of file! Error: ${error.response.data}`) }
          { newLanguage == 'BG' && toggleUploadFileAlert(`Неуспешно зареждане на файла! Грешка: "${error.response.data}"`) }
          console.log("error: " + error);
          console.log(error);
        })
    }

    return (<>
      <div class=" custom-file-teams mb-3">
        <input type="file" class="custom-file-input" onChange={handleFileSelectedTeams} required />
        <label class="custom-file-label" >
          {newLanguage == 'ENG' && 'Choose file...'}
          {newLanguage == 'BG' && 'Избери файл...'}
        </label>
      </div>
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
        {newLanguage == 'ENG' && ' Logout '}
        {newLanguage == 'BG' && ' Логуат '}
      </button>
    </div>)
  }

  const callUserPreferenceForm = () => {
    return (<div>
      <button className='btn-navigate-user-settings-floors btn btn-outline-success my-2 my-sm-0' onClick={() => {
        navigateToUserSettings();
      }}>
        <IoSettingsSharp size={30} />
        {newLanguage == 'ENG' && 'Settings'}
        {newLanguage == 'BG' && 'Настройки'}
      </button>
      <button className='btn-user-logout-setting-floors btn btn-outline-info my-2 my-sm-0' onClick={() => {
        logOut();
      }}>
        <RiLogoutBoxLine size={30} />
        {newLanguage == 'ENG' && 'Logout'}
        {newLanguage == 'BG' && 'Логаут'}
      </button>
    </div>)
  }

  const callRoomOptionsForm = () => {
    return (<div className='row room-options-buttons'>

      <Button className='btn-primary p-2 w-25' onClick={() => {
        onClickOpenRoom(chosenFloor, chosenRoom, chosenFaculty)
      }}>{newLanguage == 'ENG' && 'Еnter'}
        {newLanguage == 'BG' && 'Влез'}</Button>

      <Button className='btn-primary p-2 ml-2 w-25' onClick={() => {
        toggleRoomImageInputEnable();
        closeRoomOptionsForm();
      }}>
        {newLanguage == 'ENG' && 'Add image'}
        {newLanguage == 'BG' && 'Добави снимка'}</Button>

    </div>)
  }

  const callRoomOptionsFormPart2 = () => {
    return (<div className='row room-options-buttons'>

      <Button className='btn-primary p-2 w-25' onClick={() => {
        onClickOpenRoom(chosenFloor, chosenRoom, chosenFaculty)
      }}>{newLanguage == 'ENG' && 'Еnter'}
        {newLanguage == 'BG' && 'Влез'}</Button>

      <Button className='btn-primary p-2 ml-2 w-25' onClick={() => {
        toggleRoomImageInputEnable();
        closeRoomOptionsFormPart2();
      }}>
        {newLanguage == 'ENG' && 'Add image'}
        {newLanguage == 'BG' && 'Добави снимка'}
      </Button>
    </div>)
  }

  const openImageForm = () => {
    return <div>
      {showImageInputField && <div class="form-floating room-img-form text-center mb-3 mt-4 bg-light">
        <input class="form-control text-center" id="floatingInput10" placeholder="Image insert" onPasteCapture={(e) => {
          setRoomImageContent(URL.createObjectURL(e.clipboardData.files[0]));
          closeShowImageInputField();
        }} />
        <label for="floatingInput10 text-center mt-3">
          {newLanguage == 'ENG' && 'Paste image'}
          {newLanguage == 'BG' && 'Постави снимка'}
        </label>
      </div>}
      {showImageInputField == false &&
        <img src={roomImageContent} className='room-content-image-preview' width={175} height={175} />}
      {callTurningToData(roomImageContent)}
      {showImageInputField == false && <Button className='btn-add-room-image p-3 btn-success mt-3' onClick={(e) => {
        toggleRoomImageInputEnable();
        addNewRoomImage(e)
      }}> {newLanguage == 'ENG' && 'Add new image'}
        {newLanguage == 'BG' && 'Добави нова снимка'}</Button>}

    </div>
  }

  const onClickExportFile = (e) => {
    e.preventDefault();

    exportData(token).then((response) => {
      console.log("Response data:")
      console.log(response.headers.get("Content-Disposition").split('"')[1])

      const element = document.createElement("a");
      const textFile = new Blob([JSON.stringify(response.data)], { type: 'text/plain' }); //pass data from localStorage API to blob
      element.href = URL.createObjectURL(textFile);
      element.download = "data.json";
      document.body.appendChild(element);
      element.click();
    })
      .catch((error) => {
        alert(error.response.data);
        console.log(error.response.data);
      });
  }

  const exportFile = () => {
    return <div>
      <Button className='export-file-btn btn-primary p-2' onClick={(event) => {
        onClickExportFile(event);
      }}>{newLanguage == 'ENG' && 'Export data file'}
        {newLanguage == 'BG' && 'Сваляне на файл с данни'}</Button>

    </div>
  }

  const importFile = () => {
    return <div>
      <Button className='import-file-btn btn-info text-light p-2' onClick={() => {
        toggleImportDataForm();
        closeUserPreferencesForm();
        closeUploadFileAlert();
        closeGenerateRoomsEnabled();
      }}>{newLanguage == 'ENG' && 'Import data'}
        {newLanguage == 'BG' && 'Добави данни'}</Button>

    </div>
  }

  const addNewTeam = (event) => {
    event.preventDefault();

    getSpecificEvent(teamEvent, token).then((response) => {
      console.log("response");
      console.log(response.data);
      const foundEvent = response.data;

      const teamDTO = {
        "name": teamName,
        "seats": teamNumber,
        "eventName": teamEvent,
        "facultyName": foundEvent.facultyName,
        "floorNumber": foundEvent.floorNumber,
        "roomNumber": foundEvent.roomNumber,
        "occupiesComputer": teamOccupiesComputer,
        "occupiesCharger": teamOccupiesCharger,
      }

      console.log("TEAM DTO");
      console.log(JSON.stringify(teamDTO));
      reserveTeam(JSON.stringify(teamDTO), token).then((response) => {
        console.log("response")
        console.log(response.data)
        { newLanguage == 'ENG' && toggleUploadFileTeamsAlert(`Successfully saved places!`) }
        { newLanguage == 'BG' && toggleUploadFileTeamsAlert(`Успешно запазване на места!`) }
      }).catch((error) => {
        console.log(error);
        { newLanguage == 'ENG' && toggleUploadFileTeamsAlert(`Failed save of places! Error: ${error.response.data}`) }
        { newLanguage == 'BG' && toggleUploadFileTeamsAlert(`Неуспешно запазване на места! Грешка: "${error.response.data}"`) }
      })
    }).catch((error) => {
      console.log(error);
      { newLanguage == 'ENG' && toggleUploadFileTeamsAlert(`Failed save of places! Error: ${error.response.data}`) }
      { newLanguage == 'BG' && toggleUploadFileTeamsAlert(`Неуспешно запазване на места! Грешка: "${error.response.data}"`) }
      console.log("error");
      console.log(error);
    })


  }


  const updateComputerColor = () => {
    if (computerColor == 'white') {
      setComputerColor('yellow');
    } else {
      setComputerColor('white');
    }
  }

  const updateChargerColor = () => {
    if (chargerColor == 'white') {
      setChargerColor('yellow');
    } else {
      setChargerColor('white');
    }
  }

  const callImportDataForm = () => {
    return (<div className='import-team-div bg-dark p-5'>
      <button className="btn-close-import-team-form btn btn-danger" onClick={(e) => {
        closeImportDataForm(e)
      }}>x</button>
      <h1 className='form-label text-light text-center mb-5 mr-5'>
        {newLanguage == 'ENG' && 'Import data'}
        {newLanguage == 'BG' && 'Добавяне на данни'}
      </h1>

      <div className='import-data-buttons-div'>
        <Button className='btn-import-data-json btn-dark text-light p-2' onClick={() => {
          toggleImportDataFromJson();
          closeImportDataForTeam();
        }}>{newLanguage == 'ENG' && 'System'}
          {newLanguage == 'BG' && 'Система'}</Button>

        <Button className='btn-import-data-team btn-dark text-light p-2 ml-1' onClick={() => {
          closeImportDataFromJson();
          toggleImportDataForTeam();
        }}>{newLanguage == 'ENG' && 'Teams'}
          {newLanguage == 'BG' && 'Отбори'}</Button>
      </div>

      {importDataForTeam == true &&

        <div> <p className='p-2 mb-3 text-secondary'>
          {newLanguage == 'ENG' && 'JSON Teams Example File:'}
          {newLanguage == 'BG' && 'Примерен JSON файл с отбори:'}
        </p>

          <div>
            <p className='json-text bg-light text-dark'><pre>{JSON.stringify(teamsDataJson, null, 2)}</pre></p>
          </div>

          <p className='json-file-header p-2 mb-3 text-secondary'>
            {newLanguage == 'ENG' && 'Import JSON Teams File:'}
            {newLanguage == 'BG' && 'Зареждане на JSON файл с отбори:'}
          </p>

          <div><h5 className='manual-json-file-header p-2 mb-3 text-secondary'>
            {newLanguage == 'ENG' && 'Team Creation Form (Manual)'}
            {newLanguage == 'BG' && 'Форма за създаване на отбор'}
          </h5>
            <form className='create-team-form'>
              <div className='row'>
                <div className='col'>
                  <div class="form-floating text-start mb-2 mt-3">
                    <input type="text" class="form-control text-start" id="floatingInput" value={teamName}
                      onChange={(e) => setTeamName(e.target.value)} />
                    <label for="floatingInput text-light">
                      {newLanguage == 'ENG' && "Team name"}
                      {newLanguage == 'BG' && "Име на отбор"}
                    </label>
                  </div>
                  <div class="form-floating text-start mb-2 mt-3">
                    <input type="number" class="form-control text-start" id="floatingInput" value={teamNumber}
                      onChange={(e) => setTeamNumber(e.target.value)} />
                    <label for="floatingInput text-light">
                      {newLanguage == 'ENG' && "Seats for reservation"}
                      {newLanguage == 'BG' && "Места за резервиране"}
                    </label>
                  </div>
                  <div class="form-floating text-start mb-5 mt-3">
                    <input type="text" class="form-control text-start" id="floatingInput" value={teamEvent}
                      onChange={(e) => setTeamEvent(e.target.value)} />
                    <label for="floatingInput text-light">
                      {newLanguage == 'ENG' && "Event name"}
                      {newLanguage == 'BG' && "Име на събитие"}
                    </label>
                  </div>
                  <div className='check-buttons-create-team row mt-2'>
                    <div className='col'>
                      <h5 className='text-light'>
                        {newLanguage == 'ENG' && "Computer"}
                        {newLanguage == 'BG' && "Лаптоп"}
                      </h5>
                      <Button onClick={() => {
                        { toggleOccupiesComputer() }
                        { updateComputerColor() }
                      }}>
                        <HiDesktopComputer size={30} color={computerColor} />
                      </Button>
                    </div>
                    <div className='= col'>
                      <h5 className='text-light mb-2'>
                        {newLanguage == 'ENG' && "Charger"}
                        {newLanguage == 'BG' && "Зарядно"}
                      </h5>
                      <Button onClick={() => {
                        { toggleOccupiesCharger() }
                        { updateChargerColor() }
                      }}>
                        <LuCable size={30} color={chargerColor} />
                      </Button>
                    </div>
                  </div>
                  <button className='btn-add-team btn text-center btn-primary mt-5 w-100' onClick={(event) => addNewTeam(event)}>
                    {newLanguage == 'ENG' && "Save"}
                    {newLanguage == 'BG' && "Запази"}
                  </button>
                </div>
              </div>
            </form></div>
        </div>}

      {importDataFromJson == true &&

        <div> <p className='p-2 mb-3 text-secondary'>
          {newLanguage == 'ENG' && 'JSON System Example File:'}
          {newLanguage == 'BG' && 'Примерен JSON файл с данни за системата:'}
        </p>

          <div>
            <p className='json-text bg-light text-dark'><pre>{JSON.stringify(dataJson, null, 2)}</pre></p>
          </div>

          <p className='json-file-header-system p-2 mb-3 text-secondary'>
            {newLanguage == 'ENG' && 'Import JSON File:'}
            {newLanguage == 'BG' && 'Зареждане на JSON файл:'}
          </p>
        </div>}

    </div>)
  }

  const showAlertWhenUploadFile = () => {
    return (<div class="upload-file-alert alert alert-primary" role="alert">
      <button className="btn-close-upload-event-alert btn btn-danger" onClick={(e) => closeUploadFileAlert(e)}>x</button>
      <br />
      {uploadDataText}
    </div>)
  }

  const showTeamsAlertWhenUploadFile = () => {
    return (<div class="upload-file-teams-alert alert alert-primary" role="alert">
      <button className="btn-close-upload-event-teams-alert btn btn-danger" onClick={(e) => closeUploadFileTeamsAlert(e)}>x</button>
      <br />
      {uploadDataText}
    </div>)
  }

  return (
    <>
      {SidebarLeftComponent()}
      {SeatsComponent()}
      <OpenUserSettings />
      {callLogOut()}
      {checkIfEventStillContinues()}
      {showRoomImage && openRoomImage()}
      {userPreferenceForm && callUserPreferenceForm()}
      {roomImageInputEnable && openImageForm()}
      {role == 'ADMIN' && importFile()}
      {role == 'ADMIN' && exportFile()}
      {role == 'ADMIN' && importDataForm && importDataFromJson && UploadFile()}
      {role == 'ADMIN' && importDataForm && importDataForTeam && UploadTeamsFile()}
      {role == 'ADMIN' && importDataForm && callImportDataForm()}
      {uploadFileAlert && showAlertWhenUploadFile()}
      {uploadFileTeamsAlert && showTeamsAlertWhenUploadFile()}
    </>
  )
}

export default FloorPageComponent