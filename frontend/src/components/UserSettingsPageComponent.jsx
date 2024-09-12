import React, { useEffect, useState } from 'react'
import logo from '../assets/fmi-deskspot-high-resolution-logo-white-transparent.png';
import './UserSettingsPageComponent.css'
import userIcon from '../assets/user-icon.png';
import oneStarEmoji from '../assets/1-star-emoji.png';
import twoStarEmoji from '../assets/2-star-emoji.png';
import threeStarEmoji from '../assets/3-star-emoji.png';
import fourStarEmoji from '../assets/4-star-emoji.png';
import fiveStarEmoji from '../assets/5-star-emoji.png';
import { generateTwoFA, verifyTwoFA, enableTwoFA, enableOneTimePass, addLinkToPage, getUserByUsername } from '../services/UserService';
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
import { GrDocumentText } from "react-icons/gr";
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

  const [disableEvent, setDisableEvent] = useState(false);
  const [disableEventForm, setDisableEventForm] = useState(false);
  const [disableEventReason, setDisableEventReason] = useState('');

  const [qrCodeQuestions, setQrCodeQuestions] = useState('');

  const [feedbackForm, setFeedbackForm] = useState(false);

  const [filteredEvents, setFilteredEvents] = useState([]);

  const [linkResources, setLinkResources] = useState('')

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

  const navigator = useNavigate();

  useEffect(() => {
    getUserByUsername(user, token).then((response) => {
      console.log("response")
      console.log(response.data);
      setCurrentUser(response.data);
    }).catch((error) => {
      console.log("error");
      console.log(error);
    })
  }, []);

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
        });
        setNewUserEvents(newEvents);
        setFinishedEvents(newFinishedEvents);
      }).catch(error => {
        console.error(error);
      })
  }, []);

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
  }, []);

  const ToggleSidebar = () => {
    return isOpen === true ? setIsopen(false) : setIsopen(true);
  }

  const toggleDisableEvent = () => {
    toggleDeleteEvent()
    return setDisableEvent(!disableEvent);
  }


  const toggleDeleteEvent = () => {
    return setDeleteEventEnabled(!deleteEventEnabled);
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

  const logOut = () => {
    localStorage.clear();
    navigator('/login');
  }

  const callUserPreferenceForm = () => {
    return (<div>
      <button className='btn-user-logout-setting-2 btn btn-outline-info my-2 my-sm-0' onClick={() => {
        logOut();
      }}>
        <RiLogoutBoxLine size={30} /> Log out
      </button>
    </div>)
  }

  const OpenUserSettings = () => {
    return (<>
      <div className='container'>
        <button className='btn btn-user-settings-2 btn-success text-start font-weight-bold' onClick={() => {
          toggleUserPreferencesForm();
        }}>
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
        "username": user,
        "enabled": true
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
          <button className="btn-close-fa-event-form btn btn-danger" onClick={(e) => closeFaEventForm(e)}>x</button>
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
        {event.linkToPage == null ? <small>Organizer: {event.organizer}</small> :
          <small>Organizer: <a href={`${event.linkToPage}`} onClick={(e) => e.stopPropagation()} > {event.organizer}</a></small>}
        <br />
        {!event.enabled && <small>
          Cancelled due to {event.disableEventReason}</small>}

      </button></Carousel.Item>;
  }

  const ShowAllEventsForUser = () => {
    return (
      <>
        <div className='p-4 mt-5'>
          <div className='row carousel-buttons'>
            <div className='col'>
              <Button className='btn-today-events btn-primary p-3' onClick={(e) => {
                setUserEventsFiltered(true);
                filterEvents(e, 'Today', newUserEvents);
              }}>Today</Button>
            </div>
            <div className='col' >
              <Button className='btn-this-week-events btn-primary p-3 mr-5' onClick={(e) => {
                setUserEventsFiltered(true);
                filterEvents(e, 'This week', newUserEvents);
              }}>This week</Button>
            </div>
            <div className='col'>
              <Button className='btn-this-month-events btn-primary p-3' onClick={(e) => {
                setUserEventsFiltered(true);
                filterEvents(e, 'This month', newUserEvents);
              }}>This month</Button>
            </div>
            <div className='col'>
              <Button className='btn-all-events btn-primary p-3' onClick={(e) => {
                setUserEventsFiltered(true);
                filterEvents(e, 'All', newUserEvents);
              }}>All events</Button>
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


  const showCreatedEvent = (event, idx) => {
    let newStartDate = event.duration.startDate.replace('T', ' ');
    let newEndDate = event.duration.endDate.replace('T', ' ');
    checkIfEventStillContinues(event, newEndDate);
    console.log(event);
    return <Carousel.Item key={idx} className='carousel-new-item-2'>
      <div>
        <button className={`d-block custom-event-button-2 text-light ${event.enabled == true ? 'bg-success' : 'bg-secondary'} p-3 mt-5`} key={idx} onClick={(e) => {
          setActiveIndex(idx);
          event.enabled == true && showEventIfEnabled(e, event);
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
          {event.linkToPage == null ? <small>Organizer: {event.organizer}</small> :
            <small>Organizer: <a href={`${event.linkToPage}`} onClick={(e) => e.stopPropagation()} > {event.organizer}</a></small>}
          <br />
          {!event.enabled && <small>
            Cancelled due to {event.disableEventReason}</small>}
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
        <div className='p-4 mt-5'>
          <div className='row carousel-buttons'>
            <div className='col'>
              <Button className='btn-today-events btn-primary p-3' onClick={(e) => {
                filterEvents(e, 'Today', organizerEvents);
              }}>Today</Button>
            </div>
            <div className='col' >
              <Button className='btn-this-week-events btn-primary p-3 mr-5' onClick={(e) => {
                filterEvents(e, 'This week', organizerEvents);
              }}>This week</Button>
            </div>
            <div className='col'>
              <Button className='btn-this-month-events btn-primary p-3' onClick={(e) => {
                filterEvents(e, 'This month', organizerEvents);
              }}>This month</Button>
            </div>
            <div className='col'>
              <Button className='btn-all-events btn-primary p-3' onClick={(e) => {
                filterEvents(e, 'All', organizerEvents);
              }}>All events</Button>
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

  const deleteChosenEvent = (e) => {
    e.preventDefault();
    const deleteEventDTO = {
      "name": chosenEvent.name
    }
    console.log("DELETE EVENT:");
    console.log(JSON.stringify(deleteEventDTO));
    deleteEvent(JSON.stringify(deleteEventDTO), token).then((response) => {
      console.log("response");
      console.log(response);
      alert("You have successfully deleted this event!")
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
        <MdAutoDelete size={30} /> Delete this event ?
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
            <BsShieldLockFill size={90} className='mr-3 mb-2' /> Authentication types
          </h1>
          <li>
            <button className='btn btn-secondary btn-item-enable-two-factor text-light' onClick={() => { enableTwoFactorAuthentication() }}>
              Enable Two-Factor Authentication
            </button>
          </li>
          <li>
            <button className='btn  btn-secondary btn-item-disable-two-factor text-light' onClick={() => { disableTwoFactorAuthentication() }}>
              Disable Two-Factor Authentication
            </button>
          </li>
          <li>
            <button className='btn  btn-secondary btn-item-one-time-pass-auth text-light' onClick={() => { enableOrDisableOneTimePass() }}>
              One Time Pass Authentication
            </button>
          </li>
        </ul>
      </div>
    )
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
                <button className='btn btn-item-authentication-types btn-secondary text-light' onClick={() => {
                  closeDashboard();
                  closeCreatedEventsDashboard();
                  closeFaEventForm();
                  closeFeedbackForm();
                  closeFinishedEventsForm();
                  closeAddResourcesLinkForm();
                  closeRewardMenu();

                  toggleAuthenticationForm()
                }}>
                  Authentication
                </button>
              </li>
              <li>
                <button className='btn btn-item-dashboard btn-success text-light' onClick={() => {
                  closeCreatedEventsDashboard();
                  closeAuthenticationForm();
                  closeFaEventForm();
                  closeFeedbackForm();
                  closeFinishedEventsForm();
                  closeAddResourcesLinkForm();
                  closeRewardMenu();
                  toggleDashboard()
                }}>
                  Dashboard
                </button>
              </li>
              {role != 'USER' && <li>
                <button className='btn btn-item-your-created-events btn-success text-light' onClick={() => {
                  closeDashboard();
                  closeAuthenticationForm();
                  closeAddResourcesLinkForm();
                  closeFaEventForm();
                  closeFeedbackForm();
                  closeFinishedEventsForm();
                  closeRewardMenu();
                  toggleCreatedEventsDashboard()
                }}>
                  Your created events
                </button>
              </li>}
              {role != 'USER' && <li><button className='btn btn-item-add-link btn-success text-light' onClick={() => {
                closeDashboard();
                closeCreatedEventsDashboard();
                closeAuthenticationForm();
                closeFaEventForm();
                closeRewardMenu();
                closeFinishedEventsForm();
                closeFeedbackForm();
                toggleAddResourcesForm();
              }}>
                Add link to your resources
              </button></li>}
              {finishedEvents.length > 0 && <li>
                <button className='btn btn-feedback-form btn-primary text-light' onClick={() => {
                  closeCreatedEventsDashboard();
                  closeAuthenticationForm();
                  closeFaEventForm();
                  closeAddResourcesLinkForm();
                  closeDashboard();
                  closeRewardMenu();
                  closeFeedbackForm();
                  toggleFinishedEventsForm();
                }}>
                  Feedback
                </button>
              </li>}
              {rewardsMenu == false && <li>
                <button className='btn btn-item-rewards btn-info text-light' onClick={() => {
                  closeCreatedEventsDashboard();
                  closeAuthenticationForm();
                  closeFaEventForm();
                  closeAddResourcesLinkForm();
                  closeDashboard();
                  closeFeedbackForm();
                  closeFinishedEventsForm();
                  toggleRewardMenu();
                }}>
                  Rewards
                </button>
              </li>}
              <li>
                <button className='btn btn-item-home btn-primary text-light' onClick={() => { navigateToHome() }}>
                  <FaHome size={35} className='mr-2 mb-1' />
                  Home
                </button>
              </li>
            </ul>
          </div>
        </div>
      </>
    )
  }

  const sidebarRightComponent = () => {
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

  const addResourceLinkForUser = () => {
    const request = {
      "username": user,
      "linkToPage": linkResources
    };
    console.log(JSON.stringify(request));

    addLinkToPage(request, token).then((response) => {
      alert("Successfully added link!");
      console.log("response");
      console.log(response);
      toggleAddResourcesForm();
    }).catch((error) => {
      console.log("error");
      console.log(error);
    })
  }

  const callAddResourcesNewForm = () => {
    return (
      <div className='add-resources-link-div bg-success p-5'>
        <button className="btn-close-add-resources-link-form btn btn-danger" onClick={(e) => closeAddResourcesLinkForm(e)}>x</button>
        <h1 className='form-label text-light text-center mb-5 mr-5'> <FaUserPen className='mr-3 mb-2 text-white' size={80} /> Add Resources Link</h1>
        <form className='add-resources-link-form'>
          <GrDocumentText size={35} className='input-resource-link-icon text-light' />
          <div className='form-group text-start mb-2'>

            <input type='text' placeholder='Enter Resources Link' name='linkResources' value={linkResources} className='form-control text-center'
              onChange={(e) => { setLinkResources(e.target.value) }} />
          </div>

        </form>
        <button className='btn btn-item-add-resource-in-form btn-primary text-light' onClick={() => { addResourceLinkForUser() }}>
          Add!
        </button>
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

            <h1 className='text-center'><VscFeedback size={60} className='mr-4' /> Feedback for event "{chosenFinishedEvent.name}"</h1>
            <p className='mb-2 text-secondary'>We hope you liked this event! Share your feedback with us! If you want to give additional feedback, you can scan the QR code below and add comments!</p>
            {console.log("Finished events")}
            {console.log(finishedEvents)}
            <div>
              {console.log("Chosen finished event")}
              {console.log(chosenFinishedEvent)}
              {callTurningToData(chosenFinishedEvent.qrCodeQuestions)}
              {chosenFinishedEvent.qrCodeQuestions != '' &&
                <img src={qrCodeQuestions} className='qr-code-client-feedback-questions' />}
            </div>
            <h3 className='form-label text-dark font-weight-bold mb-2'>Lecture Rating</h3>
            {callInputForm("lecture", lectureRating)}
            <h3 className='form-label text-dark font-weight-bold mb-2 mt-3'>Lector Rating</h3>
            {callInputForm("lector", lectorRating)}
            <div class="form-floating text-start mb-3 mt-4">
              <textarea class="form-control text-start" id="floatingInput2" placeholder="Enter additional feedback" value={description} rows="3" onChange={(e) => setDescription(e.target.value)} />
              <label className="floatingInput2 text-secondary">Share your thoughts</label>
            </div>
            <div class="form-floating text-start mb-3 mt-4">
              <input type="text" class="form-control text-start" id="floatingInput" placeholder="Enter Name" value={username}
                onChange={(e) => {
                  setIsAnonymous(false)
                  setUsername(e.target.value)
                }} />
              <label className="floatingInput text-secondary">Enter Name (optional)</label>
            </div>
            {console.log(chosenEvent)};
            <button className='btn-add-feedback btn text-center btn-primary mt-4 w-50' onClick={(event) => submitFeedback(event, chosenFinishedEvent.name)}>Submit!</button>
          </form>
        </div>
      </>
    )
  }

  const callFinishedEventsForm = () => {
    return (
      <div className='finished-events-div bg-light p-4'>
        <button className="btn-close-finished-events-form btn btn-danger" onClick={() => closeFinishedEventsForm()}>x</button>
        <h1 className='text-center text-dark mt-2'>Finished events</h1>
        <p className='mb-3 text-secondary text-center mt-3'>These events already ended. Choose event to give your feedback!</p>
        <ul>

          {finishedEvents.length > 0 && finishedEvents.map((finishedEvent, idx) => {
            return <li><button className='btn btn-primary btn-finished-event text-light mb-3' key={idx} onClick={() => {
              setChosenFinishedEvent(finishedEvent);
              toggleFeedbackForm();
              setFinishedEventsForm(false);
            }}>Event "{finishedEvent.name}" (Floor {finishedEvent.floorNumber}, Room {finishedEvent.roomNumber}, Started: {finishedEvent.duration.startDate.replace('T', ' ')}, Ended: {finishedEvent.duration.endDate.replace('T', ' ')})</button></li>
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
      <h1 className='text-center text-dark mt-2'><GiPresent size={80} className='mb-4 ml-3' /> Win Prizes</h1>
      <p className='mb-3 text-secondary text-center mt-3'>Collect points from using our app and get rewards!<br /><strong> Current points: {currentUser.points}</strong></p>
      <ul>
        <li><button className='btn btn-light btn-reward-item-1 text-light' onClick={() => {
          setRewardPath(keyHolderReward);
          toggleGenerateBiggerImage();
        }
        }>
          <img src={keyHolderReward} width={200} height={200} alt='Responsive image' className='img-fluid text-center mb-4 mt-2' />
          <p className='mb-3 text-secondary text-center mb-3'>Key holder <br /> <strong> points: {keyholderPoints}</strong> </p>
        </button>
          <button className={`btn ${currentUser.points < keyholderPoints ? 'disabled' : ''}  btn-get-item-3 text-center btn-primary`} onClick={() => {
            getUserPrize();
          }}>Take prize!</button>
        </li>
        <li><button className={'btn  btn-light btn-reward-item-2 text-light'} onClick={() => {
          setRewardPath(hatReward);
          toggleGenerateBiggerImage();
        }
        } >
          <img src={hatReward} width={200} height={200} alt='Responsive image' className='img-fluid text-center mb-4 mt-2' />
          <p className='mb-3 text-secondary text-center  mb-3'>Hat <br /> <strong> points: {hatPoints}</strong> </p>
        </button>
          <button className={`btn ${currentUser.points < hatPoints ? 'disabled' : ''} btn-get-item-2 text-center btn-primary`} onClick={() => {
            getUserPrize();
          }}>Take prize!</button>
        </li>
        <div>
          <li>
            <button className='btn btn-light btn-reward-item-3 text-light' onClick={() => {
              setRewardPath(tshirtReward);
              toggleGenerateBiggerImage();
            }
            }>
              <img src={tshirtReward} width={200} height={200} alt='Responsive image' className='img-fluid text-center mb-4 mt-2' />
              <p className='mb-3 text-secondary text-center mb-3'>T shirt <br /> <strong> points: {tshirtPoints}</strong></p>
            </button>
            <button className={`btn ${currentUser.points < tshirtPoints ? 'disabled' : ''} btn-get-item text-center btn-primary`} onClick={() => {
              getUserPrize();
            }}>Take prize!</button>
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
    </>
  )
}

export default UserSettingsPageComponent