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
  const ToggleSidebarAlways = () => {
    setIsopen(true);
  }

  const { floorId, roomId } = useParams();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [eventType, setEventType] = useState('');
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState('');

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

    const ToggleSidebar = () => {
      isOpen === true ? setIsopen(false) : setIsopen(true);
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
                <li><button className="btn btn-primary 
                                  submitButton
                                  sd-link text-light">Reserve your spot now!</button></li>
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
    const [toggleSeats, setToggleSeats] = useState(false);

    const toggleUpdateEvents = () => {
      setUpdateEventsToggle(!updateEventsToggle);
    }

    const updateToggleSeats = () => {
      setToggleSeats(!toggleSeats);
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

    // const openSeats = () => {
    //   getFloors().then((response) => {
    //     console.log(response.data)
    //     const newSeats = [];
    //     response.data.map(floor => {
    //       floor.rooms.map(room => {
    //         if (roomId == room.roomNumber) {
    //           room.seats.map(seat => {
    //             newSeats.push(seat.seatNumber);
    //           });
    //         }
    //       })
    //     });
    //     setSeats(newSeats);
    //   }).catch(error => {
    //     console.error(error);
    //   });
    // }

    const showEvent = (event,idx) => {
      return <button className="list-group-item list-group-item-success" key={idx} onClick={() => updateToggleSeats()}>
        <a className="list-group-item list-group-item-action active p-4">
          <div class="d-flex justify-content-between">
            <h5 class="mb-1">{event.name}</h5>
            <small>{event.eventType}</small>
          </div>
          <br />
          <p class="mb-1">{event.description}</p>
          <small>{event.data}</small>
        </a>
      </button>
    }

    return (
      <>
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
                <a class="btn btn-secondary dropdown-toggle sd-link text-light p-2 w-75 mt-5 text-center position-absolute top-75 start-50 translate-middle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Sort Events
                </a>
                <ul class="dropdown-menu">
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
                      console.log(event.name);
                      return showEvent(event,idx);
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

  const SeatsComponent = () => {
    const [seats, setSeats] = useState([]);
    const [seatAvailable, setSeatAvailable] = useState([]);
    const [seatReserved, setSeatReserved] = useState([]);

    useEffect(() => {
      getFloors().then((response) => {
        const newSeats = [];
        response.data.map(floor => {
          floor.rooms.map(room => {
            if (floorId == floor.floorNumber && roomId == room.roomNumber) {
              room.seats.map(seat => {
                newSeats.push(seat.seatNumber);
              });
            }
          })
        });
        setSeats(newSeats);
        setSeatAvailable(newSeats);
      }).catch(error => {
        console.error(error);
      })
    }, []);


    const onClickData = (seat) => {

      if (seatReserved.indexOf(seat) > -1) {
        setSeatAvailable(seatAvailable.concat(seat));
        setSeatReserved(seatReserved.filter(res => res != seat));
      } else {
        ToggleSidebarAlways();
        const userDTO = {
          "username": "asd",
          "seat": { "seatNumber": seat }
        }
        console.log(JSON.stringify(userDTO));
        reserveSpot(JSON.stringify(userDTO)).then((response) => {
          console.log(response.data);
        });

        setSeatReserved(seatReserved.concat(seat));
        setSeatAvailable(seatAvailable.filter(res => res != seat));
      }
    }

    const DrawGrid = () => {
      return (
        <div className="container">
          <table className="grid position-absolute top-50 start-50 translate-middle">
            <tbody>
              <tr>
                {seats.map((seat, idx) =>
                  <td
                    className='seat-button fa fa-times'
                    key={idx} onClick={e => onClickData(seat)}>{seat}
                    <i className="fa fa-bars"></i> </td>)}
              </tr>
            </tbody>
          </table>
        </div>
      )
    }

    return (
      <div>
        <h1 class='header-title'
          className='text-center display-2  text-light font-weight-bold position-absolute top-0 start-50 translate-middle mt-5'>FMI DeskSpot</h1>
        <DrawGrid />
      </div>
    )
  }


  return (
    <div>
      <SidebarRightComponent />
      <SidebarLeftComponent />
      <SeatsComponent />
      {showForm && callEventForm()}
    </div>
  )
}

export default RoomsPageComponent