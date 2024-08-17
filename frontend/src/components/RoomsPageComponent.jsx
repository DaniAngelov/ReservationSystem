import React, { useState, useEffect } from 'react'
import { reserveSpot } from '../services/UserService'
import { addEvent, getEvents, getFloors } from '../services/FloorService';
import { useParams } from 'react-router-dom';
import './RoomsPageComponent.css'
import logo from '../assets/fmi-deskspot-high-resolution-logo-white-transparent.png';
import axios from 'axios';

const RoomsPageComponent = () => {
  const REST_API_BASE_URL = 'http://localhost:8080/api/floors';
  const [events, setEvents] = useState([]);
  const eventSortFieldOptions = ['name', 'eventType', 'date', 'duration']
  const [isOpen, setIsopen] = useState(false);

  const { floorId, roomId } = useParams();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [eventType, setEventType] = useState('');
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState('');



  // Seats
  const [event, setEvent] = useState([]);

  const [seatColor, setSeatColor] = useState('green');

  const [chosenSeat, setChosenSeat] = useState('');

  const [chosenEvent, setChosenEvent] = useState('');

  const [updateSeatsToggle, setUpdateSeatsToggle] = useState(false)

  const toggleUpdateSeats = () => {
    setUpdateSeatsToggle(!updateSeatsToggle);
  }


  const ToggleSidebar = () => {
    return isOpen === true ? setIsopen(false) : setIsopen(true);
  }

  useEffect(() => {
    getEvents(['name'])
      .then((response) => {
        const newEvents = [];
        response.data.map(event => {
          newEvents.push(event);
        });
        setEvents(newEvents);
      }).catch(error => {
        console.error(error);
      })
    console.log("KOFA S BOKLUCI BE")
  }, []);

  const [showForm, setShowForm] = useState(false);

  const updateShowForm = () => {
    setShowForm(!showForm);
  }

  const addNewEvent = (e, name, description, eventType, date, duration) => {
    e.preventDefault();
    const floorNumber = floorId;
    const roomNumber = roomId;

    const eventDTO = {
      "name": name,
      "description": description,
      "eventType": eventType,
      "floorNumber": floorNumber,
      "roomNumber": roomNumber,
    }
    console.log(JSON.stringify(eventDTO));
    addEvent(JSON.stringify(eventDTO)).then((response) => {
      console.log(response.data);
    });
  }

  const callEventForm = () => {

    return (
      <>
        <div className='card-body text-center position-absolute top-50 start-50 translate-middle bg-secondary p-5 mt-5'>
          <h1 className='text-center mb-4 text-light font-weight-bold'>Add event</h1>
          <form>
            <div className='form-group text-start mb-2'>
              <label className='form-label text-light'>Name</label>
              <input type='text' placeholder='Enter Event name' class='form-control' value={name}
                onChange={(e) => setName(e.target.value)}>
              </input>
            </div>

            <div className='form-group text-start mb-2'>
              <label className='form-label text-light'>Description</label>
              <textarea className='form-control' placeholder='Enter Event Description' name='description' value={description} rows="3" onChange={(e) => setDescription(e.target.value)} />
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
              <label className='form-label text-light'>Date</label>
              <input type='date' placeholder='Enter Event date' name='date' value={date} className='form-control'
                onChange={(e) => setDate(e.target.value)}>
              </input>
            </div>

            <div className='form-group text-start mb-2'>
              <label className='form-label text-light'>Duration</label>
              <input type='text' placeholder='Enter Event duration' name='duration' value={duration} className='form-control'
                onChange={(e) => setDuration(e.target.value)}>
              </input>
            </div>
            <button className='btn btn-success mt-2' onClick={(event) => addNewEvent(event, name, description, eventType, date, duration)}>Add event!</button>
          </form>
        </div>
      </>)
  };



  const SidebarRightComponent = () => {

    const [color, setColor] = useState('white');
    const [backgroundColor, setBackgroundColor] = useState('black');
    const [text, setText] = useState('Reserve your spot now!');

    const takeSpot = (e) => {

      e.preventDefault();

      const userReserveSpotDTO = {
        "username": "topki2",
        "seat": chosenSeat,
        "floorNumber": floorId,
        "eventName": chosenEvent,
        "roomNumber": roomId,

      }
      console.log(JSON.stringify(userReserveSpotDTO));
      reserveSpot(JSON.stringify(userReserveSpotDTO)).then((response) => {
        console.log(response.data);
        console.log("status: " + response.status)
        setColor('black');
        setBackgroundColor('white');
        setText('Spot reserved!')
      }).catch((error) => {
        console.log(error);
      });

    }


    return (
      <>
        <div className="container-fluid mt-3">
          <div className={`sidebar ${isOpen == true ? 'active' : ''}`}>
            <div className="sd-header">
              <h4 className="mb-0">Sidebar Header</h4>
            </div>
            <div className="sd-body">
              <ul>
                <li><a className="sd-link">Menu Item 1</a></li>
                <li><a className="sd-link">Menu Item 2</a></li>
                <li><button className="btn  
                        submitButton
                        sd-link" style={{ color: color, backgroundColor: backgroundColor, content: text }} onClick={takeSpot} >{text}</button></li>
              </ul>
            </div>
          </div>

          <div className={`sidebar-overlay ${isOpen == true ? 'active' : ''}`} onClick={ToggleSidebar}></div>
        </div>
      </>
    )

  }

  const SidebarLeftComponent = () => {

    const [updateEventsToggle, setUpdateEventsToggle] = useState(false);

    const toggleUpdateEvents = () => {
      setUpdateEventsToggle(!updateEventsToggle);
    }

    const updateEvents = (filterOption) => {
      console.log(filterOption);
      axios.get(REST_API_BASE_URL + '/events', {
        params: {
          sortField: filterOption
        }
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
      return <button className="list-group-item list-group-item-action active p-1 mt-5 bg-success" key={idx} onClick={() => {
        setEvent(event);
        toggleUpdateSeats();
      }
      }>
        <div class="d-flex justify-content-between">
          <h5 class="mb-1">{event.name}</h5>
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
                <button className="btn btn-primary 
                                  sd-link text-light p-2 w-75 text-center position-absolute top-75 start-50 translate-middle" onClick={updateShowForm}>
                  Add event
                </button>
                <button class="btn btn-secondary dropdown-toggle sd-link text-light p-2 w-75 mt-5 text-center position-absolute top-75 start-50 translate-middle" id="dropdownMenuButton" role="button" data-bs-toggle="dropdown" aria-expanded="false" aria-haspopup="true">
                  Sort Events
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  {eventSortFieldOptions.map((option, idx) => {
                    return <li key={idx}><a className="dropdown-item sd-link" onClick={() => {
                      toggleUpdateEvents();
                      { updateEvents(option) }
                    }} >
                      {option}
                    </a></li>
                  })}

                </ul>
                <ul className='position-absolute mt-6 top-50 start-50 translate-middle p-5'>

                  {events.map((event, idx) => {
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

  const [modalState, setModalState] = useState(false);

  const ModalComponent = (show) => {

    const showModalState = show ? 'display' : 'display-none';

    return (
      <>
        <div class={`modal-body ${showModalState} text-center position-absolute top-50 start-50 translate-middle bg-success`} tabindex="-1">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                ...
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary">Save changes</button>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  const SeatComponent = () => {


    const updateSeatStatus = (eventName, seat) => {
      if (!seat.seatTaken) {
        ToggleSidebar()
        setChosenSeat(seat);
        setChosenEvent(eventName);
      } else {
        alert('This seat has already been taken!');
      }
    }


    return (
      <>

        <div className="container-fluid">
          <div className='position-absolute top-50 start-50 translate-middle'>
            {event.seats.map((seat, idx) =>
              <button

                className={`btn-2  ${seat.seatTaken == true ? 'btn-secondary' : 'btn-success'} m-4 p-3 btn-lg active`}
                key={idx} onClick={() => {
                  {
                    updateSeatStatus(event.name, seat);
                  }
                }}>
                {seat.seatNumber}
              </button>

            )
            }
          </div>

          {console.log("Chosen seat: " + chosenSeat)}
          {console.log("Chosen event: " + chosenEvent)}
          {console.log("Toggle side bar: " + isOpen)}

        </div>
      </>
    )
  }
  
  return (
    <>
      <SidebarLeftComponent />
      <SidebarRightComponent />
      {updateSeatsToggle && <SeatComponent />}
      {showForm && callEventForm()}
      
    </>
  )
}

export default RoomsPageComponent