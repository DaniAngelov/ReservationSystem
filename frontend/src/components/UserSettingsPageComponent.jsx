import React, { useEffect, useState } from 'react'
import logo from '../assets/fmi-deskspot-high-resolution-logo-white-transparent.png';
import './UserSettingsPageComponent.css'
import userIcon from '../assets/user-icon.png';
import { generateTwoFA, verifyTwoFA, enableTwoFA, generateOneTimePass, verifyOneTimePass, enableOneTimePass } from '../services/UserService';
import { BsShieldLockFill } from "react-icons/bs";
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom';
import { getEventsForUser, getEventsForOrganizer } from '../services/FloorService';
import { Carousel, Button } from "react-bootstrap";
import { MdEventAvailable } from "react-icons/md";
import { disableUserEvent } from '../services/FloorService';
import { HiLightBulb } from "react-icons/hi";

const UserSettingsPageComponent = () => {

  const [qrCode, setQrCode] = useState('');

  const [faEventForm, setFaEventForm] = useState(false);

  const [isOpen, setIsopen] = useState(false);

  const [dashboard, setDashBoard] = useState(false);

  const [createdEventsDashboard, setCreatedEventsDashBoard] = useState(false);

  const [otherDisableReason, setOtherDisableReason] = useState('');

  const [faEnabled, setFaEnabled] = useState(false);

  const [activeIndex, setActiveIndex] = useState(0);

  const [chosenEvent, setChosenEvent] = useState([]);

  const [newUserEvents, setNewUserEvents] = useState([]);

  const [organizerEvents, setOrganizerEvents] = useState([]);

  const [disableEvent, setDisableEvent] = useState(false);
  const [disableEventForm, setDisableEventForm] = useState(false);
  const [disableEventReason, setDisableEventReason] = useState('');

  const [digit1, setDigit1] = useState('');
  const [digit2, setDigit2] = useState('');
  const [digit3, setDigit3] = useState('');
  const [digit4, setDigit4] = useState('');
  const [digit5, setDigit5] = useState('');
  const [digit6, setDigit6] = useState('');

  const token = localStorage.getItem('token');

  const decodedToken = jwtDecode(token);

  const user = decodedToken.sub;

  const navigator = useNavigate();

  useEffect(() => {
    getEventsForUser(user, token)
      .then((response) => {
        const newEvents = [];
        response.data.map(event => {
          newEvents.push(event);
        });
        setNewUserEvents(newEvents);
      }).catch(error => {
        console.error(error);
      })
  }, []);

  useEffect(() => {
    getEventsForOrganizer(user, token).then((response) => {
      console.log("response");
      console.log(response.data);
      setOrganizerEvents(response.data);
    }).catch((error) => {
      console.log("error");
      console.log(error);
    })
  }, []);

  const ToggleSidebar = () => {
    return isOpen === true ? setIsopen(false) : setIsopen(true);
  }

  const toggleDisableEvent = () => {
    return setDisableEvent(!disableEvent);
  }

  const toggleDashboard = () => {
    return setDashBoard(!dashboard);
  }

  const toggleCreatedEventsDashboard = () => {
    return setCreatedEventsDashBoard(!createdEventsDashboard);
  }

  const toggleFaEventForm = () => {
    return setFaEventForm(!faEventForm);
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

  const verifySecret = (e) => {
    e.preventDefault();
    const code = `${digit1}${digit2}${digit3}${digit4}${digit5}${digit6}`;
    const request = {
      "code": code,
      "username": user
    }
    console.log(JSON.stringify(request));
    verifyTwoFA(request, token).then((response) => {
      console.log("response verify:");
      console.log(response.data);
      alert("Two Factor Authentication has been enabled! Next time you try to login it will be an option.")
      toggleFaEventForm();
      const newRequest = {
        "username":user,
        "enabled":true
      }
      enableTwoFA(newRequest, token).then((response) => {
      }).catch((error) => {
        console.log(error.response.data);
      });
    }).catch((error) => {
      console.log(error.response.data);
    });
  }



  const callEventForm = () => {

    return (
      <>
        <div className='card-body custom-card-body text-center bg-secondary p-5 mt-5 text-light'>
          <h1 className='text-center mb-2 text-light font-weight-bold'>
            <BsShieldLockFill size={100} className='mr-3' />
            Setup Two-Factor Authentication</h1>
          <ul className='sd-body text-start mb-5'>
            <li className='sd-link text-start mb-2'>
              Step 1: Get the Microsoft Authenticator app from the App Store.
            </li>
            <li className='sd-link text-start mb-3 mt-2'>
              Step 2: In the app select <b>Set up account</b>.
            </li>
            <li className='sd-link text-start mb-3'>
              Step 3: Choose <b>Scan qrcode</b>.
            </li>
            <li className='sd-link text-start mb-3'>
              Step 4: Scan the code below for the setup!
            </li>
            <li>
              <img src={qrCode} width={190} height={190} alt='Responsive image' className='img-fluid qrImage' />
              <h5 className='text-end'>Enter the verification code from your Authenticator app! </h5>
              <div className="custom-form">
                <input className="mr-2" type="text" maxLength="1" size="1" min="0" max="9" pattern="[0-9]{1}" value={digit1} onChange={(e) => setDigit1(e.target.value)} />
                <input className="mr-2" type="text" maxLength="1" size="1" min="0" max="9" pattern="[0-9]{1}" value={digit2} onChange={(e) => setDigit2(e.target.value)} />
                <input className="mr-2" type="text" maxLength="1" size="1" min="0" max="9" pattern="[0-9]{1}" value={digit3} onChange={(e) => setDigit3(e.target.value)} />
                <input className="mr-2" type="text" maxLength="1" size="1" min="0" max="9" pattern="[0-9]{1}" value={digit4} onChange={(e) => setDigit4(e.target.value)} />
                <input className="mr-2" type="text" maxLength="1" size="1" min="0" max="9" pattern="[0-9]{1}" value={digit5} onChange={(e) => setDigit5(e.target.value)} />
                <input className="mr-2 mb-5" type="text" maxLength="1" size="1" min="0" max="9" pattern="[0-9]{1}" value={digit6} onChange={(e) => setDigit6(e.target.value)} />
                <br />
                <button class="btn mt-3 btn-primary btn-embossed" onClick={(e) => { verifySecret(e) }}>Verify</button>
              </div>
            </li>
          </ul>

        </div>
      </>)
  };


  const enableTwoFactorAuthentication = () => {
    const request = {
      "username": user,
      "enabled": true
    }
    generateTwoFA(request, token).then((response) => {
      console.log(response.data);
      setQrCode(response.data.qrCodeUri);
      toggleFaEventForm();
    }).catch((error) => {
      console.log(error.response.data);
    });
    
  }

  const disableTwoFactorAuthentication = () => {
    const request = {
      "username": user,
      "enabled": false
    }
    enableTwoFA(request, token).then((response) => {
      alert("Two Factor Authentication has been disabled successfully!");
    }).catch((error) => {
      console.log(error.response.data);
    });
  }

  const enableOrDisableOneTimePass = () => {
    const request = {
      "username": user
    }
    enableOneTimePass(request, token).then((response) => {
      if (response.data.enabled == true) {
        alert("One Time pass code login has been enabled! Next time you try to login it will be an option.")
      } else {
        alert("One Time pass code login has been disabled!")
      }

    }).catch((error) => {
      console.log(error.response.data);
    });

  }

  const showEvent = (event, idx) => {
    let newStartDate = event.duration.startDate.replace('T', ' ');
    let newEndDate = event.duration.endDate.replace('T', ' ');
    return <Carousel.Item key={idx} className='carousel-new-item-2'>
      <button className={`d-block custom-event-button-2 text-light ${event.enabled == true ? 'bg-primary' : 'bg-secondary'} p-3 mt-5`} key={idx} >
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
        <small>Floor: {event.floorNumber}</small>
        <br />
        <small>Room: {event.roomNumber}</small>
        <br />
        <small>Organizer: {event.organizer}</small>
        <br />
        {!event.enabled && <small>
          Cancelled due to {event.disableEventReason}</small>}

      </button></Carousel.Item>;
  }

  const ShowAllEventsForUser = () => {
    console.log("events:");
    console.log(newUserEvents);
    return (
      <>
        <div>
          <Carousel className='carousel-2 p-5 mt-5'>
            {newUserEvents.map((event, idx) => {
              return showEvent(event, idx);
            })}

          </Carousel>
        </div>
      </>
    )
  }

  const showEventIfEnabled = (e, event) => {
    e.preventDefault();
    setChosenEvent(event);
    toggleDisableEvent();
  }


  const showCreatedEvent = (event, idx) => {
    let newStartDate = event.duration.startDate.replace('T', ' ');
    let newEndDate = event.duration.endDate.replace('T', ' ');
    console.log(event);
    console.log(event.enabled);
    return <Carousel.Item key={idx} className='carousel-new-item-2'>
      <div>
        <button className={`d-block custom-event-button-2 text-light ${event.enabled == true ? 'bg-primary' : 'bg-secondary'} p-3 mt-5`} key={idx} onClick={(e) => {
          setActiveIndex(idx)
          event.enabled == true && showEventIfEnabled(e, event)
        }
        }>
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
          <small>Floor: {event.floorNumber}</small>
          <br />
          <small>Room: {event.roomNumber}</small>
          <br />
          <small>Organizer: {event.organizer}</small>
          <br />
          {!event.enabled && <small>
            Cancelled due to {event.disableEventReason}</small>}


        </button>
      </div></Carousel.Item>;
  }

  const ShowAllCreatedEventsForUser = () => {
    console.log("events:");
    console.log(organizerEvents);
    return (
      <>
        <div>
          <Carousel className='carousel-2 p-5 mt-5' defaultActiveIndex={activeIndex} >

            {organizerEvents.map((event, idx) => {
              return showCreatedEvent(event, idx);
            })}


          </Carousel>
        </div>
      </>
    )
  }

  const callDisableEventButton = () => {
    return (
      <button className='btn-disable btn btn-outline-info my-2 my-sm-0' onClick={() => {
        toggleDisableEvent();
        ToggleSidebar();
      }} >
        Disable this event ?
      </button>
    )
  }

  const disableNewEvent = (e, disableReason) => {
    e.preventDefault();
    const disableEventDTO = {
      "disableReason": disableReason,
      "user": user,
      "name": chosenEvent.name
    }
    console.log(JSON.stringify(disableEventDTO));
    disableUserEvent(JSON.stringify(disableEventDTO), token).then((response) => {
      console.log("response");
      console.log(response);
      alert("You have successfully disabled this event!")
      setDisableEvent(false);
      setDisableEventForm(false);
    }).catch((error) => {
      console.log("error");
      console.log(error);
    })
  }


  const navigateToHome = () => {
    navigator('/welcome')
  }

  const SidebarLeftComponent = () => {
    return (
      <>
        <div className="container-fluid mt-3">
          <div className="sidebar-left">
            <div className="sd-header">
              <img src={logo} width={135} height={135} alt='Responsive image' className='img-fluid logoImage-3' />
            </div>
            <ul className='text-center m-2'>
              <li>
                <button className='btn btn-item-4 btn-secondary text-light' onClick={() => { enableTwoFactorAuthentication() }}>
                  Enable Two-Factor Authentication
                </button>
              </li>
              <li>
                <button className='btn btn-item-8 btn-secondary text-light' onClick={() => { disableTwoFactorAuthentication() }}>
                  Disable Two-Factor Authentication
                </button>
              </li>
              <li>
                <button className='btn btn-item-7 btn-secondary text-light' onClick={() => { enableOrDisableOneTimePass() }}>
                  One Time Pass Authentication
                </button>
              </li>
              <li>
                <button className='btn btn-item-5 btn-primary text-light' onClick={() => { toggleDashboard() }}>
                  Dashboard
                </button>
              </li>
              <li>
                <button className='btn btn-item-3 btn-primary text-light' onClick={() => { toggleCreatedEventsDashboard() }}>
                  Your created events
                </button>
              </li>
              <li>
                <button className='btn btn-item-6 btn-danger text-light' onClick={() => { navigateToHome() }}>
                  Home
                </button>
              </li>
            </ul>
          </div>
        </div>
      </>
    )
  }

  const SidebarRightComponent = () => {
    return (
      <>
        <div className="container-fluid mt-3">
          <div className={`sidebar-settings-right ${isOpen == true ? 'active' : ''}`}>
            <div className="sd-header">
              <h1 className='text-center mb-4 text-light font-weight-bold'>Disable event</h1>
            </div>
            <div className="sd-body text-center">
              <ul>
                <li>
                  <Button className='mt-2 mb-4'>
                    <MdEventAvailable size={30} />
                    <h5 className='mt-3 text-light'>{`Event chosen: ${chosenEvent.name}`}</h5>
                  </Button>
                </li>
                <li>
                  <Button className='mt-2 mb-4'>
                    <HiLightBulb size={60} />
                    <form className='mt-2'>
                      <div className='form-group text-start mb-2'>
                        <h5 className='form-label text-light text-center'>Reason for disabling event</h5>
                        <select type='text' placeholder='Enter Reason' name='disableEventReason' value={disableEventReason} className='form-control text-center'
                          onChange={(e) => { setDisableEventReason(e.target.value) }}>
                          <option>Health problems</option>
                          <option>Emergency</option>
                          <option>Absence</option>
                          <option>Other</option>
                        </select>
                      </div>
                      {disableEventReason == '' && setDisableEventReason('HEALTH_PROBLEMS')}
                      {disableEventReason == 'HEALTH PROBLEMS' && setDisableEventReason('HEALTH_PROBLEMS')}
                    </form>
                  </Button>
                </li>
                <li>
                  <button className='btn btn-disable-events btn-outline-success my-2 my-sm-0  mt-2 sd-link-settings-button' onClick={(e) => disableNewEvent(e, disableEventReason.toUpperCase())}>Disable event!</button>
                </li>
              </ul>

            </div>
          </div>



          <div className={`sidebar-settings-right-overlay ${isOpen == true ? 'active' : ''}`} onClick={ToggleSidebar}></div>
        </div>
      </>
    )
  }


  return (
    <>
      <SidebarLeftComponent />
      <SidebarRightComponent />
      {dashboard && <ShowAllEventsForUser />}
      {createdEventsDashboard && <ShowAllCreatedEventsForUser />}
      {faEventForm && callEventForm()}
      {disableEvent && callDisableEventButton()}
      <OpenUserSettings />
    </>
  )
}

export default UserSettingsPageComponent