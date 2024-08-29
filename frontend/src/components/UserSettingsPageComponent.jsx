import React, { useEffect, useState } from 'react'
import logo from '../assets/fmi-deskspot-high-resolution-logo-white-transparent.png';
import './UserSettingsPageComponent.css'
import userIcon from '../assets/user-icon.png';
import { generateTwoFA, verifyTwoFA } from '../services/UserService';
import { BsShieldLockFill } from "react-icons/bs";
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom';
import { getEventsForUser } from '../services/FloorService';
import { Carousel } from "react-bootstrap";
import { MdEventAvailable } from "react-icons/md";

const UserSettingsPageComponent = () => {

  const [qrCode, setQrCode] = useState('');

  const [faEventForm, setFaEventForm] = useState(false);

  const [dashboard, setDashBoard] = useState(false);

  const [faEnabled, setFaEnabled] = useState(false);

  const [events, setEvents] = useState([]);

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
        setEvents(newEvents);
      }).catch(error => {
        console.error(error);
      })
  }, []);


  const toggleDashboard = () => {
    return setDashBoard(!dashboard);
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
      alert("You have set 2FA Successfully!");
      toggleFaEventForm();
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
              Step 3: Choose <b>Scan barcode</b>.
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


  const enableTwoFactorAuthentication = (enabledFa) => {
    if (!enabledFa) {
      console.log("here");
      console.log("enabled fa:" + enabledFa);
      const request = {
        "username": user,
        "mfaEnabled": true
      }
      generateTwoFA(request, token).then((response) => {
        console.log(response.data);
        setQrCode(response.data.qrCodeUri);
        toggleFaEventForm();
      }).catch((error) => {
        console.log(error.response.data);
      });

    } else {
      console.log("enabled fa:" + enabledFa);
      console.log(" FA IS ENABLED!");
    }
  }

  const showEvent = (event, idx) => {
    let newStartDate = event.duration.startDate.replace('T', ' ');
    let newEndDate = event.duration.endDate.replace('T', ' ');
    console.log(event);
    return <Carousel.Item key={idx} className='carousel-new-item-2'>
      <button className="d-block custom-event-button-2 text-light bg-primary p-3 mt-5" key={idx} onClick={() => {
        setEvent(event);
        toggleUpdateSeats();
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

      </button></Carousel.Item>;
  }

  const ShowAllEventsForUser = () => {
    console.log("events:");
    console.log(events);
    return (
      <>
        <div>
          <Carousel size={150} width={150} height={200} className='carousel-2 p-5 mt-5'>
            {events.map((event, idx) => {
              return showEvent(event, idx);
            })}

          </Carousel>
        </div>
      </>
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
            <ul className='text-center'>
              <li>
                <button className='btn-item-2 btn-primary text-light mb-5' onClick={() => { toggleDashboard() }}>
                  Dashboard
                </button>
              </li>
              <li>
                <button className='btn btn-item-2 btn-primary text-light mt-5' onClick={() => { enableTwoFactorAuthentication(faEnabled) }}>
                  Two-Factor Authentication
                </button>
              </li>
            </ul>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <SidebarLeftComponent />
      {dashboard && <ShowAllEventsForUser />}
      {faEventForm && callEventForm()}
      <OpenUserSettings />
      {console.log(decodedToken)}
    </>
  )
}

export default UserSettingsPageComponent