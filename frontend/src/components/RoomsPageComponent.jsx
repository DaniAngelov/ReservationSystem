import React, { useState, useEffect } from 'react'
import { releaseSpot, reserveSpot, getUsers, searchNewGuest, getUserByUsername } from '../services/UserService'
import { addEvent, getEvents, searchNewEvent, getEventsForOrganizer } from '../services/FloorService';
import { useNavigate, useParams } from 'react-router-dom';
import './RoomsPageComponent.css'
import logo from '../assets/fmi-deskspot-high-resolution-logo-white-transparent.png';
import userIcon from '../assets/user-icon.png';
import axios from 'axios';
import { Button, Carousel } from "react-bootstrap";
import { HiDesktopComputer } from "react-icons/hi"
import { LuCable } from "react-icons/lu";
import { PiOfficeChair, PiOfficeChairFill } from "react-icons/pi";
import { MdEventAvailable } from "react-icons/md";
import { jwtDecode } from 'jwt-decode'
import { IoMdSearch } from "react-icons/io";
import { BsPersonCheckFill } from "react-icons/bs";
import { BsFillDoorOpenFill } from "react-icons/bs";
import { addDays } from '@progress/kendo-date-math';
import { IoFilterCircle } from "react-icons/io5";
import { RiLogoutBoxLine } from "react-icons/ri";
import { IoSettingsSharp } from "react-icons/io5";
import { FaHome } from 'react-icons/fa';
import { VscThreeBars } from "react-icons/vsc";
import { GiOfficeChair } from "react-icons/gi";
import { MdChair } from "react-icons/md";


const RoomsPageComponent = (parentRoom) => {
  const [events, setEvents] = useState([]);
  const [isOpen, setIsopen] = useState(false);

  const { floorId, roomId } = useParams();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [eventType, setEventType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [dateOption, setDateOption] = useState('');

  const [searchField, setSearchField] = useState('');
  const [guestSearchField, setGuestSearchField] = useState('');
  const [organizerSearchField, setOrganizerSearchField] = useState('');

  const token = localStorage.getItem('token');

  const decodedToken = jwtDecode(token);

  const user = decodedToken.sub;

  const role = decodedToken.role;

  const [qrCodeQuestions, setQrCodeQuestions] = useState('');

  const [qrQuestionsInputEnable, setQrQuestionsInputEnable] = useState(true);

  const [newUserEvents, setNewUserEvents] = useState([]);

  // Seats
  const [event, setEvent] = useState([]);

  const [guests, setGuests] = useState([]);

  const [guestDTO, setGuestDTO] = useState([]);

  const [chosenSeat, setChosenSeat] = useState('');

  const [chosenEvent, setChosenEvent] = useState('');

  const [updateSeatsToggle, setUpdateSeatsToggle] = useState(false)

  const [releaseSeat, setReleaseSeat] = useState(false);

  const [seatTakenEventForm, setSeatTakenEventForm] = useState(false);

  const [guestListEnabled, setGuestListEnabled] = useState(false);

  const [userPreferenceForm, setUserPreferenceForm] = useState(false);

  const [filteredEvents, setFilteredEvents] = useState([]);

  const [activeIndex, setActiveIndex] = useState(0);

  const [chosenTakenSeat, setChosenTakenSeat] = useState('');

  const [users, setUsers] = useState([]);

  const [disableEventAlert, setDisableEventAlert] = useState(false);

  const [resourceLinkAlert, setResourceLinkAlert] = useState(false);

  const [newLanguage, setNewLanguage] = useState('');

  const [openSeatLegend, setOpenSeatLegend] = useState(true);

  const navigator = useNavigate();

  const toggleQrQuestionsInputEnable = () => {
    return setQrQuestionsInputEnable(!qrQuestionsInputEnable);
  }

  const toggleUserPreferencesForm = () => {
    return setUserPreferenceForm(!userPreferenceForm);
  }

  const closeUserPreferencesForm = () => {
    return setUserPreferenceForm(false);
  }

  const ToggleSeatTakenEventForm = () => {
    return setSeatTakenEventForm(true);
  }

  const closeSeatTakenEventForm = () => {
    return setSeatTakenEventForm(false);
  }

  const ToggleSeatLegend = () => {
    return setOpenSeatLegend(true);
  }

  const closeSeatLegend = () => {
    return setOpenSeatLegend(false);
  }

  const ToggleReleaseSeats = () => {
    return setReleaseSeat(!releaseSeat);
  }

  const closeReleaseSeats = () => {
    return setReleaseSeat(false);
  }

  const toggleUpdateSeats = () => {
    setUpdateSeatsToggle(true);
  }

  const closeUpdateSeats = () => {
    setUpdateSeatsToggle(false);
  }

  const toggleGuestList = (e) => {
    e.preventDefault();
    return setGuestListEnabled(!guestListEnabled);
  }


  const ToggleSidebar = () => {
    return setIsopen(true);
  }

  const closeSidebar = () => {
    return setIsopen(false);
  }

  useEffect(() => {
    getUserByUsername(user, token).then((response) => {
      setNewLanguage(response.data.languagePreferred);
    }).catch((error) => {
      console.log("error");
      console.log(error);
    })
  }, []);

  useEffect(() => {
    getUsers(token)
      .then((response) => {
        const newUsers = [];
        response.data.map(newUser => {
          if (newUser.role == 'LECTOR' && user != newUser.username) {
            newUsers.push(newUser);
          }
        });
        setUsers(newUsers);
      }).catch(error => {
        console.error(error.response.message);
      })
  }, []);

  useEffect(() => {
    getEvents(token)
      .then((response) => {
        const newEvents = [];
        const newFilteredEvents = [];
        response.data.map(event => {
          newEvents.push(event);
        });
        setEvents(newEvents);
        response.data.filter(event => {
          if (event.floorNumber == floorId && event.roomNumber == roomId)
            newFilteredEvents.push(event);
        }
        )
        setFilteredEvents(newFilteredEvents);
      }).catch(error => {
        console.error(error);
      })
  }, []);

  const [showForm, setShowForm] = useState(false);
  const [filterForm, setFilterForm] = useState(false);

  const toggleShowForm = () => {
    setShowForm(!showForm);
  }

  const closeShowForm = () => {
    setShowForm(false);
  }

  const updateFilterForm = () => {
    setFilterForm(!filterForm);
  }

  const closeFilterForm = () => {
    setFilterForm(false);
  }

  const toggleResourceLinkAlert = (event) => {
    setChosenEvent(event);
    return setResourceLinkAlert(!resourceLinkAlert);
  }

  const closeResourceLinkAlert = () => {
    return setResourceLinkAlert(false);
  }

  const toggleDisableEventAlert = (event) => {
    setChosenEvent(event);
    return setDisableEventAlert(!disableEventAlert);
  }

  const closeDisableEventAlert = () => {
    return setDisableEventAlert(false);
  }

  const OpenDatePicker = () => {
    return (<div className='form-group text-start mb-2'>
      <label className='form-label text-light'>
        {newLanguage == 'ENG' && "Event Start Time"}
        {newLanguage == 'BG' && "Начало на събитието"}
      </label>
      <input type='datetime-local' placeholder='Enter Event Start Time' name='startDate' value={startDate} className='form-control mb-1'
        onChange={(e) => setStartDate(e.target.value)}>
      </input>
      <label className='form-label text-light mt-1'>{newLanguage == 'ENG' && "Event End Time"}
        {newLanguage == 'BG' && "Край на събитието"}</label>
      <input type='datetime-local' placeholder='Enter Event End Time' name='endDate' value={endDate} className='form-control'
        onChange={(e) => setEndDate(e.target.value)}>
      </input>
    </div>)
  }

  //**blob to dataURL**
  const blobToDataURL = (blob, callback) => {
    var a = new FileReader();
    a.onload = function (e) { callback(e.target.result); }
    a.readAsDataURL(blob);
  }

  const addNewEvent = (e, name, description, eventType, startDate, endDate) => {
    e.preventDefault();
    const floorNumber = floorId;
    const roomNumber = roomId;
    const faculty = localStorage.getItem('faculty');

    const eventDTO = {
      "name": name,
      "description": description,
      "eventType": eventType,
      "facultyName": faculty,
      "floorNumber": floorNumber,
      "roomNumber": roomNumber,
      "user": user,
      "duration": {
        "startDate": startDate,
        "endDate": endDate
      },
      "qrCodeQuestions": qrCodeQuestions,
      "guests": guestDTO
    }
    console.log(JSON.stringify(eventDTO));
    addEvent(JSON.stringify(eventDTO), token).then((response) => {
      const newFilteredEvents = filteredEvents;
      newFilteredEvents.push(response.data);
      setFilteredEvents(newFilteredEvents);
      { newLanguage == 'ENG' && alert("Event added successfully!") }
      { newLanguage == 'BG' && alert("Събитието успешно добавено!") }
      closeShowForm();
    }).catch((error) => {
      alert(error.response.data);
      console.log(error);
    })
  }

  const callTurningToData = (qrCodeQuestions) => {
    axios({
      method: 'get',
      url: qrCodeQuestions,
      responseType: 'blob'
    }).then(function (response) {
      var reader = new FileReader();
      reader.readAsDataURL(response.data);
      reader.onloadend = () => {
        var base64data = reader.result;
        self.props.onMainImageDrop(base64data)
      }
      blobToDataURL(response.data, function (dataurl) {
        return setQrCodeQuestions(dataurl);
      })
    })
  }

  const updateGuestList = () => {
    return (<div class='guests-list text-start p-4 mb-3 mt-4 ml-3'>

      {guests.map((guest, idx) =>
        <button class='btn btn-primary m-2 w-100' onClick={(e) => e.preventDefault()}><div className='text-light' key={idx}>{<BsPersonCheckFill size={30} className='mr-1' />} {guest}</div></button>
      )
      }

    </div>)
  }

  const addGuest = (guest) => {
    if (!guests.includes(guest) && guest != user) {
      guests.push(guest);
      guestDTO.push({ username: guest });
    }
  }


  const callEventForm = () => {

    return (
      <>
        <div className='card-body-5 text-center bg-success p-5'>
          <button className="btn-close-add-event-form btn btn-danger" onClick={(e) => closeShowForm(e)}>x</button>
          <h1 className=' text-center text-light font-weight-bold'>
            <MdEventAvailable size={60} className='mr-3 mb-1' />
            {newLanguage == 'ENG' && "Add event"}
            {newLanguage == 'BG' && "Добави събитие"}
          </h1>
          <form className='add-event-form'>
            <div className='row'>
              <div className='col'>
                <div class="form-floating text-start mb-3 mt-4">
                  <input type="text" class="form-control text-start" id="floatingInput" placeholder="Enter Event Name" value={name}
                    onChange={(e) => setName(e.target.value)} />
                  <label for="floatingInput text-light">
                    {newLanguage == 'ENG' && "Enter Name"}
                    {newLanguage == 'BG' && "Въведи име"}
                  </label>
                </div>

                <div class="form-floating text-start mb-3 mt-4">
                  <textarea class="form-control text-start" id="floatingInput2" placeholder="Enter Event Description" value={description} rows="3" onChange={(e) => setDescription(e.target.value)} />
                  <label for="floatingInput2 text-light">
                    {newLanguage == 'ENG' && "Enter Description"}
                    {newLanguage == 'BG' && "Въведи описание"}</label>
                </div>
              </div>
              <div className='col'>

                <div class="form-floating text-start mb-3 mt-4 ml-3">
                  <select type="text" class="form-control text-start" id="floatingInput4" placeholder="Enter Event Type" value={eventType}
                    onChange={(e) => setEventType(e.target.value)}>
                    <option>LECTURE</option>
                    <option>EXAM</option>
                    <option>SEMINAR</option>
                  </select>
                  <label for="floatingInput4 text-light">
                    {newLanguage == 'ENG' && "Enter Event Type"}
                    {newLanguage == 'BG' && "Тип на събитие!"}
                  </label>
                </div>

                {eventType == '' && setEventType('LECTURE')}
                <div class="form-floating text-start mb-3 mt-4 ml-3">
                  <input type="datetime-local" class="form-control text-start" id="floatingInput5" placeholder="Enter Event Start Time" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                  <label for="floatingInput5 text-light">
                    {newLanguage == 'ENG' && "Event Start Time"}
                    {newLanguage == 'BG' && "Начало на събитие"}
                  </label>
                </div>
                <div class="form-floating text-start mb-3 mt-4 ml-3">
                  <input type="datetime-local" class="form-control text-start" id="floatingInput6" placeholder="Enter Event End time" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                  <label for="floatingInput6 text-light">
                    {newLanguage == 'ENG' && "Event End Time"}
                    {newLanguage == 'BG' && "Край на събитие"}
                  </label>
                </div>
              </div>
              <div className='col'>
                <form class="custom-form-search-bar-guests form-floating form-inline">
                  <input class="form-control mr-sm-2 text-start" type="search" placeholder="Search for user" id="floatingInput9" aria-label="Search" value={guestSearchField}
                    data-bs-toggle="dropdown" aria-expanded="false" onChange={(e) => {
                      setGuestSearchField(e.target.value)
                      findGuest(e, e.target.value);
                    }
                    } />
                  <label for="floatingInput9 text-light ml-5 text-start">
                    {newLanguage == 'ENG' && "Search guest"}
                    {newLanguage == 'BG' && "Търси гост"}
                  </label>
                  <ul class="dropdown-menu w-100">
                    {users.map((user, idx) => {
                      return <li key={idx}><a className="dropdown-item p-2" onClick={(e) => {
                        {
                          addGuest(user.username);
                          toggleGuestList(e);
                        }
                      }} >
                        {user.username}
                      </a></li>
                    })}

                  </ul>
                  {updateGuestList()}
                </form>
              </div>
              <div className='col'>

                <div class="form-floating text-start mb-3 mt-4 w-100">
                  {qrQuestionsInputEnable && <input class="form-control text-start" id="floatingInput7" placeholder="Enter Event Name" onPasteCapture={(e) => {
                    toggleQrQuestionsInputEnable();
                    setQrCodeQuestions(URL.createObjectURL(e.clipboardData.files[0]));
                  }} />}
                  {qrQuestionsInputEnable && <label for="floatingInput7 mt-3">
                    {newLanguage == 'ENG' && "Questions Code"}
                    {newLanguage == 'BG' && "Код за въпроси"}
                  </label>}
                </div>
                {qrCodeQuestions != '' &&
                  <h5 className='text-light ml-4 mt-4'>
                    {newLanguage == 'ENG' && "Event Questions Code"}
                    {newLanguage == 'BG' && "Код за въпроси"}
                  </h5>}
                {qrCodeQuestions != '' && callTurningToData(qrCodeQuestions)}
                {qrCodeQuestions != '' &&
                  <img src={qrCodeQuestions} className='qr-code-questions-img' />}
              </div>
            </div>
            <button className='btn-add-event btn text-center btn-primary mt-4 w-50' onClick={(event) => addNewEvent(event, name, description, eventType, startDate, endDate)}>
              {newLanguage == 'ENG' && "Add event!"}
              {newLanguage == 'BG' && "Добави събитие!"}
            </button>
          </form>
        </div>
      </>)
  };

  const filterNewEvents = (e, eventType, dateOption, startDate, endDate) => {
    e.preventDefault();

    console.log('filtered events Before floor filter and after event type filter:');
    console.log(events);
    let newFilteredEvents = events.filter((event) => event.roomNumber == roomId && event.floorNumber == floorId);
    console.log(events);
    const newStartDate = Date.parse(startDate);
    const newEndDate = Date.parse(endDate);
    const nowTime = new Date(Date.now());
    console.log('filtered events After floor filter:');
    console.log(newFilteredEvents);
    newFilteredEvents = newFilteredEvents.filter((event) => event.eventType == eventType);
    console.log('filtered events After Type filter:');
    console.log(newFilteredEvents);

    if (dateOption == 'Specify date') {
      newFilteredEvents = newFilteredEvents.filter((event) =>
        Date.parse(event.duration.startDate) > newStartDate && Date.parse(event.duration.endDate) < newEndDate
      )
    } else if (dateOption == 'Today') {
      newFilteredEvents = newFilteredEvents.filter((event) => (new Date(Date.parse(event.duration.startDate)).getUTCDate() == nowTime.getUTCDate()) && (new Date(Date.parse(event.duration.endDate)).getUTCDate() == nowTime.getUTCDate()))
    } else if (dateOption == 'Tomorrow') {
      newFilteredEvents = newFilteredEvents.filter((event) => (new Date(Date.parse(event.duration.startDate)).getUTCDate() == nowTime.getUTCDate() + 1) && (new Date(Date.parse(event.duration.endDate)).getUTCDate() == nowTime.getUTCDate() + 1))
    } else if (dateOption == 'This week') {
      let newNowTime = addDays(nowTime, 1 - (nowTime.getUTCDay()));
      newFilteredEvents = newFilteredEvents.filter((event) => (new Date(Date.parse(event.duration.startDate)).getUTCDate() >= newNowTime.getUTCDate()) && (new Date(Date.parse(event.duration.endDate)).getUTCDate() <= newNowTime.getUTCDate() + 7))
    } else if (dateOption == 'This month') {
      newFilteredEvents = newFilteredEvents.filter((event) => (new Date(Date.parse(event.duration.startDate)).getUTCMonth() == nowTime.getUTCMonth()) && (new Date(Date.parse(event.duration.endDate)).getUTCMonth() == nowTime.getUTCMonth()))
    } else if (dateOption == 'All events for this room') {
      newFilteredEvents = events.filter((event) => event.roomNumber == roomId && event.floorNumber == floorId);
    }
    console.log('filtered events after:');
    console.log(newFilteredEvents);
    setFilteredEvents(newFilteredEvents);
  }

  const callFilterForm = () => {

    return (
      <>
        <div className='card-body-filter text-center bg-secondary p-5 mt-5'>
          <button className="btn-close-filter-event-form btn btn-danger" onClick={(e) => closeFilterForm(e)}>x</button>
          <h3 className='text-center mb-2 text-light font-weight-bold mr-4'><IoFilterCircle className='mr-2 mb-2' size={70} />
            {newLanguage == 'ENG' && "Filter events"}
            {newLanguage == 'BG' && "Филтриране на събития"}
          </h3>
          <form>
            <div className='form-group text-start mb-2'>
              <label className='form-label text-light'>
                {newLanguage == 'ENG' && "Event Type"}
                {newLanguage == 'BG' && "Тип на събитие"}
              </label>
              <select type='text' placeholder='Enter Event Type' name='eventType' value={eventType} className='form-control'
                onChange={(e) => { setEventType(e.target.value) }}>
                <option>LECTURE</option>
                <option>EXAM</option>
                <option>SEMINAR</option>
              </select>
            </div>

            {eventType == '' && setEventType('LECTURE')}

            <div className='form-group text-start mb-2'>
              <label className='form-label text-light'>
                {newLanguage == 'ENG' && "Date"}
                {newLanguage == 'BG' && "Дата"}
              </label>
              <select type='text' placeholder='Enter Date' name='eventType' value={dateOption} className='form-control'
                onChange={(e) => {
                  setDateOption(e.target.value)
                }}>
                <option>Today</option>
                <option>Tomorrow</option>
                <option>This week</option>
                <option>This month</option>
                <option>All events for this room</option>
                <option>Specify date</option>
              </select>
            </div>
            {dateOption == '' && setDateOption('Today')}
            {dateOption == 'Specify date' && <OpenDatePicker />}
            <button className='btn btn-filter-events btn-success mt-2 p-3' onClick={(e) => filterNewEvents(e, eventType, dateOption, startDate, endDate)}>
              {newLanguage == 'ENG' && "Filter events!"}
              {newLanguage == 'BG' && "Филтрирай събития!"}
            </button>
          </form>
        </div>
      </>)
  };

  const getValueForReserveSpotLanguage = () => {
    if (newLanguage == 'ENG') {
      return "Reserve your spot now!";
    } else {
      return "Запази своето място!"
    }
  }

  const SidebarRightComponent = () => {

    const [backgroundColor, setBackgroundColor] = useState('#212529');
    const [text, setText] = useState(getValueForReserveSpotLanguage());

    const [occupiesComputer, setOccupiesComputer] = useState(false);
    const [occupiesCharger, setOccupiesCharger] = useState(false);

    const [computerColor, setComputerColor] = useState('white');
    const [chargerColor, setChargerColor] = useState('white');

    const toggleOccupiesComputer = () => {
      return setOccupiesComputer(!occupiesComputer);
    }

    const toggleOccupiesCharger = () => {
      return setOccupiesCharger(!occupiesCharger);
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

    const takeSpot = (e) => {

      e.preventDefault();

      const userReserveSpotDTO = {
        "username": user,
        "seat": chosenSeat,
        "floorNumber": floorId,
        "facultyName": localStorage.getItem('faculty'),
        "eventName": chosenEvent.name,
        "roomNumber": roomId,
        "occupiesComputer": occupiesComputer,
        "occupiesCharger": occupiesCharger,
      }
      console.log(JSON.stringify(userReserveSpotDTO));

      console.log("token:" + token)

      reserveSpot(JSON.stringify(userReserveSpotDTO), token).then((response) => {
        console.log(response.data);
        console.log("status: " + response.status)
        setBackgroundColor('white');


        { newLanguage == 'ENG' && setText('Spot reserved!') }
        { newLanguage == 'BG' && setText('Място запазено!') }
        chosenSeat.seatTaken = true;
        console.log("background color:" + backgroundColor)
      }).catch((error) => {
        console.log(error);
        alert(error.response.data);
      });

    }

    const openComputerRoomSpecs = (roomType) => {
      if (roomType == 'COMPUTER') {
        return <div className='row'>
          <div className='computer-link-item col'>
            <h2 className='text-light mt-4'>
              {newLanguage == 'ENG' && "Computer"}
              {newLanguage == 'BG' && "Лаптоп"}
            </h2>
            <Button onClick={() => {
              { toggleOccupiesComputer() }
              { updateComputerColor() }
            }}>
              <HiDesktopComputer size={45} color={computerColor} />
            </Button>
          </div>
          <div className='charger-link-item col'>
            <h2 className='text-light mb-2 mt-4'>
              {newLanguage == 'ENG' && "Charger"}
              {newLanguage == 'BG' && "Зарядно"}
            </h2>
            <Button onClick={() => {
              { toggleOccupiesCharger() }
              { updateChargerColor() }
            }}>
              <LuCable size={45} color={chargerColor} />
            </Button>
          </div>
        </div>
      } else {
        return '';
      }
    }

    return (
      <>
        <div>
          <div className={`sidebar-right ${isOpen == true ? 'active' : ''}`}>
            <div className="sd-body text-center row">
              <button className='reserve-spot-event-sidebar-logo btn btn-dark' onClick={() => {
                closeSidebar();
                ToggleSeatLegend();
              }}>
                <VscThreeBars size={20} className=' text-light' />
              </button>
              <div>
                <Button className='w-75 mt-2 mb-2'>
                  <MdEventAvailable size={30} />
                  <h5 className='mt-3 text-light button-events-event-name'>
                    {newLanguage == 'ENG' && "Event"}
                    {newLanguage == 'BG' && "Събитие"}
                    {`: ${chosenEvent.name}`}</h5>
                </Button>
              </div>
              <div className='col'>
                <Button className='mt-2 btn-chosen-event-room'>
                  <BsFillDoorOpenFill size={30} />
                  <h5 className='mt-3 text-light'>
                    {` ${chosenEvent.roomNumber}`}</h5>
                </Button>
              </div>
              <div className='col'>
                <Button className='mt-2 btn-chosen-event-seat'>
                  <PiOfficeChairFill size={30} />
                  <h5 className='mt-3 text-light'>
                    {`${chosenSeat.seatNumber}`}</h5>
                </Button>
              </div>
              {openComputerRoomSpecs(localStorage.getItem("roomType"))}
              {chosenEvent.qrCodeQuestions != '' && chosenEvent.qrCodeQuestions != null &&
                <h5 className='text-light header-qr-code-client-image'>
                  {newLanguage == 'ENG' && "Have any questions or want to vote before event? Scan the QR code below!"}
                  {newLanguage == 'BG' && "Имате въпроси или искате да гласувате? Сканирайте QR кода по-долу!"}
                </h5>}
              {chosenEvent.qrCodeQuestions != '' && chosenEvent.qrCodeQuestions != null &&
                <img src={chosenEvent.qrCodeQuestions} className='qr-code-client-image' />}

              <li><button className="btn btn-custom-reserve-spot btn-outline-light my-2 my-sm-0 sd-link" style={{ backgroundColor: backgroundColor, content: text }} onClick={takeSpot} >{text}</button></li>

            </div>
          </div>

          <div className={`sidebar-right-overlay ${isOpen == true ? 'active' : ''}`} onClick={ToggleSidebar}></div>
        </div>
      </>
    )
  }

  const SidebarLeftComponent = () => {

    const showEventIfEnabled = (event) => {
      setEvent(event);
      closeSidebar();
      closeShowForm();
      closeFilterForm()
      closeReleaseSeats();
      closeUserPreferencesForm();
      closeDisableEventAlert();
      closeResourceLinkAlert();
      closeSeatTakenEventForm();
      ToggleSeatLegend();
      toggleUpdateSeats();
    }

    const showEvent = (event, idx) => {

      let newStartDate = event.duration.startDate.replace('T', ' ');
      let newEndDate = event.duration.endDate.replace('T', ' ');

      return <Carousel.Item key={idx} className='carousel-item'>
        <button className={`custom-event-button-2 text-light ${event.enabled == true ? 'bg-success' : 'bg-secondary'} p-3 mt-5`} key={idx} onClick={() => {
          setActiveIndex(idx)
          event.enabled == true && showEventIfEnabled(event)
        }}>
          <MdEventAvailable size={30} />
          <h5> {newLanguage == 'ENG' && "Event"}
            {newLanguage == 'BG' && "Събитие"}: {event.name}</h5>
          <small> {newLanguage == 'ENG' && "Event Type"}
            {newLanguage == 'BG' && "Тип на събитие"}: {event.eventType}</small>
          <br />
          <small class="mb-1 mt-2"> {newLanguage == 'ENG' && "Description"}
            {newLanguage == 'BG' && "Описание"}: {event.description}</small>
          <br />
          <small> {newLanguage == 'ENG' && "Start"}
            {newLanguage == 'BG' && "Начало"}: {newStartDate}</small>
          <br />
          <small>
            {newLanguage == 'ENG' && "Еnd"}
            {newLanguage == 'BG' && "Край"}
            : {newEndDate}</small>
          <br />
          <small>{newLanguage == 'ENG' && "Floor"}
            {newLanguage == 'BG' && "Етаж"}: {event.floorNumber}</small>
          <br />
          <small>{newLanguage == 'ENG' && "Room"}
            {newLanguage == 'BG' && "Стая"}: {event.roomNumber}</small>
          <br />
          {console.log("LINK TO PAGES")}
          {console.log()}
          {(event.linkToPage == null || event.linkToPage.length == 0) ? <small>
            {newLanguage == 'ENG' && "Organizer"}
            {newLanguage == 'BG' && "Организатор"}
            : {event.organizer}</small> :
            <small>
              {newLanguage == 'ENG' && "Organizer"}
              {newLanguage == 'BG' && "Организатор"}
              : <a href='#' onClick={(e) => {
                e.stopPropagation()
                toggleResourceLinkAlert(event);
                closeUserPreferencesForm();
                closeDisableEventAlert();
              }
              } > {event.organizer}</a></small>}
          <br />
          {!event.enabled && (event.disableEventReason != '' &&
            <small>
              {newLanguage == 'ENG' && "Cancelled due to: "}
              {newLanguage == 'BG' && "Прекратено поради: "}
              <a href="#" onClick={(e) => {
                toggleDisableEventAlert(event);
                closeResourceLinkAlert();
                closeUserPreferencesForm();
                e.stopPropagation();
              }}>{event.disableEventReason}</a></small>)}

        </button></Carousel.Item>;

    }

    return (
      <>
        <div className="container-fluid">
          <div className="sidebar-left">
            <div className="sd-header">
              <img src={logo} width={100} height={100} alt='Responsive image' className='img-fluid logoImage-2' />
            </div>

            <div className="sd-body">

              <div>
                {role != 'USER' && <button className="btn btn-events-add btn-primary 
                                  text-light p-2 w-75 text-center mt-1" onClick={() => {
                    closeFilterForm();
                    closeSidebar();
                    closeSeatLegend();
                    closeUpdateSeats();
                    closeReleaseSeats();
                    closeUserPreferencesForm();
                    closeSeatTakenEventForm();
                    closeDisableEventAlert();
                    closeResourceLinkAlert();
                    toggleShowForm()
                  }}>
                  {newLanguage == 'ENG' && "Add event"}
                  {newLanguage == 'BG' && "Добави събитие"}
                </button>}
                <button className="btn btn-events-filter btn-danger 
                                   text-light p-2 w-75 text-center mt-2" onClick={() => {
                    closeShowForm()
                    closeSidebar();
                    closeUpdateSeats();
                    closeDisableEventAlert();
                    closeResourceLinkAlert();
                    closeReleaseSeats();
                    closeUserPreferencesForm();
                    closeSeatTakenEventForm();
                    updateFilterForm()
                  }}>
                  {newLanguage == 'ENG' && "Filter events"}
                  {newLanguage == 'BG' && "Филтрирай събития"}
                </button>
                <Carousel size={150} width={150} height={200} className='carousel-body p-5 mt-5' defaultActiveIndex={activeIndex}>
                  {filteredEvents.map((event, idx) => {
                    console.log("EVENT BE:")
                    console.log(event)
                    if (event.floorNumber == floorId && event.roomNumber == roomId) {
                      return showEvent(event, idx);
                    }
                  })}
                </Carousel>
              </div>
            </div>
          </div>
        </div>

      </>
    )
  }

  const SeatComponent = () => {

    let counter = -1;
    let rowCounter = 0;

    const updateSeatStatus = (eventName, seat) => {
      setChosenSeat(seat);
      setChosenEvent(eventName);
      console.log("THIS SEAT:") + seat;
      if (!seat.seatTaken) {
        if (seat.seatType == role || seat.seatType == 'NORMAL' || role == 'ADMIN') {
          ToggleSidebar();
          closeReleaseSeats();
          closeSeatLegend();
          closeSeatTakenEventForm();
        } else {
          closeSidebar();
          { newLanguage == 'ENG' && alert('This seat is for role ' + seat.seatType + '! Your role is: ' + role + '.Please pick another one!') }
          { newLanguage == 'BG' && alert('Това място е за роля ' + seat.seatType + '! Твоята роля е: ' + role + '.Моля изберете друго място!') }
        }
      } else {
        if (seat.userThatOccupiedSeat == user) {
          closeSeatTakenEventForm();
          closeUserPreferencesForm();
          closeDisableEventAlert();
          closeResourceLinkAlert();
          ToggleReleaseSeats();
          closeSidebar();
          ToggleSeatLegend();
        } else {
          setChosenTakenSeat(seat);
          closeReleaseSeats();
          closeDisableEventAlert();
          closeResourceLinkAlert();
          closeUserPreferencesForm();
          ToggleSeatTakenEventForm();
          closeSidebar();
          ToggleSeatLegend();
        }
      }
    }

    const incrementCounter = () => {
      counter = counter + 1;
      if (counter % 6 == 0) {
        rowCounter = rowCounter + 1;
        return <Button className='btn-success btn-row-counter mr-2 mb-5'>{rowCounter}</Button>;
      }
    }

    const returnSeatColor = (seatType) => {
      if (seatType == 'NORMAL') {
        return 'btn-primary';
      } else if (seatType == 'QA') {
        return 'btn-danger';
      } else if (seatType == 'DEVELOPER') {
        return 'btn-info';
      } else if (seatType == 'DEVOPS') {
        return 'btn-dark';
      }
    }

    return (
      <>

        {openSeatLegend && <div className='seats-legend'>
          <ul className='example-seats bg-dark text-light p-2'>
            {newLanguage == 'ENG' && 'Types of seats:'}
            {newLanguage == 'BG' && 'Типове места:'}
            <li
              className={`btn-success m-3 p-3 text-light text-center`} >
              <MdChair size={20} className='mr-2' />
              {newLanguage == 'ENG' && 'Lector/Guest'}
              {newLanguage == 'BG' && 'Лектор/Гост'}
            </li>
            <li
              className={`btn-primary m-3 p-3 text-light text-center`} >
              <PiOfficeChairFill size={20} className='mr-2' />
              {newLanguage == 'ENG' && 'Normal'}
              {newLanguage == 'BG' && 'Нормално'}
            </li>
            <li
              className={`btn-danger m-3 p-3 text-light text-center`} >
              <GiOfficeChair size={20} className='mr-2' />
              {newLanguage == 'ENG' && 'QA'}
              {newLanguage == 'BG' && 'Тестър'}
            </li>
            <li
              className={`btn-info m-3 p-3 text-light text-center`} >
              <GiOfficeChair size={20} className='mr-2' />
              {newLanguage == 'ENG' && 'Developer'}
              {newLanguage == 'BG' && 'Разработчик'}
            </li>
            <li
              className={`btn-dark m-3 p-3 text-light text-center`} >
              <GiOfficeChair size={20} className='mr-2' />
              {newLanguage == 'ENG' && 'Devops'}
              {newLanguage == 'BG' && 'Девопс'}
            </li>
          </ul>
        </div>}
        <div className='lectors-div-guests row justify-content-md-center'>
          {event.seats.map((seat, idx) =>
            (seat.seatType == 'LECTOR' || seat.seatType == 'GUEST') && <div className='col-md-auto'>
              {(seat.seatType == 'LECTOR' || seat.seatType == 'GUEST') && <button
                className={`btn-2  ${seat.seatTaken == true ? 'btn-secondary' : 'btn-success'} 
                  p-3 m-2 btn-lg`}
                key={idx} onClick={() => {
                  {
                    updateSeatStatus(event, seat);
                  }
                }}>
                <MdChair size={30} /><br />{seat.seatNumber}
              </button>}
            </div>
          )}
        </div>
        <div className='seats-div-custom row justify-content-md-center'>
          {event.seats.map((seat, idx) =>
            (seat.seatType == 'NORMAL' || seat.seatType == 'QA' || seat.seatType == 'DEVELOPER' || seat.seatType == 'DEVOPS') && <div className='col-md-auto'>
              {event.seats.length - 2 != counter && incrementCounter()}
              {(seat.seatType == 'NORMAL' || seat.seatType == 'QA' || seat.seatType == 'DEVELOPER' || seat.seatType == 'DEVOPS') && <button
                className={`btn-2 text-light  ${seat.seatTaken == true ? 'btn-secondary' : returnSeatColor(seat.seatType)} 
                  p-3 m-2`}
                key={idx} onClick={() => {
                  {
                    updateSeatStatus(event, seat);
                  }
                }}>
                {seat.seatType == 'NORMAL' && <PiOfficeChairFill size={30} />}
                {(seat.seatType == 'QA' || seat.seatType == 'DEVELOPER' || seat.seatType == 'DEVOPS') && <GiOfficeChair size={30} />} <br />{seat.seatNumber}
              </button>}

            </div>
          )
          }
        </div >
      </>
    )
  }

  const releaseUserSpot = (e, seat, eventName) => {
    e.preventDefault();

    const userReleaseSpotDTO = {
      "username": user,
      "seat": seat,
      "floorNumber": floorId,
      "eventName": eventName,
      "roomNumber": roomId
    }
    seat.seatTaken = false;

    releaseSpot(JSON.stringify(userReleaseSpotDTO), token).then((response) => {
      ToggleReleaseSeats();
      { newLanguage == 'ENG' && alert('Spot successfully released!') }
      { newLanguage == 'BG' && alert('Мястото е успешно освободено!') }
    }).catch((error) => {
      console.log(error);
      alert(error.response.data);
    });

  }


  const releaseSeats = () => {
    return (
      <button className='btn-release btn btn-outline-primary my-2 my-sm-0' type='submit' onClick={(e) => { releaseUserSpot(e, chosenSeat, chosenEvent.name) }}>
        {newLanguage == 'ENG' && "Release your spot ?"}
        {newLanguage == 'BG' && "Освободи място ?"}
      </button>)
  }

  const navigateToUserSettings = () => {
    navigator('/settings');
  }

  const navigateToHomePage = () => {
    navigator('/welcome');
  }

  const OpenUserSettings = () => {
    return (<><div className='container'>
      <button className='btn btn-user-settings-rooms btn-success text-start font-weight-bold' onClick={() => {
        closeReleaseSeats();
        closeSeatTakenEventForm();
        closeResourceLinkAlert();
        closeDisableEventAlert();
        toggleUserPreferencesForm();
      }
      }>
        <img src={userIcon} width={60} height={60} alt='Responsive image' className='img-fluid mr-5' />
        <h4 className='header-user-icon'>{user}</h4>
      </button>
    </div></>)
  }

  const findGuest = (e, searchField) => {
    e.preventDefault();
    const userSearchGuestDTO = {
      "username": searchField
    }
    console.log(JSON.stringify(userSearchGuestDTO))

    searchNewGuest(JSON.stringify(userSearchGuestDTO), token).then((response) => {
      console.log("response");
      console.log(response.data);
      setUsers(response.data);
    }).catch((error) => {
      console.log("error");
      console.log(error);
    })
  }


  const findEvent = (e, searchField) => {
    e.preventDefault();
    const facultyName = localStorage.getItem('faculty');
    const userSearchEventDTO = {
      "searchField": searchField,
      "floorNumber": floorId,
      "facultyName": facultyName,
      "roomNumber": roomId
    }

    searchNewEvent(JSON.stringify(userSearchEventDTO), token).then((response) => {
      console.log("response");
      console.log(response.data);
      setFilteredEvents(response.data);
    }).catch((error) => {
      console.log("error");
      console.log(error);
    })
  }

  const callSearchBar = () => {
    return (
      <>
        <nav class="custom-navbar navbar justify-content-between">
          <form class="custom-form-search-bar form-inline">
            <IoMdSearch size={35} className='text-secondary search-bar-icon' />
            <input class="form-control mr-sm-2" type="search" placeholder={newLanguage == 'ENG' ? "Search for event" : "Търси събитие"} aria-label="Search" value={searchField}
              onChange={(e) => setSearchField(e.target.value)} />
            <button class="btn btn-outline-success my-2 my-sm-0" onClick={(e) => findEvent(e, searchField)}>
              {newLanguage == 'ENG' && "Search"}
              {newLanguage == 'BG' && "Търси"}</button>
          </form>
        </nav>
      </>
    )
  }

  const findEventsForOrganizer = (e, username) => {
    e.preventDefault();
    getEventsForOrganizer(username, token)
      .then((response) => {
        const newEvents = [];
        response.data.map(event => {
          newEvents.push(event);
        });
        setNewUserEvents(newEvents);
        setFilteredEvents(newEvents);
      }).catch(error => {
        console.error(error);
      })
  }

  const callSearchBarForOrganizer = () => {
    return (
      <>
        <form class="custom-form-search-bar-organizer form-inline">
          <IoMdSearch size={35} className='search-icon-organizer text-secondary search-bar-icon' />
          <input class="input-organizer-events form-control mr-sm-2" type="search" placeholder={newLanguage == 'ENG' ? "Events for lector" : "     Събития за лектор"} aria-label="Search" value={organizerSearchField}
            onChange={(e) => setOrganizerSearchField(e.target.value)} />
          <button class="btn-organizer-events btn btn-outline-success my-2 my-sm-0" onClick={(e) => findEventsForOrganizer(e, organizerSearchField)}>
            {newLanguage == 'ENG' && "Search"}
            {newLanguage == 'BG' && "Търси"}
          </button>
        </form>
      </>
    )
  }

  const callSeatTakenEventForChosenUser = () => {
    return (<div className='chosen-seat-taken-for-user-div bg-primary'>
      <Button className='bg-primary'>
        {newLanguage == 'ENG' && "This seat is taken by"}
        {newLanguage == 'BG' && "Това място е заето от"}
        <img src={userIcon} width={40} height={40} alt='Responsive image' className='img-fluid mr-2 ml-2' />
        {chosenSeat.userThatOccupiedSeat}!</Button>
    </div>)
  }

  const logOut = () => {
    localStorage.clear();
    navigator('/login');
  }

  const callUserPreferenceForm = () => {
    return (<div>
      <button className='btn-navigate-user-settings-rooms btn btn-outline-success my-2 my-sm-0' onClick={() => {
        navigateToUserSettings();
      }}>
        <IoSettingsSharp size={30} />
        {newLanguage == 'ENG' && "Settings"}
        {newLanguage == 'BG' && "Настройки"}

      </button>
      <button className='btn-user-logout-setting-rooms btn btn-outline-info my-2 my-sm-0' onClick={() => {
        logOut();
      }}>
        <RiLogoutBoxLine size={30} />
        {newLanguage == 'ENG' && "Log out"}
        {newLanguage == 'BG' && "Изход"}

      </button>
      <button className='btn-user-home-setting-rooms btn btn-outline-primary my-2 my-sm-0' onClick={() => {
        navigateToHomePage();
      }}>
        <div className='mr-2 mb-3'>
          <FaHome size={30} />
          {newLanguage == 'ENG' && "Home"}
          {newLanguage == 'BG' && "Начало"}
        </div>
      </button>
    </div>)
  }

  const showAlertWhenClickedDisabledReason = () => {
    return (<div class="disable-event-alert-events alert alert-primary" role="alert">
      <button className="btn-close-disable-event-alert-rooms btn btn-danger" onClick={(e) => closeDisableEventAlert(e)}>x</button>
      <br />
      {newLanguage == 'ENG' && "Disable event description"}
      {newLanguage == 'BG' && "Описание"}: "{chosenEvent.disableEventDescription}"
    </div>)
  }

  const showAlertWhenClickedResourcesLink = () => {
    return (<div class="resource-link-alert-events alert alert-success" role="alert">
      <button className="btn-close-resources-link-alert-room btn btn-danger" onClick={(e) => closeResourceLinkAlert(e)}>x</button>
      <br />
      Links:
      <br />
      {chosenEvent.linkToPage.map((link, idx) => {
        return <div><a key={idx} href={link} title={link}>Link {idx + 1}</a><br /></div>
      })}
    </div>)
  }

  return (
    <>
      {parentRoom.faculty != '' && localStorage.setItem("faculty", parentRoom.faculty)};
      {parentRoom.room.roomType != undefined && localStorage.setItem("roomType", parentRoom.room.roomType)};
      {SidebarLeftComponent()}
      {SidebarRightComponent()}
      {updateSeatsToggle && SeatComponent()}
      {showForm && callEventForm()}
      {filterForm && callFilterForm()}
      {releaseSeat && releaseSeats()}
      <OpenUserSettings />
      {callSearchBar()}
      {callSearchBarForOrganizer()}
      {seatTakenEventForm && callSeatTakenEventForChosenUser()}
      {userPreferenceForm && callUserPreferenceForm()}
      {disableEventAlert && showAlertWhenClickedDisabledReason()}
      {resourceLinkAlert && showAlertWhenClickedResourcesLink()}
    </>
  )
}

export default RoomsPageComponent