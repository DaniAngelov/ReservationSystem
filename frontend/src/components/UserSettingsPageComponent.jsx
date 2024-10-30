import React, { useEffect, useState } from 'react'
import logo from '../assets/fmi-deskspot-high-resolution-logo-white-transparent.png';
import './UserSettingsPageComponent.css'
import userIcon from '../assets/user-icon.png';
import oneStarEmoji from '../assets/1-star-emoji.png';
import twoStarEmoji from '../assets/2-star-emoji.png';
import threeStarEmoji from '../assets/3-star-emoji.png';
import fourStarEmoji from '../assets/4-star-emoji.png';
import fiveStarEmoji from '../assets/5-star-emoji.png';
import { generateTwoFA, verifyTwoFA, enableTwoFA, enableOneTimePass, addLinkToPage, getUserByUsername, updateNewLanguage } from '../services/UserService';
import { BsShieldLockFill } from "react-icons/bs";
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom';
import { getEventsForUser, getEventsForOrganizer, deleteEvent, addFeedbackForm } from '../services/FloorService';
import { Carousel, Button } from "react-bootstrap";
import { MdEventAvailable } from "react-icons/md";
import { disableUserEvent } from '../services/FloorService';
import { HiLightBulb } from "react-icons/hi";
import { FaHome } from "react-icons/fa";
import { FaUserPen } from "react-icons/fa6";
import { MdAutoDelete } from "react-icons/md";
import { VscFeedback } from "react-icons/vsc";
import { GiPresent } from "react-icons/gi";
import hatReward from '../assets/hat.jpg';
import tshirtReward from '../assets/tshirt.jpg';
import keyHolderReward from '../assets/keyholder.jpg';
import ImageZoom from "react-image-zooom";
import { addDays } from '@progress/kendo-date-math';
import axios from 'axios';
import { RiLogoutBoxLine } from "react-icons/ri";
import { GrLanguage } from "react-icons/gr";
import { VscThreeBars } from "react-icons/vsc";

const UserSettingsPageComponent = () => {

  const [qrCode, setQrCode] = useState('');

  const [faEventForm, setFaEventForm] = useState(false);

  const [isOpen, setIsopen] = useState(false);

  const [dashboard, setDashBoard] = useState(false);

  const [createdEventsDashboard, setCreatedEventsDashBoard] = useState(false);

  const [authenticationForm, setAuthenticationForm] = useState(false);

  const [addResourcesLinkForm, setaddResourcesLinkForm] = useState(false);

  const [userEventsFiltered, setUserEventsFiltered] = useState(false);

  const [rewardsMenu, setRewardsMenu] = useState(false);

  const [activeIndex, setActiveIndex] = useState(0);

  const [chosenEvent, setChosenEvent] = useState([]);

  const [newUserEvents, setNewUserEvents] = useState([]);

  const [organizerEvents, setOrganizerEvents] = useState([]);

  const [lectureRating, setLectureRating] = useState(0);
  const [lectorRating, setLectorRating] = useState(0);

  const [deleteEventEnabled, setDeleteEventEnabled] = useState(false);

  const [userPreferenceForm, setUserPreferenceForm] = useState(false);
  const [languagePreferenceForm, setLanguagePreferenceForm] = useState(false);
  const [disableEventAlert, setDisableEventAlert] = useState(false);
  const [resourceLinkAlert, setResourceLinkAlert] = useState(false);

  const [disableEvent, setDisableEvent] = useState(false);
  const [disableEventForm, setDisableEventForm] = useState(false);
  const [disableEventReason, setDisableEventReason] = useState('');
  const [disableEventDescription, setDisableEventDescription] = useState('');

  const [qrCodeQuestions, setQrCodeQuestions] = useState('');

  const [feedbackForm, setFeedbackForm] = useState(false);

  const [filteredEvents, setFilteredEvents] = useState([]);

  const [linkResources, setLinkResources] = useState(Array(0).fill(''));
  const [username, setUsername] = useState('');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);

  const [finishedEvents, setFinishedEvents] = useState([]);
  const [finishedEventsForm, setFinishedEventsForm] = useState(false);
  const [chosenFinishedEvent, setChosenFinishedEvent] = useState([]);

  const keyholderPoints = 20;
  const tshirtPoints = 60;
  const hatPoints = 40;

  const [rewardPath, setRewardPath] = useState('');

  const [generateBiggerImageCheck, setGenerateBiggerImageCheck] = useState(false);

  const [currentUser, setCurrentUser] = useState([]);

  const [currentEvent, setCurrentEvent] = useState([]);

  const [resourceCounter, setResourceCounter] = useState(1);

  const [newLanguage, setNewLanguage] = useState('');

  const [digit1, setDigit1] = useState('');
  const [digit2, setDigit2] = useState('');
  const [digit3, setDigit3] = useState('');
  const [digit4, setDigit4] = useState('');
  const [digit5, setDigit5] = useState('');
  const [digit6, setDigit6] = useState('');

  const token = localStorage.getItem('token');

  const decodedToken = jwtDecode(token);

  const user = decodedToken.sub;

  const role = decodedToken.role;

  const [languageCurrentUser, setLanguageCurrentUser] = useState('');

  const navigator = useNavigate();

  useEffect(() => {
    getUserByUsername(user, token).then((response) => {
      console.log("response")
      console.log(response.data);
      setLanguageCurrentUser(response.data);
      setNewLanguage(response.data.languagePreferred);
      setCurrentUser(response.data);
    }).catch((error) => {
      console.log("error");
      console.log(error);
    })
  }, [])

  useEffect(() => {
    getEventsForUser(user, token)
      .then((response) => {
        const newEvents = [];
        const newFinishedEvents = [];
        response.data.map(event => {

          if (event.hasEnded == true) {
            let includesUser = false;
            event.feedbackForm.map(feedbackForm => {

              if (feedbackForm.username == user) {
                includesUser = true;
              }
            })
            if (includesUser == false) {
              newFinishedEvents.push(event);
            }
          } else {
            newEvents.push(event);
          }
        })
        setNewUserEvents(newEvents);
        setFinishedEvents(newFinishedEvents);
      }).catch(error => {
        console.error(error);
      })
  }, [])

  useEffect(() => {
    getEventsForOrganizer(user, token).then((response) => {
      console.log("response");
      console.log(response.data);
      setOrganizerEvents(response.data);
      setFilteredEvents(response.data);
    }).catch((error) => {
      console.log("error");
      console.log(error);
    })
  }, [])

  const ToggleSidebar = () => {
    return isOpen === true ? setIsopen(false) : setIsopen(true);
  }

  const closeSidebar = () => {
    return setIsopen(false);
  }

  const toggleDisableEvent = () => {
    toggleDeleteEvent()
    return setDisableEvent(!disableEvent);
  }

  const closeDisableEvent = () => {
    return setDisableEvent(false);
  }

  const toggleDisableEventAlert = (event) => {
    setChosenEvent(event);
    return setDisableEventAlert(true);
  }

  const closeDisableEventAlert = () => {
    return setDisableEventAlert(false);
  }

  const toggleResourceLinkAlert = (event) => {
    setChosenEvent(event);
    return setResourceLinkAlert(!resourceLinkAlert);
  }

  const closeResourceLinkAlert = () => {
    return setResourceLinkAlert(false);
  }

  const toggleDeleteEvent = () => {
    return setDeleteEventEnabled(!deleteEventEnabled);
  }

  const closeDeleteEvent = () => {
    return setDeleteEventEnabled(false);
  }

  const toggleDashboard = () => {
    return setDashBoard(!dashboard);
  }

  const closeDashboard = () => {
    return setDashBoard(false);
  }

  const toggleFeedbackForm = () => {
    return setFeedbackForm(!feedbackForm);
  }

  const closeFeedbackForm = () => {
    return setFeedbackForm(false);
  }

  const toggleRewardMenu = () => {
    return setRewardsMenu(!rewardsMenu);
  }

  const closeRewardMenu = () => {
    return setRewardsMenu(false);
  }

  const toggleGenerateBiggerImage = () => {
    return setGenerateBiggerImageCheck(!generateBiggerImageCheck);
  }

  const toggleFinishedEventsForm = () => {
    return setFinishedEventsForm(!finishedEventsForm);
  }

  const closeFinishedEventsForm = () => {
    return setFinishedEventsForm(false);
  }


  const toggleCreatedEventsDashboard = () => {
    return setCreatedEventsDashBoard(!createdEventsDashboard);
  }

  const closeCreatedEventsDashboard = () => {
    return setCreatedEventsDashBoard(false);
  }

  const toggleFaEventForm = () => {
    return setFaEventForm(!faEventForm);
  }

  const closeFaEventForm = () => {
    return setFaEventForm(false);
  }


  const toggleAuthenticationForm = () => {
    return setAuthenticationForm(!authenticationForm);
  }

  const closeAuthenticationForm = () => {
    return setAuthenticationForm(false);
  }

  const toggleAddResourcesForm = () => {
    return setaddResourcesLinkForm(!addResourcesLinkForm);
  }

  const closeAddResourcesLinkForm = () => {
    return setaddResourcesLinkForm(false);
  }

  const toggleUserPreferencesForm = () => {
    return setUserPreferenceForm(!userPreferenceForm);
  }

  const closeUserPreferencesForm = () => {
    return setUserPreferenceForm(false);
  }

  const toggleLanguagePreferencesForm = () => {
    return setLanguagePreferenceForm(!languagePreferenceForm);
  }

  const closeLanguagePreferencesForm = () => {
    return setLanguagePreferenceForm(false);
  }

  const logOut = () => {
    localStorage.clear();
    navigator('/login');
  }

  const callUserPreferenceForm = () => {
    return (<div>
      <button className='btn-user-home-setting-2 btn btn-outline-primary my-2 my-sm-0' onClick={() => {
        navigateToHome();
      }}>
        <FaHome size={30} /> {newLanguage == 'ENG' && "Home"}
        {newLanguage == 'BG' && "Начало"}
      </button>
      <button className='btn-user-logout-setting-2 btn btn-outline-info my-2 my-sm-0' onClick={() => {
        logOut();
      }}>
        <RiLogoutBoxLine size={30} />  {newLanguage == 'ENG' && "Log out"}
        {newLanguage == 'BG' && "Изход"}
      </button>
    </div>)
  }

  const updateLanguage = (language) => {
    setNewLanguage(language);
    const updateLanguageDTO = {
      "username": user,
      "languagePreferred": language
    }
    updateNewLanguage(updateLanguageDTO, token).then((response) => {
      console.log("response language")
      console.log(response.data);
    }).catch((error) => {
      console.log("error");
      console.log(error);
    })
  }

  const callLanguagePreferenceForm = () => {
    return (<div>
      <button className='btn-user-language-english btn btn-outline-primary my-2 my-sm-0' onClick={() => {
        localStorage.setItem('language', 'ENG');
        closeLanguagePreferencesForm();
        updateLanguage('ENG');
      }}>
        ENG
      </button>
      <button className='btn-user-language-bulgarian btn btn-outline-primary my-2 my-sm-0' onClick={() => {
        localStorage.setItem('language', 'BG');
        closeLanguagePreferencesForm();
        updateLanguage('BG');
      }}>
        BG
      </button>
    </div>)
  }

  const OpenUserSettings = () => {
    return (<>
      <div>
        <button className='btn btn-user-settings-user-page btn-success text-start font-weight-bold' onClick={() => {
          toggleUserPreferencesForm();
          closeLanguagePreferencesForm();
        }}>
          <img src={userIcon} width={60} height={60} alt='Responsive image' className='img-fluid mr-5' />
          <h4 className='header-user-icon'>{user}</h4>
        </button>
        <button className='btn btn-user-settings-user-role btn-dark'>
          {newLanguage == 'ENG' && 'Role: '}
          {newLanguage == 'BG' && 'Роля: '}
          {role}
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


      { newLanguage == 'ENG' && alert("Two Factor Authentication has been enabled! Next time you try to login it will be an option.") }
      { newLanguage == 'BG' && alert("Двуфакторното удостоверяване е включено. При следващото влизане ще бъде опция.") }
      toggleFaEventForm();
      const newRequest = {
        "username": user,
        "enabled": true
      }
      enableTwoFA(newRequest, token).then((response) => {
      }).catch((error) => {
        console.log(error.response.data);
      });
    }).catch((error) => {
      console.log(error.response.data);
    })
  }



  const callEventForm = () => {

    return (
      <>
        <div className='card-body custom-card-body text-center bg-secondary p-5 mt-5 text-light'>
          <button className="btn-close-fa-event-form btn btn-danger" onClick={(e) => closeFaEventForm(e)}>x</button>
          <h1 className='text-center mb-2 text-light font-weight-bold'>
            <BsShieldLockFill size={100} className='mr-3' />
            {newLanguage == 'ENG' && 'Setup Two-Factor Authentication'}
            {newLanguage == 'BG' && 'Двуфакторно удостоверяване'}
          </h1>
          <ul className='sd-body text-start mb-5'>
            <li className='sd-link text-start mb-2'>
              {newLanguage == 'ENG' && 'Step 1: Get the Microsoft Authenticator app from the App Store.'}
              {newLanguage == 'BG' && 'Стъпка 1: Инсталиране на приложението Microsoft Authenticator от App Store.'}
            </li>
            <li className='sd-link text-start mb-3 mt-2'>
              {newLanguage == 'ENG' && 'Step 2: In the app select'}
              {newLanguage == 'BG' && 'Стъпка 2: В приложението изберете'}
              <b>
                {newLanguage == 'ENG' && ' Set up account'}
                {newLanguage == 'BG' && ' Настройка на акаунт'}
              </b>.
            </li>
            <li className='sd-link text-start mb-3'>
              {newLanguage == 'ENG' && 'Step 3: Choose'}
              {newLanguage == 'BG' && 'Стъпка 3: Изберете'}
              <b>
                {newLanguage == 'ENG' && ' Scan qrcode'}
                {newLanguage == 'BG' && ' Сканиране на QR код'}
              </b>.
            </li>
            <li className='sd-link text-start mb-3'>
              {newLanguage == 'ENG' && 'Step 4: Scan the code below for the setup!'}
              {newLanguage == 'BG' && 'Стъпка 4: Сканирай кода отдолу за настройването!'}
            </li>
            <li>
              <img src={qrCode} width={190} height={190} alt='Responsive image' className='img-fluid qrImage' />
              <h5 className='text-end'>
                {newLanguage == 'ENG' && 'Enter the verification code from your Authenticator app! '}
                {newLanguage == 'BG' && 'Въведете кода от вашето Authenticator приложение!'}
              </h5>
              <div className="custom-form">
                <input className="mr-2" type="text" maxLength="1" size="1" min="0" max="9" pattern="[0-9]{1}" value={digit1} onChange={(e) => setDigit1(e.target.value)} />
                <input className="mr-2" type="text" maxLength="1" size="1" min="0" max="9" pattern="[0-9]{1}" value={digit2} onChange={(e) => setDigit2(e.target.value)} />
                <input className="mr-2" type="text" maxLength="1" size="1" min="0" max="9" pattern="[0-9]{1}" value={digit3} onChange={(e) => setDigit3(e.target.value)} />
                <input className="mr-2" type="text" maxLength="1" size="1" min="0" max="9" pattern="[0-9]{1}" value={digit4} onChange={(e) => setDigit4(e.target.value)} />
                <input className="mr-2" type="text" maxLength="1" size="1" min="0" max="9" pattern="[0-9]{1}" value={digit5} onChange={(e) => setDigit5(e.target.value)} />
                <input className="mr-2 mb-5" type="text" maxLength="1" size="1" min="0" max="9" pattern="[0-9]{1}" value={digit6} onChange={(e) => setDigit6(e.target.value)} />
                <br />
                <button class="btn mt-3 btn-primary btn-embossed" onClick={(e) => { verifySecret(e) }}>
                  {newLanguage == 'ENG' && 'Verify'}
                  {newLanguage == 'BG' && 'Верифицирай'}
                </button>
              </div>
            </li>
          </ul>

        </div>
      </>)
  }


  const enableTwoFactorAuthentication = () => {
    toggleAuthenticationForm();
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
    })

  }

  const disableTwoFactorAuthentication = () => {
    const request = {
      "username": user,
      "enabled": false
    }
    enableTwoFA(request, token).then((response) => {
      { newLanguage == 'ENG' && alert("Two Factor Authentication has been disabled successfully!") }
      { newLanguage == 'BG' && alert("Двуфакторното удостоверяване е изключено!") }
    }).catch((error) => {
      console.log(error.response.data);
    })
  }

  const enableOrDisableOneTimePass = () => {
    const request = {
      "username": user
    }
    enableOneTimePass(request, token).then((response) => {
      if (response.data.enabled == true) {
        { newLanguage == 'ENG' && alert("One Time pass code login has been enabled! Next time you try to login it will be an option.") }
        { newLanguage == 'BG' && alert("Удостоверяването с еднократно парола е включено. При следващото влизане ще бъде опция.") }
      } else {
        { newLanguage == 'ENG' && alert("One Time pass code login has been disabled!") }
        { newLanguage == 'BG' && alert("Удостоверяването с еднократно парола е изключено!") }
      }
    }).catch((error) => {
      console.log(error.response.data);
    })
  }

  const checkIfEventStillContinues = (event, endDate) => {

    const nowTime = new Date(Date.now());
    const newEndDate = new Date(endDate);

    if (Date.parse(nowTime) > Date.parse(newEndDate)) {
      const request = {
        "username": user,
        "eventName": event.name,
        "organizer": event.organizer
      }
      console.log(JSON.stringify(request))
      // deleteUserEvent(JSON.stringify(request), token).then((response) => {
      //   alert(`Event "${event.name}" has ended! Please give your feedback to help improve our quality service! Thank you!`);
      //   console.log("response");
      //   console.log(response.data);
      // }).catch((error) => {
      //   console.log("error");
      //   console.log(error);
      // })
    }
  }

  const showEvent = (event, idx) => {
    let newStartDate = event.duration.startDate.replace('T', ' ');
    let newEndDate = event.duration.endDate.replace('T', ' ');
    checkIfEventStillContinues(event, newEndDate);
    return <Carousel.Item key={idx} className='carousel-new-item-2'>
      <button className={`d-block custom-event-button-2 text-light ${event.enabled == true ? 'bg-success' : 'bg-secondary'} p-3 mt-5`} key={idx} >
        <MdEventAvailable size={30} />
        <h5>{newLanguage == 'ENG' && "Event"}
          {newLanguage == 'BG' && "Събитие"}: {event.name}</h5>
        <small>{newLanguage == 'ENG' && "Event Type"}
          {newLanguage == 'BG' && "Тип на събитие"}: {event.eventType}</small>
        <br />
        <small class="mb-1 mt-2">{newLanguage == 'ENG' && "Description"}
          {newLanguage == 'BG' && "Описание"}: {event.description}</small>
        <br />
        <small>{newLanguage == 'ENG' && "Start"}
          {newLanguage == 'BG' && "Начало"}: {newStartDate}</small>
        <br />
        <small>{newLanguage == 'ENG' && "Еnd"}
          {newLanguage == 'BG' && "Край"}: {newEndDate}</small>
        <br />
        <small>{newLanguage == 'ENG' && "Floor"}
          {newLanguage == 'BG' && "Етаж"}: {event.floorNumber}</small>
        <br />
        <small>{newLanguage == 'ENG' && "Room"}
          {newLanguage == 'BG' && "Стая"}: {event.roomNumber}</small>
        <br />
        <small>{newLanguage == 'ENG' && "Faculty"}
          {newLanguage == 'BG' && "Факултет"}: {event.facultyName}</small>
        <br />
        {event.linkToPage == null ? <small>{newLanguage == 'ENG' && "Organizer"}
          {newLanguage == 'BG' && "Организатор"}: {event.organizer}</small> :
          <small>{newLanguage == 'ENG' && "Organizer"}
            {newLanguage == 'BG' && "Организатор"}: <a href='#' onClick={(e) => {
              toggleResourceLinkAlert(event);
              closeDisableEventAlert();
              e.stopPropagation();
              setActiveIndex(idx);
            }} > {event.organizer}</a></small>}
        <br />
        {!event.enabled && (event.disableEventReason != '' &&
          <small>
            {newLanguage == 'ENG' && "Cancelled due to: "}
            {newLanguage == 'BG' && "Прекратено поради: "} <a href="#" onClick={(e) => {
              toggleDisableEventAlert(event);
              closeResourceLinkAlert();
              e.stopPropagation();
              setActiveIndex(idx);
            }}>{event.disableEventReason}</a></small>)}
      </button></Carousel.Item>;
  }

  const ShowAllEventsForUser = () => {
    return (
      <>
        <div className='p-4'>
          <div className='row carousel-buttons'>
            <div className='col'>
              <Button className='btn-today-events btn-primary p-3' onClick={(e) => {
                setUserEventsFiltered(true);
                filterEvents(e, 'Today', newUserEvents);
              }}>
                {newLanguage == 'ENG' && 'Today'}
                {newLanguage == 'BG' && 'Днес'}
              </Button>
            </div>
            <div className='col' >
              <Button className='btn-this-week-events btn-primary p-3 mr-5' onClick={(e) => {
                setUserEventsFiltered(true);
                filterEvents(e, 'This week', newUserEvents);
              }}>
                {newLanguage == 'ENG' && 'This week'}
                {newLanguage == 'BG' && 'Тази седмица'}
              </Button>
            </div>
            <div className='col'>
              <Button className='btn-this-month-events btn-primary p-3' onClick={(e) => {
                setUserEventsFiltered(true);
                filterEvents(e, 'This month', newUserEvents);
              }}>
                {newLanguage == 'ENG' && 'This month'}
                {newLanguage == 'BG' && 'Този месец'}
              </Button>
            </div>
            <div className='col'>
              <Button className='btn-all-events btn-primary ml-3 p-3' onClick={(e) => {
                setUserEventsFiltered(true);
                filterEvents(e, 'All', newUserEvents);
              }}>
                {newLanguage == 'ENG' && 'All events'}
                {newLanguage == 'BG' && 'Всички събития'}
              </Button>
            </div>
          </div>
          {userEventsFiltered == true ?
            <Carousel className='carousel-2 p-5 mt-5'>
              {filteredEvents.map((event, idx) => {
                return showEvent(event, idx);
              })}</Carousel>
            : <Carousel className='carousel-2 p-5 mt-5'>
              {newUserEvents.map((event, idx) => {
                return showEvent(event, idx);
              })}

            </Carousel>
          }
        </div>
      </>
    )
  }

  const showEventIfEnabled = (e, event) => {
    e.preventDefault();
    setChosenEvent(event);
    toggleDisableEvent();
  }

  const showAlertWhenClickedDisabledReason = () => {
    return (<div class="disable-event-alert alert alert-primary" role="alert">
      <button className="btn-close-disable-event-alert btn btn-danger" onClick={(e) => closeDisableEventAlert(e)}>x</button>
      {newLanguage == 'ENG' && "Disable event description"}
      {newLanguage == 'BG' && "Описание"}: "{chosenEvent.disableEventDescription}"
    </div>)
  }

  const showAlertWhenClickedResourcesLink = () => {
    return (<div class="resource-link-alert alert alert-success" role="alert">
      <button className="btn-close-resources-link-alert btn btn-danger" onClick={(e) => closeResourceLinkAlert(e)}>x</button>
      Links:
      <br />
      {chosenEvent.linkToPage.map((link, idx) => {
        return <div><a key={idx} href={link} title={link}>Link {idx + 1}</a><br /></div>
      })}
    </div>)
  }

  const showCreatedEvent = (event, idx) => {
    let newStartDate = event.duration.startDate.replace('T', ' ');
    let newEndDate = event.duration.endDate.replace('T', ' ');
    checkIfEventStillContinues(event, newEndDate);


    console.log(event);
    return <Carousel.Item key={idx} className='carousel-new-item-2' onMouseEnter={setCurrentEvent(event)}>
      <div>
        <button className={`d-block custom-event-button-2 text-light ${event.enabled == true ? 'bg-success' : 'bg-secondary'} p-3 mt-5`} key={idx} onClick={(e) => {
          setActiveIndex(idx);
          event.enabled == true && showEventIfEnabled(e, event);
        }
        }>
          <MdEventAvailable size={30} />
          <h5>{newLanguage == 'ENG' && "Event"}
            {newLanguage == 'BG' && "Събитие"}: {event.name}</h5>
          <small>{newLanguage == 'ENG' && "Event Type"}
            {newLanguage == 'BG' && "Тип на събитие"}: {event.eventType}</small>
          <br />
          <small class="mb-1 mt-2">{newLanguage == 'ENG' && "Description"}
            {newLanguage == 'BG' && "Описание"}: {event.description}</small>
          <br />
          <small>{newLanguage == 'ENG' && "Start"}
            {newLanguage == 'BG' && "Начало"}: {newStartDate}</small>
          <br />
          <small>{newLanguage == 'ENG' && "Еnd"}
            {newLanguage == 'BG' && "Край"}: {newEndDate}</small>
          <br />
          <small>{newLanguage == 'ENG' && "Floor"}
            {newLanguage == 'BG' && "Етаж"}: {event.floorNumber}</small>
          <br />
          <small>{newLanguage == 'ENG' && "Room"}
            {newLanguage == 'BG' && "Стая"}: {event.roomNumber}</small>
          <br />
          <small>{newLanguage == 'ENG' && "Faculty"}
            {newLanguage == 'BG' && "Факултет"}: {event.facultyName}</small>
          <br />
          {console.log(event)}
          {event.linkToPage == null ? <small>{newLanguage == 'ENG' && "Organizer"}
            {newLanguage == 'BG' && "Организатор"}: {event.organizer}</small> :
            <small>{newLanguage == 'ENG' && "Organizer"}
              {newLanguage == 'BG' && "Организатор"}: <a href='#' onClick={(e) => {
                toggleResourceLinkAlert(event);
                closeDisableEventAlert();
                e.stopPropagation();
              }} > {event.organizer}</a></small>}
          <br />
          {!event.enabled && (event.disableEventReason != '' &&
            <small>
              {newLanguage == 'ENG' && "Cancelled due to: "}
              {newLanguage == 'BG' && "Прекратено поради: "} <a href="#" onClick={(e) => {
                toggleDisableEventAlert(event);
                closeResourceLinkAlert();
                e.stopPropagation();
              }}>{event.disableEventReason}</a></small>)}

        </button>
      </div></Carousel.Item>;
  }

  const filterEvents = (e, dateOption, newEvents) => {
    e.preventDefault();

    const nowTime = new Date(Date.now());

    console.log("organizerEvents before filter");
    console.log(newEvents);
    console.log("now time");
    console.log(nowTime);

    let newFilteredEvents = [];

    if (dateOption == 'Today') {
      newFilteredEvents = newEvents.filter((event) => (new Date(Date.parse(event.duration.startDate)).getUTCDate() == nowTime.getUTCDate()) && (new Date(Date.parse(event.duration.endDate)).getUTCDate() == nowTime.getUTCDate()))
    } else if (dateOption == 'This week') {
      let newNowTime = addDays(nowTime, 1 - (nowTime.getUTCDay()));

      newFilteredEvents = newEvents.filter((event) => (new Date(Date.parse(event.duration.startDate)).getUTCDate() >= newNowTime.getUTCDate()) && (new Date(Date.parse(event.duration.endDate)).getUTCDate() <= newNowTime.getUTCDate() + 7))
    } else if (dateOption == 'This month') {

      newFilteredEvents = newEvents.filter((event) => (new Date(Date.parse(event.duration.startDate)).getUTCMonth() == nowTime.getUTCMonth()) && (new Date(Date.parse(event.duration.endDate)).getUTCMonth() == nowTime.getUTCMonth()))
    } else if (dateOption == 'All') {
      newFilteredEvents = newEvents;
    }
    setFilteredEvents(newFilteredEvents);
  }

  const ShowAllCreatedEventsForUser = () => {
    return (
      <>
        <div className='p-4'>
          <div className='row carousel-buttons'>
            <div className='col'>
              <Button className='btn-today-events btn-primary p-3' onClick={(e) => {
                filterEvents(e, 'Today', organizerEvents);
              }}>
                {newLanguage == 'ENG' && 'Today'}
                {newLanguage == 'BG' && 'Днес'}

              </Button>
            </div>
            <div className='col' >
              <Button className='btn-this-week-events btn-primary p-3 mr-5' onClick={(e) => {
                filterEvents(e, 'This week', organizerEvents);
              }}>
                {newLanguage == 'ENG' && 'This week'}
                {newLanguage == 'BG' && 'Тази седмица'}
              </Button>
            </div>
            <div className='col'>
              <Button className='btn-this-month-events btn-primary p-3' onClick={(e) => {
                filterEvents(e, 'This month', organizerEvents);
              }}>
                {newLanguage == 'ENG' && 'This month'}
                {newLanguage == 'BG' && 'Този месец'}
              </Button>
            </div>
            <div className='col'>
              <Button className='btn-all-events btn-primary ml-3 p-3' onClick={(e) => {
                filterEvents(e, 'All', organizerEvents);
              }}>
                {newLanguage == 'ENG' && 'All events'}
                {newLanguage == 'BG' && 'Всички събития'}
              </Button>
            </div>
          </div>

          <Carousel className='carousel-2 p-5 mt-5' defaultActiveIndex={activeIndex} >
            {filteredEvents.map((event, idx) => {
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
        closeFaEventForm();
        closeFeedbackForm();
        closeFinishedEventsForm();
        closeAddResourcesLinkForm();
        closeDisableEvent();
        closeDeleteEvent();
        closeRewardMenu();
        closeDisableEventAlert();
        closeResourceLinkAlert();
        closeSidebar();
        toggleAuthenticationForm();
        closeAuthenticationForm();
        ToggleSidebar();
      }} >
        {newLanguage == 'ENG' && 'Disable this event?'}
        {newLanguage == 'BG' && 'Прекрати това събитие?'}
      </button>
    )
  }

  const disableNewEvent = (e, disableReason) => {
    e.preventDefault();
    chosenEvent.enabled = false;
    const disableEventDTO = {
      "disableReason": disableReason,
      "disableEventDescription": disableEventDescription,
      "user": user,
      "name": chosenEvent.name
    }
    console.log(JSON.stringify(disableEventDTO));
    disableUserEvent(JSON.stringify(disableEventDTO), token).then((response) => {
      console.log("response");
      console.log(response);
      { newLanguage == 'ENG' && alert("You have successfully disabled this event!") }
      { newLanguage == 'BG' && alert("Успешно прекратихте това събитие!") }
      closeSidebar();
      setDisableEvent(false);
      setDisableEventForm(false);
    }).catch((error) => {
      console.log("error");
      console.log(error);
    })
  }

  const deleteEventFromList = (eventName) => {
    const newFilteredEvents = filteredEvents.filter((event) => event.name != eventName);
    setFilteredEvents(newFilteredEvents);
  }

  const deleteChosenEvent = (e) => {
    e.preventDefault();
    deleteEventFromList(chosenEvent.name);
    const deleteEventDTO = {
      "name": chosenEvent.name
    }
    deleteEvent(JSON.stringify(deleteEventDTO), token).then((response) => {
      { newLanguage == 'ENG' && alert("You have successfully delete this event!") }
      { newLanguage == 'BG' && alert("Успешно изтрихте това събитие!") }
      setActiveIndex(activeIndex - 1);
      setDisableEvent(false);
      setDeleteEventEnabled(false);
    }).catch((error) => {
      console.log("error");
      console.log(error);
    })
  }

  const callDeleteEventButton = () => {
    return (
      <button className='btn-delete-event btn btn-outline-danger my-2 my-sm-0' onClick={(e) => {
        deleteChosenEvent(e);
      }} >
        <MdAutoDelete size={30} />
        {newLanguage == 'ENG' && 'Delete this event?'}
        {newLanguage == 'BG' && 'Изтрий това събитие?'}
      </button>
    )
  }


  const navigateToHome = () => {
    navigator('/welcome')
  }

  const callAuthenticationForm = () => {
    return (

      <div className=' bg-success card-body-div-authentication-types '>
        <button className="btn-close-authentication-types-event-form btn btn-danger" onClick={(e) => closeAuthenticationForm(e)}>x</button>
        <ul>
          <h1 className='text-light authentication-types-header text-center font-weight-bold'>
            <BsShieldLockFill size={90} className='mr-3 mb-2' />
            {newLanguage == 'ENG' && 'Authentication types'}
            {newLanguage == 'BG' && 'Типове удостоверяване'}
          </h1>
          <li>
            <button className='btn btn-secondary btn-item-enable-two-factor text-light' onClick={() => { enableTwoFactorAuthentication() }}>
              {newLanguage == 'ENG' && 'Enable Two-Factor Authentication'}
              {newLanguage == 'BG' && 'Включи Двуфакторно удостоверяване'}
            </button>
          </li>
          <li>
            <button className='btn  btn-secondary btn-item-disable-two-factor text-light' onClick={() => { disableTwoFactorAuthentication() }}>
              {newLanguage == 'ENG' && 'Disable Two-Factor Authentication'}
              {newLanguage == 'BG' && 'Изключи Двуфакторно удостоверяване'}
            </button>
          </li>
          <li>
            <button className='btn  btn-secondary btn-item-one-time-pass-auth text-light' onClick={() => { enableOrDisableOneTimePass() }}>
              {newLanguage == 'ENG' && 'One Time Pass Authentication'}
              {newLanguage == 'BG' && 'Удостоверяване с еднократна парола'}
            </button>
          </li>
        </ul>
      </div>
    )
  }

  const SidebarLeftComponent = () => {
    return (
      <>
        <div className="container-fluid">
          <div className="sidebar-left">
            <div className="sd-header">
              <img src={logo} width={135} height={135} alt='Responsive image' className='img-fluid logoImage-3' />
            </div>
            <ul className='text-center m-2'>
              <li>
                <button className='btn btn-item-authentication-types btn-secondary text-light' onClick={() => {
                  closeDashboard();
                  closeCreatedEventsDashboard();
                  closeLanguagePreferencesForm();
                  closeFaEventForm();
                  closeUserPreferencesForm();
                  closeFeedbackForm();
                  closeFinishedEventsForm();
                  closeAddResourcesLinkForm();
                  closeDisableEventAlert();
                  closeRewardMenu();
                  closeResourceLinkAlert();
                  closeDisableEvent();
                  closeDeleteEvent();
                  closeSidebar()
                  toggleAuthenticationForm()
                }}>
                  {newLanguage == 'ENG' && 'Authentication'}
                  {newLanguage == 'BG' && 'Удостоверяване'}
                </button>
              </li>
              <li>
                <button className='btn btn-item-dashboard btn-success text-light' onClick={() => {
                  closeCreatedEventsDashboard();
                  closeAuthenticationForm();
                  closeFaEventForm();
                  closeLanguagePreferencesForm();
                  closeUserPreferencesForm();
                  closeFeedbackForm();
                  closeDisableEvent();
                  closeDeleteEvent();
                  closeFinishedEventsForm();
                  closeAddResourcesLinkForm();
                  closeDisableEventAlert();
                  closeRewardMenu();
                  closeResourceLinkAlert();
                  closeSidebar()
                  toggleDashboard()
                }}>
                  {newLanguage == 'ENG' && 'Dashboard'}
                  {newLanguage == 'BG' && 'Запазени събития'}
                </button>
              </li>
              {(role == 'ADMIN' || role == 'LECTOR') && <li>
                <button className='btn btn-item-your-created-events btn-success text-light' onClick={() => {
                  closeDashboard();
                  closeAuthenticationForm();
                  closeAddResourcesLinkForm();
                  closeFaEventForm();
                  closeDisableEvent();
                  closeLanguagePreferencesForm();
                  closeUserPreferencesForm();
                  closeDeleteEvent();
                  closeFeedbackForm();
                  closeFinishedEventsForm();
                  closeDisableEventAlert();
                  closeRewardMenu();
                  closeResourceLinkAlert();
                  closeSidebar()
                  toggleCreatedEventsDashboard()
                }}>
                  {newLanguage == 'ENG' && 'Your created events'}
                  {newLanguage == 'BG' && 'Твоите създадени събития'}
                </button>
              </li>}
              {(role == 'ADMIN' || role == 'LECTOR') && <li><button className='btn btn-item-add-link btn-success text-light' onClick={() => {
                closeDashboard();
                closeCreatedEventsDashboard();
                closeAuthenticationForm();
                closeFaEventForm();
                closeDisableEventAlert();
                closeLanguagePreferencesForm();
                closeUserPreferencesForm();
                closeRewardMenu();
                closeResourceLinkAlert();
                closeDisableEvent();
                closeDeleteEvent();
                closeFinishedEventsForm();
                closeFeedbackForm();
                closeSidebar()
                toggleAddResourcesForm();
              }}>
                {newLanguage == 'ENG' && 'Add link to your resources'}
                {newLanguage == 'BG' && 'Добави линк към ресурси'}
              </button></li>}
              {finishedEvents.length > 0 && <li>
                <button className='btn btn-feedback-form btn-primary text-light' onClick={() => {
                  closeCreatedEventsDashboard();
                  closeAuthenticationForm();
                  closeFaEventForm();
                  closeAddResourcesLinkForm();
                  closeDashboard();
                  closeLanguagePreferencesForm();
                  closeUserPreferencesForm();
                  closeDisableEventAlert();
                  closeRewardMenu();
                  closeResourceLinkAlert();
                  closeDisableEvent();
                  closeDeleteEvent();
                  closeFeedbackForm();
                  closeSidebar()
                  toggleFinishedEventsForm();
                }}>
                  {newLanguage == 'ENG' && 'Feedback'}
                  {newLanguage == 'BG' && 'Обратна връзка'}
                </button>
              </li>}
              {rewardsMenu == false && <li>
                <button className='btn btn-item-rewards btn-info text-light' onClick={() => {
                  closeCreatedEventsDashboard();
                  closeAuthenticationForm();
                  closeFaEventForm();
                  closeLanguagePreferencesForm();
                  closeUserPreferencesForm();
                  closeAddResourcesLinkForm();
                  closeDashboard();
                  closeSidebar()
                  closeDisableEvent();
                  closeDeleteEvent();
                  closeFeedbackForm();
                  closeFinishedEventsForm();
                  toggleRewardMenu();
                }}>
                  {newLanguage == 'ENG' && 'Rewards'}
                  {newLanguage == 'BG' && 'Награди'}
                </button>
              </li>}
              <li>
                <button className='btn btn-item-language-settings btn-primary text-light' onClick={() => {
                  toggleLanguagePreferencesForm()
                  closeUserPreferencesForm();
                }}>
                  <GrLanguage size={35} className='mr-2 mb-1' />
                  {newLanguage == 'ENG' && 'Language'}
                  {newLanguage == 'BG' && 'Език'}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </>
    )
  }

  const callDisableEventDescriptionForm = () => {
    return (<div class="form-floating text-start mb-3 mt-4 bg-light">
      <textarea class="form-control text-start h-100" id="floatingInput11" placeholder="Enter additional feedback" value={disableEventDescription} rows="5" onChange={(e) => setDisableEventDescription(e.target.value)} />
      <label className="floatingInput11 text-secondary">
        {newLanguage == 'ENG' && 'Additional description'}
        {newLanguage == 'BG' && 'Допълнително описание'}
      </label>
    </div>)
  }

  const sidebarRightComponent = () => {
    return (
      <>
        <div className="container-fluid">
          <div className={`sidebar-settings-right ${isOpen == true ? 'active' : ''}`}>
            <div className="sd-body text-center">
              <button className='disable-event-sidebar-logo btn btn-dark' onClick={() => {
                closeSidebar();
              }}>
                <VscThreeBars size={20} className=' text-light' />
              </button>
              <ul>
                <li>
                  <Button className='button-event-name-disable-event mt-2 mb-4'>
                    <MdEventAvailable size={30} />
                    <h5 className='mt-3 text-light'>
                      {newLanguage == 'ENG' && 'Event chosen: '}
                      {newLanguage == 'BG' && 'Избрано събитие: '}
                      {`${chosenEvent.name}`}</h5>
                  </Button>
                </li>
                <li>
                  <Button className='mt-2 mb-4'>
                    <HiLightBulb size={60} />
                    <form className='mt-2'>
                      <div className='form-group text-start mb-2'>
                        <h5 className='form-label text-light text-center'>
                          {newLanguage == 'ENG' && 'Reason for disabling event'}
                          {newLanguage == 'BG' && 'Причина за прекратяване на събитие'}
                        </h5>
                        <select type='text' placeholder='Enter Reason' name='disableEventReason' value={disableEventReason} className='form-control text-center'
                          onChange={(e) => { setDisableEventReason(e.target.value) }}>
                          <option>
                            HEALTH_PROBLEMS
                          </option>
                          <option>
                            EMERGENCY
                          </option>
                          <option>
                            ABSENCE
                          </option>
                          <option>
                            OTHER
                          </option>
                        </select>
                      </div>
                      {disableEventReason == '' && setDisableEventReason('HEALTH_PROBLEMS')}
                      {disableEventReason == 'HEALTH PROBLEMS' && setDisableEventReason('HEALTH_PROBLEMS')}
                    </form>
                  </Button>
                </li>
                <li>
                  {callDisableEventDescriptionForm()}
                </li>
                <li>
                  <button className='btn btn-disable-events btn-outline-success my-2 my-sm-0  mt-2 sd-link-settings-button' onClick={(e) => disableNewEvent(e, disableEventReason.toUpperCase())}>
                    {newLanguage == 'ENG' && 'Disable event!'}
                    {newLanguage == 'BG' && 'Прекрати събитие'}
                  </button>
                </li>
              </ul>

            </div>
          </div>
          <div className={`sidebar-settings-right-overlay ${isOpen == true ? 'active' : ''}`} onClick={ToggleSidebar}></div>
        </div>
      </>
    )
  }

  const addResourceLinkForUser = () => {
    const newLinkResources = linkResources.filter(resource => resource != '')
    const request = {
      "username": user,
      "linkToPage": newLinkResources
    };
    console.log(JSON.stringify(request));

    addLinkToPage(request, token).then((response) => {
      alert("Successfully added link!");
      console.log("response");
      console.log(response);
      toggleAddResourcesForm();
      setLinkResources(Array(0).fill(''))
      setResourceCounter(1);
    }).catch((error) => {
      console.log("error");
      console.log(error);
    })
  }

  const inputChangedHandler = (e, index) => {
    const inputsUpdated = linkResources.map((input, i) => {
      console.log("input be")
      console.log(input)
      if (i == index) {
        return e.target.value;
      } else {
        return input;
      }
    });
    setLinkResources(inputsUpdated);
  }

  const callAddResourcesNewForm = () => {
    return (
      <div className='add-resources-link-div bg-success p-5'>
        <button className="btn-close-add-resources-link-form btn btn-danger" onClick={(e) => {
          closeAddResourcesLinkForm(e)
          setLinkResources(Array(0).fill(''))
          setResourceCounter(1);
        }}>x</button>
        <h1 className='form-label text-light text-center mb-5 mr-5'> <FaUserPen className='mr-3 mb-2 text-white' size={80} />
          {newLanguage == 'ENG' && 'Add Resources Links'}
          {newLanguage == 'BG' && 'Линкове към ресурс'}
        </h1>

        <button className='w-100 p-2 mb-3 btn btn-primary text-light' onClick={() => {
          setResourceCounter(resourceCounter + 1);
          setLinkResources(Array(resourceCounter).fill(''))
        }}>
          {newLanguage == 'ENG' && 'Add resource'}
          {newLanguage == 'BG' && 'Добави ресурс'}
        </button>

        <div className='form-group text-start mb-2'>
          {linkResources.map((input, c) => (
            <input type='text' placeholder={`${newLanguage == 'ENG' ? 'Enter Resource Link' : 'Въведи линк към ресурс'}`} name='linkResources' value={input} className='w-100 form-control text-center mb-4'
              onChange={(e) => {
                inputChangedHandler(e, c)
              }} />
          ))}

        </div>
        {resourceCounter > 1 && <button className='w-100 p-2 mt-1 btn btn-primary text-light' onClick={() => { addResourceLinkForUser() }}>
          {newLanguage == 'ENG' && 'Submit'}
          {newLanguage == 'BG' && 'Запиши'}
        </button>}
      </div>
    )
  }

  const callSetRatingType = (ratingType, rate) => {
    if (ratingType == "lector") {
      setLectorRating(rate);
    } else if (ratingType == "lecture") {
      setLectureRating(rate);
    }
  }

  const callInputForm = (ratingType, newRatingType) => {

    return (<div>
      <Button className={`btn-light ${newRatingType == 1 ? 'active' : ''}`} onClick={() => { callSetRatingType(ratingType, 1) }}><img src={oneStarEmoji} width={30} height={30} alt='Responsive image' /></Button>
      <Button className={`btn-light ${newRatingType == 2 ? 'active' : ''}`} onClick={() => { callSetRatingType(ratingType, 2) }}><img src={twoStarEmoji} width={30} height={30} alt='Responsive image' /></Button>
      <Button className={`btn-light ${newRatingType == 3 ? 'active' : ''}`} onClick={() => { callSetRatingType(ratingType, 3) }}><img src={threeStarEmoji} width={30} height={30} alt='Responsive image' /></Button>
      <Button className={`btn-light ${newRatingType == 4 ? 'active' : ''}`} onClick={() => { callSetRatingType(ratingType, 4) }}><img src={fourStarEmoji} width={30} height={30} alt='Responsive image' /></Button>
      <Button className={`btn-light ${newRatingType == 5 ? 'active' : ''}`} onClick={() => { callSetRatingType(ratingType, 5) }}><img src={fiveStarEmoji} width={30} height={30} alt='Responsive image' /></Button>
    </div>)
  }

  const submitFeedback = (e, newEvent) => {
    e.preventDefault();
    const feedbackDTO = {
      "name": username,
      "isAnonymous": isAnonymous,
      "lectureRating": lectureRating,
      "lectorRating": lectorRating,
      "description": description,
      "event": newEvent,
      "username": user
    }
    console.log("Feedback");
    console.log(JSON.stringify(feedbackDTO));
    addFeedbackForm(JSON.stringify(feedbackDTO), token).then((response) => {
      console.log("response");
      finishedEvents.length = finishedEvents.length - 1;
      console.log(response);
      alert("Thank you for your feedback!");
      setFeedbackForm(false);
    }).catch((error) => {
      console.log("error");
      console.log(error);
    });
  }

  const blobToDataURL = (blob, callback) => {
    var a = new FileReader();
    a.onload = function (e) { callback(e.target.result); }
    a.readAsDataURL(blob);
  }


  const callTurningToData = (qrCodeQuestions) => {
    axios({
      method: 'get',
      url: qrCodeQuestions,
      responseType: 'blob'
    }).then(function (response) {
      var reader = new FileReader();
      reader.readAsDataURL(response.data);
      blobToDataURL(response.data, function (dataurl) {
        console.log(dataurl);
        return setQrCodeQuestions(dataurl);
      });

    })
  }

  const callFeedbackForm = () => {
    return (
      <>
        <div className='card-body-feedback text-center text-black bg-light p-5'>
          <form>
            <button className="btn-close-feedback-form btn btn-danger" onClick={(e) => setFeedbackForm(false)}>x</button>

            <h1 className='text-center'><VscFeedback size={60} className='mr-4' />
              {newLanguage == 'ENG' && 'Feedback for event '}
              {newLanguage == 'BG' && 'Обратна връзка за събитие '}
              "{chosenFinishedEvent.name}"</h1>
            <p className='mb-2 text-secondary'>
              {newLanguage == 'ENG' && 'We hope you liked this event! Share your feedback with us! If you want to give additional feedback, you can scan the QR code below and add comments!'}
              {newLanguage == 'BG' && 'Надяваме се, че харесахте събитието! Споделете обратна връзка! Ако искате да дадете допълнителни коментари, може да сканирате QR кода по-долу!'}
            </p>
            {console.log("Finished events")}
            {console.log(finishedEvents)}
            <div>
              {console.log("Chosen finished event")}
              {console.log(chosenFinishedEvent)}
              {callTurningToData(chosenFinishedEvent.qrCodeQuestions)}
              {chosenFinishedEvent.qrCodeQuestions != '' &&
                <img src={qrCodeQuestions} className='qr-code-client-feedback-questions' />}
            </div>
            <h3 className='form-label text-dark font-weight-bold mb-2'>
              {newLanguage == 'ENG' && 'Lecture Rating'}
              {newLanguage == 'BG' && 'Оценка на лекция'}
            </h3>
            {callInputForm("lecture", lectureRating)}
            <h3 className='form-label text-dark font-weight-bold mb-2 mt-3'>
              {newLanguage == 'ENG' && 'Lector Rating'}
              {newLanguage == 'BG' && 'Оценка на лектор'}
            </h3>
            {callInputForm("lector", lectorRating)}
            <div class="form-floating text-start mb-3 mt-4">
              <textarea class="form-control text-start" id="floatingInput2" placeholder="Enter additional feedback" value={description} rows="3" onChange={(e) => setDescription(e.target.value)} />
              <label className="floatingInput2 text-secondary">
                {newLanguage == 'ENG' && 'Share your thoughts'}
                {newLanguage == 'BG' && 'Сподели мнение'}
              </label>
            </div>
            <div class="form-floating text-start mb-3 mt-4">
              <input type="text" class="form-control text-start" id="floatingInput" placeholder="Enter Name" value={username}
                onChange={(e) => {
                  setIsAnonymous(false)
                  setUsername(e.target.value)
                }} />
              <label className="floatingInput text-secondary">
                {newLanguage == 'ENG' && 'Enter Name (optional)'}
                {newLanguage == 'BG' && 'Въведи име (опционално)'}
              </label>
            </div>
            {console.log(chosenEvent)};
            <button className='btn-add-feedback btn text-center btn-primary mt-4 w-50' onClick={(event) => submitFeedback(event, chosenFinishedEvent.name)}>
              {newLanguage == 'ENG' && 'Submit!'}
              {newLanguage == 'BG' && 'Запиши!'}
            </button>
          </form>
        </div>
      </>
    )
  }

  const callFinishedEventsForm = () => {
    return (
      <div className='finished-events-div bg-light p-4'>
        <button className="btn-close-finished-events-form btn btn-danger" onClick={() => closeFinishedEventsForm()}>x</button>
        <h1 className='text-center text-dark mt-2'>
          {newLanguage == 'ENG' && 'Finished events'}
          {newLanguage == 'BG' && 'Приключили събития'}
        </h1>
        <p className='mb-3 text-secondary text-center mt-3'>

          {newLanguage == 'ENG' && 'These events already ended. Choose event to give your feedback!'}
          {newLanguage == 'BG' && 'Тези събития вече приключиха. Избери събитие за обратна връзка!'}
        </p>
        <ul>

          {finishedEvents.length > 0 && finishedEvents.map((finishedEvent, idx) => {
            return <li><button className='btn btn-primary btn-finished-event text-light mb-3' key={idx} onClick={() => {
              setChosenFinishedEvent(finishedEvent);
              toggleFeedbackForm();
              setFinishedEventsForm(false);
            }}>
              {newLanguage == 'ENG' && 'Event '}
              {newLanguage == 'BG' && 'Събитие '}
              "{finishedEvent.name}" (
              {newLanguage == 'ENG' && 'Floor '}
              {newLanguage == 'BG' && 'Eтаж '}
              {finishedEvent.floorNumber},
              {newLanguage == 'ENG' && ' Room '}
              {newLanguage == 'BG' && ' Стая '}
              {finishedEvent.roomNumber},
              {newLanguage == 'ENG' && ' Started'}
              {newLanguage == 'BG' && ' Начало'}
              : {finishedEvent.duration.startDate.replace('T', ' ')},
              {newLanguage == 'ENG' && ' Ended'}
              {newLanguage == 'BG' && ' Край'}
              : {finishedEvent.duration.endDate.replace('T', ' ')})
            </button></li>
          })}
        </ul>
      </div>)
  }

  const generateBiggerImage = (imgPath) => {
    return (
      <div className='generate-image-container'>
        <button className="btn-close-generate-image btn btn-danger" onClick={() => setGenerateBiggerImageCheck(false)}>x</button>
        <Button className='p-5 bg-light'>
          <ImageZoom
            src={imgPath}
            alt="Zoom-images"
            zoom="250"
          />
        </Button>
      </div>
    )
  }

  const getUserPrize = () => {
    return (
      <div>

      </div>)
  }

  const callRewardsMenu = () => {
    return (<div className='reward-menu-div bg-light p-4'>
      <button className="btn-close-rewards-menu btn btn-danger" onClick={() => setRewardsMenu(false)}>x</button>
      <h1 className='text-center text-dark mt-2'><GiPresent size={80} className='mb-4 ml-3' />
        {newLanguage == 'ENG' && 'Win Prizes'}
        {newLanguage == 'BG' && 'Спечелете награди'}
      </h1>
      <p className='mb-3 text-secondary text-center mt-3'>
        {newLanguage == 'ENG' && 'Collect points from using our app and get rewards!'}
        {newLanguage == 'BG' && 'Събирайте точки от използването на приложението и вземете награди!'}
        <br /><strong>
          {console.log("currentUser")}
          {console.log(currentUser)}
          {newLanguage == 'ENG' && 'Current points: '}
          {newLanguage == 'BG' && 'Настоящи точки: '}
          {currentUser.points}</strong></p>
      <ul>
        <li><button className='btn btn-light btn-reward-item-1 text-light' onClick={() => {
          setRewardPath(keyHolderReward);
          toggleGenerateBiggerImage();
        }
        }>
          <img src={keyHolderReward} width={200} height={200} alt='Responsive image' className='img-fluid text-center mb-4 mt-2' />
          <p className='mb-3 text-secondary text-center mb-3'>
            {newLanguage == 'ENG' && 'Key holder'}
            {newLanguage == 'BG' && 'Ключодържател'}
            <br /> <strong>
              {newLanguage == 'ENG' && 'points'}
              {newLanguage == 'BG' && 'точки'}: {keyholderPoints}</strong> </p>
        </button>
          <button className={`btn ${currentUser.points < keyholderPoints ? 'disabled' : ''}  btn-get-item-3 text-center btn-primary`} onClick={() => {
            getUserPrize();
          }}>
            {newLanguage == 'ENG' && 'Take prize!'}
            {newLanguage == 'BG' && 'Вземи награда!'}
          </button>
        </li>
        <li><button className={'btn  btn-light btn-reward-item-2 text-light'} onClick={() => {
          setRewardPath(hatReward);
          toggleGenerateBiggerImage();
        }
        } >
          <img src={hatReward} width={200} height={200} alt='Responsive image' className='img-fluid text-center mb-4 mt-2' />
          <p className='mb-3 text-secondary text-center  mb-3'>
            {newLanguage == 'ENG' && 'Hat'}
            {newLanguage == 'BG' && 'Шапка'}
            <br /> <strong>
              {newLanguage == 'ENG' && 'points'}
              {newLanguage == 'BG' && 'точки'}: {hatPoints}</strong> </p>
        </button>
          <button className={`btn ${currentUser.points < hatPoints ? 'disabled' : ''} btn-get-item-2 text-center btn-primary`} onClick={() => {
            getUserPrize();
          }}>
            {newLanguage == 'ENG' && 'Take prize!'}
            {newLanguage == 'BG' && 'Вземи награда!'}
          </button>
        </li>
        <div>
          <li>
            <button className='btn btn-light btn-reward-item-3 text-light' onClick={() => {
              setRewardPath(tshirtReward);
              toggleGenerateBiggerImage();
            }
            }>
              <img src={tshirtReward} width={200} height={200} alt='Responsive image' className='img-fluid text-center mb-4 mt-2' />
              <p className='mb-3 text-secondary text-center mb-3'>
                {newLanguage == 'ENG' && 'T-shirt'}
                {newLanguage == 'BG' && 'Тениска'}
                <br /> <strong>
                  {newLanguage == 'ENG' && 'points'}
                  {newLanguage == 'BG' && 'точки'}
                  : {tshirtPoints}</strong></p>
            </button>
            <button className={`btn ${currentUser.points < tshirtPoints ? 'disabled' : ''} btn-get-item text-center btn-primary`} onClick={() => {
              getUserPrize();
            }}>
              {newLanguage == 'ENG' && 'Take prize!'}
              {newLanguage == 'BG' && 'Вземи награда!'}
            </button>
          </li>
        </div>
      </ul>
    </div>)
  }

  return (
    <>
      <SidebarLeftComponent />
      {sidebarRightComponent()}
      {dashboard && <ShowAllEventsForUser />}
      {createdEventsDashboard && <ShowAllCreatedEventsForUser />}
      {faEventForm && callEventForm()}
      {authenticationForm && callAuthenticationForm()}
      {disableEvent && callDisableEventButton()}
      {deleteEventEnabled && callDeleteEventButton()}
      {addResourcesLinkForm && callAddResourcesNewForm()}
      {finishedEventsForm && callFinishedEventsForm()}
      {feedbackForm && callFeedbackForm()}
      {rewardsMenu && callRewardsMenu()}
      {generateBiggerImageCheck && generateBiggerImage(rewardPath)}
      <OpenUserSettings />
      {userPreferenceForm && callUserPreferenceForm()}
      {languagePreferenceForm && callLanguagePreferenceForm()}
      {disableEventAlert && showAlertWhenClickedDisabledReason()}
      {resourceLinkAlert && showAlertWhenClickedResourcesLink()}
    </>
  )
}

export default UserSettingsPageComponent