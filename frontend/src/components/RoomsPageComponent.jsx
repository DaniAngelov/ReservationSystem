import React, { useState, useEffect, useRef } from 'react'
import { releaseSpot, reserveSpot } from '../services/UserService'
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

  // Seats
  const [event, setEvent] = useState([]);

  const [chosenSeat, setChosenSeat] = useState('');

  const [chosenEvent, setChosenEvent] = useState('');

  const [updateSeatsToggle, setUpdateSeatsToggle] = useState(false)

  const [releaseSeat, setReleaseSeat] = useState(false);

  const [showSortEvents, setShowSortEvents] = useState(false);

  const [filteredEvents, setFilteredEvents] = useState([]);
  
  const [activeIndex, setActiveIndex] = useState(0);

  const navigator = useNavigate();



  const toggleShowSortEvents = () => {
    return setShowSortEvents(!showSortEvents);
  }

  const ToggleReleaseSeats = () => {
    return setReleaseSeat(!releaseSeat);
  }

  const toggleUpdateSeats = () => {
    setUpdateSeatsToggle(!updateSeatsToggle);
  }


  const ToggleSidebar = () => {
    return isOpen === true ? setIsopen(false) : setIsopen(true);
  }

  useEffect(() => {
    getEvents(token)
      .then((response) => {
        console.log("RESPONSE:");
        console.log(response.data);
        const newEvents = [];
        response.data.map(event => {
          newEvents.push(event);
        });
        console.log("EVENTS")
        console.log(newEvents);
        setEvents(newEvents);
        setFilteredEvents(newEvents);
      }).catch(error => {
        console.error(error);
      })
  }, []);

  const [showForm, setShowForm] = useState(false);
  const [filterForm, setFilterForm] = useState(false);

  const updateShowForm = () => {
    setShowForm(!showForm);
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
      }
    }
    console.log(JSON.stringify(eventDTO));
    addEvent(JSON.stringify(eventDTO), token).then((response) => {
      alert("Event added successfully!");
      console.log(response.data);
    }).catch((error) => {
      alert("Event added successfully!");
      console.log(error);
    });
  }

  const callEventForm = () => {

    return (
      <>
        <div className='card-body-5 text-center bg-success p-5'>
          <h1 className=' text-center text-light font-weight-bold'>
            <MdEventAvailable size={60} className='mr-3 mb-1' />
            Add event</h1>
          <form className='add-event-form'>
            <div className='row'>
              <div className='col'>
                <div className='form-group text-start mb-2'>
                  <label className='form-label text-light'>Name</label>
                  <input type='text' placeholder='Enter Event name' autoComplete='random-name' class='form-control text-start' value={name}
                    onChange={(e) => setName(e.target.value)}>
                  </input>
                </div>

                <div className='form-group text-start mb-2 mt-2'>
                  <label className='form-label text-light'>Description</label>
                  <textarea className='form-control' autoComplete='random-description' placeholder='Enter Event Description' name='description' value={description} rows="2" onChange={(e) => setDescription(e.target.value)} />
                </div>

                <div className='form-group text-start mb-2 mt-2'>
                  <label className='form-label text-light'>Seats Number</label>
                  <input type='number' placeholder='Enter Number of seats' name='seatsNumber' value={seatsNumber} className='form-control text-start'
                    onChange={(e) => setSeatsNumber(e.target.value)}>
                  </input>
                </div>
              </div>
              <div className='col'>
                <div className='form-group text-start mb-2 ml-3'>
                  <label className='form-label text-light'>Event Type</label>
                  <select type='text' placeholder='Enter Event Type' name='eventType' value={eventType} className='form-control'
                    onChange={(e) => setEventType(e.target.value)}>
                    <option>LECTURE</option>
                    <option>EXAM</option>
                    <option>SEMINAR</option>
                  </select>
                </div>

                {eventType == '' && setEventType('LECTURE')}
                <div className='form-group text-start mb-2 col mt-4'>
                  <label className='form-label text-light'>Event Start Time</label>
                  <input type='datetime-local' placeholder='Enter Event Start Time' name='startDate' value={startDate} className='form-control text-start'
                    onChange={(e) => setStartDate(e.target.value)}>
                  </input>
                  <label className='form-label text-light mt-3'>Event End time</label>
                  <input type='datetime-local' placeholder='Enter Event End Time' name='endDate' value={endDate} className='form-control text-start'
                    onChange={(e) => setEndDate(e.target.value)}>
                  </input>
                </div>

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
        "eventName": chosenEvent,
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
        return <ul>
          <li>
            <h2 className='text-light'>Computer</h2>
            <Button onClick={() => {
              { toggleOccupiesComputer() }
              { updateComputerColor() }
            }}>
              <HiDesktopComputer size={45} color={computerColor} />
            </Button>
          </li>
          <li>
            <h2 className='text-light mb-2'>Charger</h2>
            <Button onClick={() => {
              { toggleOccupiesCharger() }
              { updateChargerColor() }
            }}>
              <LuCable size={45} color={chargerColor} />
            </Button>
          </li>
        </ul>
      } else {
        return '';
      }
    }


    return (
      <>
        <div className="container-fluid mt-3">
          <div className={`sidebar ${isOpen == true ? 'active' : ''}`}>
            <div className="sd-header">
              <h4 className="event-headline display-6">Event booking</h4>
            </div>
            <div className="sd-body text-center">
              <ul>
                <li>
                  <Button className='mt-2'>
                    <MdEventAvailable size={30} />
                    <h5 className='mt-3 text-light'>{`Event chosen: ${chosenEvent}`}</h5>
                  </Button>
                </li>
                <li>
                  <Button className='mt-2'>
                    <PiOfficeChairFill size={30} />
                    <h5 className='mt-3 text-light'>{`Seat chosen: ${chosenSeat.seatNumber}`}</h5>
                  </Button>
                </li>
                {console.log("room Type: " + parentRoom.room.roomType)};
                {openComputerRoomSpecs(parentRoom.room.roomType)}

                <li><button className="btn btn-custom-reserve-spot btn-outline-light my-2 my-sm-0 sd-link" style={{ backgroundColor: backgroundColor, content: text }} onClick={takeSpot} >{text}</button></li>
              </ul>
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

      console.log(events);
    }

    const showEventIfEnabled = (event) => {
      setEvent(event)
      toggleUpdateSeats();
    }

    const showEvent = (event, idx) => {

      let newStartDate = event.duration.startDate.replace('T', ' ');
      let newEndDate = event.duration.endDate.replace('T', ' ');

      

      return <Carousel.Item key={idx}>
        <button className={`d-block custom-event-button-2 text-light ${event.enabled == true ? 'bg-primary' : 'bg-secondary'} p-3 mt-5`} key={idx} onClick={() => {
          {console.log("IDX:" + idx)}
          setActiveIndex(idx)
           event.enabled == true && showEventIfEnabled(event)}}>
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
          <small>Organizer: {event.organizer}</small>
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
                <button className="btn btn-events-filter btn-success 
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
      if (!seat.seatTaken) {
        ToggleSidebar()
      } else {
        console.log()
        ToggleReleaseSeats();
      }
    }


    return (
      <>
        {console.log("NEWW EVENT:")}
        {console.log(event)}
        <div className="container-fluid">
          <div className='position-absolute top-50 start-50 translate-middle border border-primary'>
            {event.seats.map((seat, idx) =>
              <button
                className={`btn-2  ${seat.seatTaken == true ? 'btn-secondary' : 'btn-primary'} m-4 p-3 btn-lg active`}
                key={idx} onClick={() => {
                  {
                    updateSeatStatus(event.name, seat);
                  }
                }}>
                <PiOfficeChairFill size={30} />
              </button>
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
    console.log("User release DTO:");
    console.log(JSON.stringify(userReleaseSpotDTO));

    releaseSpot(JSON.stringify(userReleaseSpotDTO), token).then((response) => {
      ToggleReleaseSeats();
      console.log(response.data);
      console.log("status: " + response.status);
      alert('Spot successfully released!');

    }).catch((error) => {
      console.log(error);
      alert(error.response.data);
    });

  }


  const releaseSeats = () => {
    return (
      <button className='btn-release btn btn-outline-primary my-2 my-sm-0' type='submit' onClick={(e) => { releaseUserSpot(e, chosenSeat, chosenEvent) }}>
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
    console.log("Event search DTO:");
    console.log(JSON.stringify(userSearchEventDTO));

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

  return (
    <>
      <SidebarLeftComponent />
      <SidebarRightComponent />
      {updateSeatsToggle && <SeatComponent />}
      {showForm && callEventForm()}
      {filterForm && callFilterForm()}
      {releaseSeat && releaseSeats()}
      <OpenUserSettings />
      {callSearchBar()}
    </>
  )
}

export default RoomsPageComponent