import React, { useState, useEffect } from 'react'
import { releaseSpot, reserveSpot, getUsers } from '../services/UserService'
import { addEvent, getEvents, searchNewEvent } from '../services/FloorService';
import { useNavigate, useParams } from 'react-router-dom';
import './RoomsPageComponent.css'
import logo from '../assets/fmi-deskspot-high-resolution-logo-white-transparent.png';
import userIcon from '../assets/user-icon.png';
import axios from 'axios';
import { Button, Carousel } from "react-bootstrap";
import { HiDesktopComputer } from "react-icons/hi"
import { LuCable } from "react-icons/lu";
import { PiOfficeChairFill } from "react-icons/pi";
import { MdEventAvailable } from "react-icons/md";
import { jwtDecode } from 'jwt-decode'
import { IoMdSearch } from "react-icons/io";
import { BsPersonCheckFill } from "react-icons/bs";

const RoomsPageComponent = (parentRoom) => {
  const REST_API_BASE_URL = 'http://localhost:8080/api/floors';
  const [events, setEvents] = useState([]);
  const eventSortFieldOptions = ['name', 'eventType', 'date', 'duration']
  const [isOpen, setIsopen] = useState(false);

  const { floorId, roomId } = useParams();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [eventType, setEventType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [seatsNumber, setSeatsNumber] = useState('');

  const [dateOption, setDateOption] = useState('');

  const [searchField, setSearchField] = useState('');

  const token = localStorage.getItem('token');

  const decodedToken = jwtDecode(token);

  const user = decodedToken.sub;

  const role = decodedToken.role;

  const [qrCodeQuestions, setQrCodeQuestions] = useState('');

  const [qrQuestionsInputEnable, setQrQuestionsInputEnable] = useState(true);


  // Seats
  const [event, setEvent] = useState([]);

  const guests = []

  const guestDTO = [];

  const [chosenSeat, setChosenSeat] = useState('');

  const [chosenEvent, setChosenEvent] = useState('');

  const [updateSeatsToggle, setUpdateSeatsToggle] = useState(false)

  const [releaseSeat, setReleaseSeat] = useState(false);

  const [showSortEvents, setShowSortEvents] = useState(false);

  const [seatTakenEventForm, setSeatTakenEventForm] = useState(false);

  const [guestListEnabled, setGuestListEnabled] = useState(false);

  const [filteredEvents, setFilteredEvents] = useState([]);

  const [activeIndex, setActiveIndex] = useState(0);

  const [users, setUsers] = useState([]);

  const navigator = useNavigate();


  const toggleQrQuestionsInputEnable = () => {
    return setQrQuestionsInputEnable(!qrQuestionsInputEnable);
  }

  const toggleShowSortEvents = () => {
    return setShowSortEvents(!showSortEvents);
  }

  const ToggleSeatTakenEventForm = () => {
    return setSeatTakenEventForm(!seatTakenEventForm);
  }

  const ToggleReleaseSeats = () => {
    return setReleaseSeat(!releaseSeat);
  }

  const toggleUpdateSeats = () => {
    setUpdateSeatsToggle(!updateSeatsToggle);
  }

  const toggleGuestList = (e) => {
    e.preventDefault();
    return setGuestListEnabled(!guestListEnabled);
  }


  const ToggleSidebar = () => {
    return isOpen === true ? setIsopen(false) : setIsopen(true);
  }

  useEffect(() => {
    getUsers(token)
      .then((response) => {
        const newUsers = [];
        response.data.map(user => {
          if (user.role == 'LECTOR') {
            newUsers.push(user);
          }
        });
        setUsers(newUsers);
      }).catch(error => {
        console.error(error);
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

  const updateShowForm = () => {
    setShowForm(!showForm);
  }

  const closeShowForm = () => {
    setShowForm(false);
  }

  const updateFilterForm = () => {
    setFilterForm(!filterForm);
  }

  const OpenDatePicker = () => {
    return (<div className='form-group text-start mb-2'>
      <label className='form-label text-light'>Event Start Time</label>
      <input type='datetime-local' placeholder='Enter Event Start Time' name='startDate' value={startDate} className='form-control'
        onChange={(e) => setStartDate(e.target.value)}>
      </input>
      <label className='form-label text-light'>Event End time</label>
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

  const addNewEvent = (e, name, description, eventType, startDate, endDate, numberOfSeats) => {
    e.preventDefault();
    const floorNumber = floorId;
    const roomNumber = roomId;
    const faculty = parentRoom.faculty;
    const seats = [];

    for (let i = 1; i <= numberOfSeats; i++) {
      seats.push({ seatNumber: `T${i}`, seatTaken: false });
    }

    const eventDTO = {
      "name": name,
      "description": description,
      "eventType": eventType,
      "facultyName": faculty,
      "floorNumber": floorNumber,
      "roomNumber": roomNumber,
      "seats": seats,
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
      alert("Event added successfully!");
      console.log(response.data);
    }).catch((error) => {
      alert(error.response.data);
      console.log(error);
    });
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
      });

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
            Add event</h1>
          <form className='add-event-form'>
            <div className='row'>
              <div className='col'>
                <div class="form-floating text-start mb-3 mt-4">
                  <input type="text" class="form-control text-start" id="floatingInput" placeholder="Enter Event Name" value={name}
                    onChange={(e) => setName(e.target.value)} />
                  <label for="floatingInput text-light">Enter Name</label>
                </div>

                <div class="form-floating text-start mb-3 mt-4">
                  <textarea class="form-control text-start" id="floatingInput2" placeholder="Enter Event Description" value={description} rows="3" onChange={(e) => setDescription(e.target.value)} />
                  <label for="floatingInput2 text-light">Enter Description</label>
                </div>

                <div class="form-floating text-start mb-3 mt-4">
                  <input type="number" class="form-control text-start" id="floatingInput3" placeholder="Enter Number of seats" value={seatsNumber} onChange={(e) => setSeatsNumber(e.target.value)} />
                  <label for="floatingInput3 text-light">Enter Seats Number</label>
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
                  <label for="floatingInput4 text-light">Enter Event Type</label>
                </div>

                {eventType == '' && setEventType('LECTURE')}
                <div class="form-floating text-start mb-3 mt-4 ml-3">
                  <input type="datetime-local" class="form-control text-start" id="floatingInput5" placeholder="Enter Event Start Time" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                  <label for="floatingInput5 text-light">Event Start Time</label>
                </div>
                <div class="form-floating text-start mb-3 mt-4 ml-3">
                  <input type="datetime-local" class="form-control text-start" id="floatingInput6" placeholder="Enter Event End time" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                  <label for="floatingInput6 text-light">Enter Event End time</label>
                </div>
              </div>
              <div className='col'>
                <button class=" btn btn-light text-dark p-3 w-100 mt-4 text-center" type="button" data-bs-toggle="dropdown" aria-expanded="false" >
                  Add guest
                </button>
                <ul class="dropdown-menu w-100">
                  {users.map((user, idx) => {
                    return <li key={idx}><a className="dropdown-item p-2 text-center" onClick={(e) => {
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
              </div>
              <div className='col'>

                <div class="form-floating text-start mb-3 mt-4 w-100">
                  {qrQuestionsInputEnable && <input class="form-control text-start" id="floatingInput7" placeholder="Enter Event Name" onPasteCapture={(e) => {
                    toggleQrQuestionsInputEnable();
                    setQrCodeQuestions(URL.createObjectURL(e.clipboardData.files[0]));
                  }} />}
                  {qrQuestionsInputEnable && <label for="floatingInput7 mt-3">Slido Code</label>}

                </div>
                {qrCodeQuestions != '' &&
                  <h5 className='text-light ml-4 mt-4'>Event Questions Code</h5>}
                {qrCodeQuestions != '' && callTurningToData(qrCodeQuestions)}
                {qrCodeQuestions != '' &&
                  <img src={qrCodeQuestions} className='qr-code-questions-img' />}
              </div>

            </div>
            <button className='btn-add-event btn text-center btn-primary mt-4 w-50' onClick={(event) => addNewEvent(event, name, description, eventType, startDate, endDate, seatsNumber)}>Add event!</button>
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
    }
    console.log('filtered events after:');
    console.log(newFilteredEvents);
    setFilteredEvents(newFilteredEvents);
  }

  const callFilterForm = () => {

    return (
      <>
        <div className='card-body-filter text-center bg-secondary p-5 mt-5'>
          <h1 className='text-center mb-4 text-light font-weight-bold'>Filter events</h1>
          <form>
            <div className='form-group text-start mb-2'>
              <label className='form-label text-light'>Event Type</label>
              <select type='text' placeholder='Enter Event Type' name='eventType' value={eventType} className='form-control'
                onChange={(e) => { setEventType(e.target.value) }}>
                <option>LECTURE</option>
                <option>EXAM</option>
                <option>SEMINAR</option>
              </select>
            </div>

            {eventType == '' && setEventType('LECTURE')}

            <div className='form-group text-start mb-2'>
              <label className='form-label text-light'>Date</label>
              <select type='text' placeholder='Enter Date' name='eventType' value={dateOption} className='form-control'
                onChange={(e) => {
                  setDateOption(e.target.value)
                }}>
                <option>Today</option>
                <option>Tomorrow</option>
                <option>Specify date</option>
              </select>
            </div>
            {dateOption == '' && setDateOption('Today')}
            {dateOption == 'Specify date' && <OpenDatePicker />}
            <button className='btn btn-filter-events btn-success mt-2 p-3' onClick={(e) => filterNewEvents(e, eventType, dateOption, startDate, endDate)}>Filter events!</button>
          </form>
        </div>
      </>)
  };



  const SidebarRightComponent = () => {

    const [backgroundColor, setBackgroundColor] = useState('#212529');
    const [text, setText] = useState('Reserve your spot now!');

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
        "facultyName": parentRoom.faculty,
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
        setText('Spot reserved!')
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
            <h2 className='text-light mt-2'>Computer</h2>
            <Button onClick={() => {
              { toggleOccupiesComputer() }
              { updateComputerColor() }
            }}>
              <HiDesktopComputer size={45} color={computerColor} />
            </Button>
          </div>
          <div className='charger-link-item col'>
            <h2 className='text-light mb-2 mt-2'>Charger</h2>
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
        <div className="container-fluid mt-3">
          <div className={`sidebar ${isOpen == true ? 'active' : ''}`}>
            <div className="sd-body text-center row">
              <Button className='mt-2'>
                <MdEventAvailable size={30} />
                <h5 className='mt-3 text-light'>{`Event chosen: ${chosenEvent.name}`}</h5>
              </Button>
              <Button className='mt-2'>
                <PiOfficeChairFill size={30} />
                <h5 className='mt-3 text-light'>{`Seat chosen: ${chosenSeat.seatNumber}`}</h5>
              </Button>


              {console.log("room Type: " + parentRoom.room.roomType)};
              {openComputerRoomSpecs(parentRoom.room.roomType)}
              {console.log(chosenEvent)}
              {chosenEvent.qrCodeQuestions != '' &&
                <h5 className='text-light header-qr-code-client-image'>Have any questions or want to vote before event? Scan the QR code below!</h5>}
              {chosenEvent.qrCodeQuestions != '' &&
                <img src={chosenEvent.qrCodeQuestions} className='qr-code-client-image' />}

              <li><button className="btn btn-custom-reserve-spot btn-outline-light my-2 my-sm-0 sd-link" style={{ backgroundColor: backgroundColor, content: text }} onClick={takeSpot} >{text}</button></li>

            </div>
          </div>

          <div className={`sidebar-overlay ${isOpen == true ? 'active' : ''}`} onClick={ToggleSidebar}></div>
        </div>
      </>
    )

  }

  const SidebarLeftComponent = () => {

    const updateEvents = (filterOption) => {
      console.log(filterOption);
      axios.get(REST_API_BASE_URL + '/events', {
        params: {
          sortField: filterOption
        },
        headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` }
      }).then((response) => {
        const newEvents = [];
        response.data.map(event => {
          newEvents.push(event);
        });
        setEvents(newEvents);
      }).catch(error => {
        console.error(error);
      });
    }

    const showEventIfEnabled = (event) => {
      setEvent(event)
      toggleUpdateSeats();
    }

    const showEvent = (event, idx) => {

      let newStartDate = event.duration.startDate.replace('T', ' ');
      let newEndDate = event.duration.endDate.replace('T', ' ');

      return <Carousel.Item key={idx}>
        <button className={`d-block custom-event-button-2 text-light ${event.enabled == true ? 'bg-success' : 'bg-secondary'} p-3 mt-5`} key={idx} onClick={() => {
          setActiveIndex(idx)
          event.enabled == true && showEventIfEnabled(event)
        }}>
          <MdEventAvailable size={30} />
          <h5>Event: {event.name}</h5>
          <small>Event type: {event.eventType}</small>
          <br />
          <small class="mb-1 mt-2">Description: {event.description}</small>
          <br />
          <small>Start: {newStartDate}</small>
          <br />
          <small>End: {newEndDate}</small>
          <br />
          {event.linkToPage == null ? <small>Organizer: {event.organizer}</small> :
            <small>Organizer: <a href={`${event.linkToPage}`} onClick={(e) => e.stopPropagation()} > {event.organizer}</a></small>}
          <br />
          {!event.enabled && <small>
            Cancelled due to {event.disableEventReason}</small>}

        </button></Carousel.Item>;

    }


    return (
      <>
        <h1 className='header text-center display-2 text-light font-weight-bold position-absolute top-0 start-50 translate-middle mt-5'>FMI DeskSpot</h1>
        <div className="container-fluid mt-3">
          <div className="sidebar-left">
            <div className="sd-header">
              <img src={logo} width={100} height={100} alt='Responsive image' className='img-fluid logoImage-2' />
            </div>

            <div className="sd-body">

              <div className='mt'>
                {role != 'USER' && <button className="btn btn-events-add btn-primary 
                                  text-light p-2 w-75 text-center mt-1" onClick={updateShowForm}>
                  Add event
                </button>}
                <button className="btn btn-events-filter btn-danger 
                                   text-light p-2 w-75 text-center mt-2" onClick={updateFilterForm}>
                  Filter events
                </button>
                <button class=" btn btn-events-sort btn-secondary text-light p-2 w-75 mt-5 text-center" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Sort Events
                </button>
                <ul class="dropdown-menu">
                  {eventSortFieldOptions.map((option, idx) => {
                    return <li key={idx}><a className="dropdown-item" onClick={() => {
                      { toggleShowSortEvents }
                      { updateEvents(option) }
                    }} >
                      {option}
                    </a></li>
                  })}
                </ul>

                <Carousel size={150} width={150} height={200} className='p-5 mt-5' defaultActiveIndex={activeIndex}>
                  {filteredEvents.map((event, idx) => {


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

    const updateSeatStatus = (eventName, seat) => {
      setChosenSeat(seat);
      setChosenEvent(eventName);
      console.log("THIS SEAT:") + seat;
      if (!seat.seatTaken) {
        ToggleSidebar()
      } else {
        if (seat.userThatOccupiedSeat == user) {
          ToggleReleaseSeats();
        } else {
          ToggleSeatTakenEventForm();
        }

      }
    }

    return (
      <>
        {console.log("GUESTS OF EVENT:")}
        {console.log(event.guests)}
        <div className="container-fluid">
          <div className={`${event.seats.length > 20 ? 'seats-div-custom' : 'seats-div-custom-lower-seats-count'} border-primary row text-center`}>
            <div className='lectors-div-guests row'>
              {event.seats.map((seat,idx) =>
                <div className='col'>
                  {(seat.seatType == 'LECTOR' || seat.seatType == 'GUEST') && <button
                    className={`btn-2  ${seat.seatTaken == true ? 'btn-secondary' : 'btn-primary'} 
                  ${event.seats.length > 20 ? 'p-2' : 'p-3'} m-2 btn-lg active`}
                    key={idx} onClick={() => {
                      {
                        updateSeatStatus(event, seat);
                      }
                    }}>
                    <PiOfficeChairFill size={30} />

                  </button>}
                </div>
              )}
            </div>

            {event.seats.map((seat, idx) =>
              <div className='col'>
                {seat.seatType == 'NORMAL' && <button
                  className={`btn-2  ${seat.seatTaken == true ? 'btn-secondary' : 'btn-primary'} 
                  ${event.seats.length > 20 ? 'p-2' : 'p-3'} m-2 btn-lg active`}
                  key={idx} onClick={() => {
                    {
                      updateSeatStatus(event, seat);
                    }
                  }}>
                  <PiOfficeChairFill size={30} />

                </button>}

              </div>
            )
            }
          </div>
        </div>
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
      alert('Spot successfully released!');

    }).catch((error) => {
      console.log(error);
      alert(error.response.data);
    });

  }


  const releaseSeats = () => {
    return (
      <button className='btn-release btn btn-outline-primary my-2 my-sm-0' type='submit' onClick={(e) => { releaseUserSpot(e, chosenSeat, chosenEvent.name) }}>
        Release your spot ?
      </button>)
  }

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

  const findEvent = (e, searchField) => {
    e.preventDefault();
    const facultyName = parentRoom.faculty;
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
            <IoMdSearch size={40} className='text-secondary search-bar-icon' />
            <input class="form-control mr-sm-2" type="search" placeholder="Search for event" aria-label="Search" value={searchField}
              onChange={(e) => setSearchField(e.target.value)} />
            <button class="btn btn-outline-success my-2 my-sm-0" onClick={(e) => findEvent(e, searchField)}>Search</button>
          </form>
        </nav>
      </>
    )
  }

  const callSeatTakenEventForChosenUser = () => {
    return (<div className='chosen-seat-taken-for-user-div bg-primary'>
      <Button className='bg-primary'>This seat is taken by
        <img src={userIcon} width={40} height={40} alt='Responsive image' className='img-fluid mr-2 ml-2' />
        {chosenSeat.userThatOccupiedSeat}!</Button>
    </div>)
  }

  return (
    <>
      {SidebarLeftComponent()}
      <SidebarRightComponent />
      {updateSeatsToggle && <SeatComponent />}
      {showForm && callEventForm()}
      {filterForm && callFilterForm()}
      {releaseSeat && releaseSeats()}
      <OpenUserSettings />
      {callSearchBar()}
      {seatTakenEventForm && callSeatTakenEventForChosenUser()}
    </>
  )
}

export default RoomsPageComponent