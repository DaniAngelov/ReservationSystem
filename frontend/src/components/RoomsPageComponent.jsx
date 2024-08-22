import React, { useState, useEffect } from 'react'
import { releaseSpot, reserveSpot } from '../services/UserService'
import { addEvent, getEvents } from '../services/FloorService';
import { useNavigate, useParams } from 'react-router-dom';
import './RoomsPageComponent.css'
import logo from '../assets/fmi-deskspot-high-resolution-logo-white-transparent.png';
import one from '../assets/one.jpg';
import two from '../assets/two.png';
import three from '../assets/three.jpg';
import userIcon from '../assets/user-icon.png';
import axios from 'axios';
import { Button } from "react-bootstrap";
import { HiDesktopComputer } from "react-icons/hi"
import { LuCable } from "react-icons/lu";
import { PiOfficeChairFill } from "react-icons/pi";
import { MdEventAvailable } from "react-icons/md";
import { jwtDecode } from 'jwt-decode'

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

  const [filteredEvents, setFilteredEvents] = useState([])

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
        const newEvents = [];
        response.data.map(event => {
          newEvents.push(event);
        });
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
    const seats = [];

    for (let i = 1; i <= numberOfSeats; i++) {
      seats.push({ seatNumber: `T${i}`, seatTaken: false });
    }

    const eventDTO = {
      "name": name,
      "description": description,
      "eventType": eventType,
      "floorNumber": floorNumber,
      "roomNumber": roomNumber,
      "seats": seats,
      "duration": {
        "startDate": startDate,
        "endDate": endDate
      }
    }
    console.log(JSON.stringify(eventDTO));
    addEvent(JSON.stringify(eventDTO), token).then((response) => {
      console.log(response.data);
    });
  }

  const callEventForm = () => {

    return (
      <>
        <div className='card-body text-center bg-secondary p-5 mt-5'>
          <h1 className='text-center mb-4 text-light font-weight-bold'>Add event</h1>
          <form>
            <div className='form-group text-start mb-2'>
              <label className='form-label text-light'>Name</label>
              <input type='text' placeholder='Enter Event name' autoComplete='random-name' class='form-control text-start' value={name}
                onChange={(e) => setName(e.target.value)}>
              </input>
            </div>

            <div className='form-group text-start mb-2'>
              <label className='form-label text-light'>Description</label>
              <textarea className='form-control' autoComplete='random-description' placeholder='Enter Event Description' name='description' value={description} rows="3" onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div className='form-group text-start mb-2'>
              <label className='form-label text-light'>Event Type</label>
              <select type='text' placeholder='Enter Event Type' name='eventType' value={eventType} className='form-control'
                onChange={(e) => setEventType(e.target.value)}>
                <option>LECTURE</option>
                <option>EXAM</option>
                <option>SEMINAR</option>
              </select>
            </div>

            <div className='form-group text-start mb-2'>
              <label className='form-label text-light'>Event Start Time</label>
              <input type='datetime-local' placeholder='Enter Event Start Time' name='startDate' value={startDate} className='form-control text-start'
                onChange={(e) => setStartDate(e.target.value)}>
              </input>
              <label className='form-label text-light'>Event End time</label>
              <input type='datetime-local' placeholder='Enter Event End Time' name='endDate' value={endDate} className='form-control text-start'
                onChange={(e) => setEndDate(e.target.value)}>
              </input>
            </div>

            <div className='form-group text-start mb-2'>
              <label className='form-label text-light'>Seats Number</label>
              <input type='number' placeholder='Enter Number of seats' name='seatsNumber' value={seatsNumber} className='form-control text-start'
                onChange={(e) => setSeatsNumber(e.target.value)}>
              </input>
            </div>
            <button className='btn text-center btn-success mt-2' onClick={(event) => addNewEvent(event, name, description, eventType, startDate, endDate, seatsNumber)}>Add event!</button>
          </form>
        </div>
      </>)
  };

  const filterNewEvents = (e, eventType, dateOption, startDate, endDate) => {
    e.preventDefault();
    let newFilteredEvents = events.filter((event) => event.eventType == eventType);
    console.log('filtered events Before floor filter and after event type filter:');
    console.log(newFilteredEvents);
    newFilteredEvents = events.filter((event) => event.roomNumber == roomId && event.floorNumber == floorId);
    console.log(events);
    const newStartDate = Date.parse(startDate);
    const newEndDate = Date.parse(endDate);
    const nowTime = new Date(Date.now());
    console.log('filtered events After floor filter:');
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

    const [color, setColor] = useState('white');
    const [backgroundColor, setBackgroundColor] = useState('black');
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
        "eventName": chosenEvent,
        "roomNumber": roomId,
        "occupiesComputer": occupiesComputer,
        "occupiesCharger": occupiesCharger,
      }
      console.log(JSON.stringify(userReserveSpotDTO));

      reserveSpot(JSON.stringify(userReserveSpotDTO), token).then((response) => {
        console.log(response.data);
        console.log("status: " + response.status)
        setColor('black');
        setBackgroundColor('white');
        setText('Spot reserved!')
        console.log("color" + color)
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
            <h2 className='text-light mb-3'>Computer</h2>
            <Button className='computer-button mb-2' onClick={() => {
              { toggleOccupiesComputer() }
              { updateComputerColor() }
            }}>
              <HiDesktopComputer size={45} color={computerColor} />
            </Button>
          </li>
          <li>
            <h2 className='text-light mb-3'>Charger</h2>
            <Button className='computer-button mb-1' onClick={() => {
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
              <h4 className="event-headline mb-0  display-6">Event booking</h4>
            </div>
            <div className="sd-body text-center">
              <ul>
                <li>
                  <Button className='mt-2'>
                    <MdEventAvailable size={30} />
                    <h5 className=' mb-3 mt-3 text-light'>{`Event chosen: ${chosenEvent}`}</h5>
                  </Button>
                </li>
                <li>
                  <Button className='mt-2 mb-2'>
                    <PiOfficeChairFill size={30} />
                    <h5 className='mt-3 text-light'>{`Seat chosen: ${chosenSeat.seatNumber}`}</h5>
                  </Button>
                </li>
                {console.log("room Type: " + parentRoom.room.roomType)};
                {openComputerRoomSpecs(parentRoom.room.roomType)}

                <li><button className="btn btn-custom sd-link" style={{ color: color, backgroundColor: backgroundColor, content: text }} onClick={takeSpot} >{text}</button></li>
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

    const showEvent = (event, idx) => {
      return <button className="list-group-item list-group-item-action active p-5 mt-5 bg-success" key={idx} onClick={() => {
        setEvent(event);
        toggleUpdateSeats();
      }
      }>
        <div class="d-flex justify-content-between ">
          <h5 class="m3-1">{event.name}</h5>
          <small>{event.eventType}</small>
        </div>
        <br />
        <p class="mb-1">{event.description}</p>
        <small>{event.date}</small>
      </button>
    }

    return (
      <>
        <h1 className='header text-center display-2 text-light font-weight-bold position-absolute top-0 start-50 translate-middle mt-5'>FMI DeskSpot</h1>
        <div className="container-fluid mt-3">
          <div className="sidebar-left">
            <div className="sd-header">
              <img src={logo} width={135} height={135} alt='Responsive image' className='img-fluid logoImage' />
            </div>

            <div className="sd-body drop">

              <div className='mt'>
                {role != 'USER' && <button className="btn btn-events-add btn-primary 
                                  text-light p-2 w-75 text-center" onClick={updateShowForm}>
                  Add event
                </button>}
                <button className="btn btn-events-filter btn-success 
                                   text-light p-2 w-75 text-center" onClick={updateFilterForm}>
                  Filter events
                </button>
                <button class=" btn btn-events-sort btn-secondary text-light p-2 w-75 mt-5 text-center " type="button" data-bs-toggle="dropdown" aria-expanded="false">
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



                <ul className='events p-5 mt-3'>

                  {filteredEvents.map((event, idx) => {
                    if (event.floorNumber == floorId && event.roomNumber == roomId) {
                      return showEvent(event, idx);
                    }

                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>

      </>
    )
  }

  // const [modalState, setModalState] = useState(false);

  // const ModalComponent = (show) => {

  //   const showModalState = show ? 'display' : 'display-none';

  //   return (
  //     <>
  //       <div class={`modal-body ${showModalState} text-center position-absolute top-50 start-50 translate-middle bg-success`} tabindex="-1">
  //         <div class="modal-dialog">
  //           <div class="modal-content">
  //             <div class="modal-header">
  //               <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
  //               <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
  //             </div>
  //             <div class="modal-body">
  //               ...
  //             </div>
  //             <div class="modal-footer">
  //               <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
  //               <button type="button" class="btn btn-primary">Save changes</button>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </>
  //   )
  // }

  const ReleaseSeats = () => {

    const releaseUserSpot = (e, seat, eventName) => {
      e.preventDefault();
      const userReleaseSpotDTO = {
        "username": user,
        "seat": seat,
        "floorNumber": floorId,
        "eventName": eventName,
        "roomNumber": roomId
      }
      console.log("User release DTO:");
      console.log(JSON.stringify(userReleaseSpotDTO));
      releaseSpot(JSON.stringify(userReleaseSpotDTO), token).then((response) => {
        console.log(response.data);
        console.log("status: " + response.status);
        alert('Spot successfully released!');
      }).catch((error) => {
        console.log(error);
        alert(error.response.data);
      });
    }

    return (
      <>
        <button className='btn btn-release bg-success' onClick={(e) => { releaseUserSpot(e, chosenSeat, chosenEvent) }}>
          Release your spot ?
        </button>
      </>)
  }

  const SeatComponent = () => {

    const updateSeatStatus = (eventName, seat) => {
      console.log(chosenUser);
      setChosenSeat(seat);
      setChosenEvent(eventName);
      if (!seat.seatTaken) {
        ToggleSidebar()
      } else {
        console.log()
        ToggleReleaseSeats();
        // alert('This seat has already been taken!');
      }
    }


    return (
      <>

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
          {/* 
          {console.log("Chosen seat: " + chosenSeat)}
          {console.log("Chosen event: " + chosenEvent)}
          {console.log("Toggle side bar: " + isOpen)} */}

        </div>
      </>
    )
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

  return (
    <>

      <SidebarLeftComponent />
      <SidebarRightComponent />
      {updateSeatsToggle && <SeatComponent />}
      {showForm && callEventForm()}
      {filterForm && callFilterForm()}
      {releaseSeat && <ReleaseSeats />}
      <OpenUserSettings />
    </>
  )
}

export default RoomsPageComponent