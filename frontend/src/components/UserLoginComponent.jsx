import React, { useEffect, useRef, useState } from 'react'
import logo from '../assets/fmi-deskspot-high-resolution-logo-white-transparent.png';
import './UserLoginComponent.css'
import { useNavigate } from 'react-router-dom';
import { BsShieldLockFill } from "react-icons/bs";
import { verifyOneTimePass, generateOneTimePass, loginUser, sendMessageToEmail, verifyTwoFA } from '../services/UserService';
import { jwtDecode } from 'jwt-decode'

import { TbMailFilled } from "react-icons/tb";
import codingLogo from '../assets/coding-image-login.jpg';

const UserLoginComponent = () => {
  const navigator = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  const [errors, setErrors] = useState({});

  const token = localStorage.getItem('token');

  const [digit1, setDigit1] = useState('');
  const [digit2, setDigit2] = useState('');
  const [digit3, setDigit3] = useState('');
  const [digit4, setDigit4] = useState('');
  const [digit5, setDigit5] = useState('');
  const [digit6, setDigit6] = useState('');

  const [faEventForm, setFaEventForm] = useState(false);
  const [mfaEventForm, setMfaEventForm] = useState(false);
  const [onePassForm, setOnePassForm] = useState(false);
  const [forgottenPass, setForgottenPass] = useState(false);
  const [oneTimePassFinalForm, setOneTimePassFinalForm] = useState(false);
  const [invalidLoginAlert, setInvalidLoginAlert] = useState(false);
  const [invalidForgottenPasswordAlert, setInvalidForgottenPasswordAlert] = useState(false);

  const [showText, setShowText] = useState(false);

  const [oneTimePassEnabled, setOneTimePassEnabled] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(false);

  const [alertError, setAlertError] = useState('');

  const toggleInvalidLoginAlert = () => {
    return setInvalidLoginAlert(true);
  }

  const closeInvalidLoginAlert = () => {
    return setInvalidLoginAlert(false);
  }

  const toggleInvalidForgottenPasswordAlert = () => {
    return setInvalidForgottenPasswordAlert(true);
  }

  const closeInvalidForgottenPasswordAlert = () => {
    return setInvalidForgottenPasswordAlert(false);
  }

  const toggleFaEventForm = () => {
    return setFaEventForm(!faEventForm);
  }

  const closeFaEventForm = () => {
    return setFaEventForm(false);
  }

  const toggleOnePassForm = () => {
    return setOnePassForm(!onePassForm);
  }

  const closeOnePassForm = () => {
    return setOnePassForm(false);
  }

  const toggleOneTimePassFinalForm = () => {
    return setOneTimePassFinalForm(!oneTimePassFinalForm);
  }

  const closeOneTimePassFinalForm = (e) => {
    e.preventDefault();
    return setOneTimePassFinalForm(false);
  }

  const toggleMFaEventForm = () => {
    return setMfaEventForm(!mfaEventForm);
  }

  const toggleForgottenPass = (e) => {
    e.preventDefault();
    return setForgottenPass(!forgottenPass);
  }

  const closeForgottenPassForm = (e) => {
    e.preventDefault();
    return setForgottenPass(false);
  }

  const closeMfaForm = (e) => {
    e.preventDefault();
    return setMfaEventForm(false);
  }

  const updateForgottenPassState = () => {
    setShowText(false);
    return setForgottenPass(!forgottenPass);
  }

  const toggleForgottenPassTrue = (e, newEmail) => {
    e.preventDefault();
    const userForgottenPassDTO = {
      email: newEmail
    }

    sendMessageToEmail(userForgottenPassDTO).then((response) => {
      setShowText(true);
      closeInvalidForgottenPasswordAlert();
      console.log(response);
      setTimeout(() =>
        updateForgottenPassState(), 2500);
    }).catch((error) => {
      setAlertError(error.response.data);
      toggleInvalidForgottenPasswordAlert();
    })

    return forgottenPass;
  }

  const verifySecret = (e) => {
    e.preventDefault();
    const code = `${digit1}${digit2}${digit3}${digit4}${digit5}${digit6}`;
    const decodedToken = jwtDecode(token);

    const user = decodedToken.sub;
    const request = {
      "code": code,
      "username": user
    }
    console.log(JSON.stringify(request));
    verifyTwoFA(request, token).then((response) => {
      console.log("response verify:");
      console.log(response.data);
      navigator('/welcome')
    }).catch((error) => {
      console.log(error.response.data);
    });
  }

  const callEventForm = () => {

    return (
      <>
        <div className='custom-card-body-mfa text-center bg-secondary p-5 mt-5 text-light'>
        <button className="btn-close-mfa-event-pass-form btn btn-danger" onClick={(e) => closeFaEventForm(e)}>x</button>
          <h1 className='text-center mb-2'><BsShieldLockFill size={70} className='mb-2' /> Verify your account!</h1>
          <h5 className='text-center mt-4'>Enter the 6-digit verification code from your Authenticator app! </h5>
          <div className="custom-form-mfa mb-2">
            <input className="mr-2" type="text" maxLength="1" size="1" min="0" max="9" pattern="[0-9]{1}" value={digit1} onChange={(e) => setDigit1(e.target.value)} />
            <input className="mr-2" type="text" maxLength="1" size="1" min="0" max="9" pattern="[0-9]{1}" value={digit2} onChange={(e) => setDigit2(e.target.value)} />
            <input className="mr-2" type="text" maxLength="1" size="1" min="0" max="9" pattern="[0-9]{1}" value={digit3} onChange={(e) => setDigit3(e.target.value)} />
            <input className="mr-2" type="text" maxLength="1" size="1" min="0" max="9" pattern="[0-9]{1}" value={digit4} onChange={(e) => setDigit4(e.target.value)} />
            <input className="mr-2" type="text" maxLength="1" size="1" min="0" max="9" pattern="[0-9]{1}" value={digit5} onChange={(e) => setDigit5(e.target.value)} />
            <input className="mr-2 mb-5" type="text" maxLength="1" size="1" min="0" max="9" pattern="[0-9]{1}" value={digit6} onChange={(e) => setDigit6(e.target.value)} />
            <br />
          </div>
          <button class="btn mt-3 btn-primary btn-embossed-2" onClick={(e) => { verifySecret(e) }}>Submit</button>
        </div>
      </>)
  };

  const generateOneTimePassCode = (e, newEmail) => {
    e.preventDefault();
    const userGenerateOneTimePassDTO = {
      email: newEmail
    }

    generateOneTimePass(userGenerateOneTimePassDTO, token).then((response) => {
      console.log("response");
      console.log(response.data);
    }).catch((error) => {
      console.log("error");
      console.log(error);
    })
  }

  const verifyNewOneTimePass = (e) => {
    e.preventDefault();
    const code = `${digit1}${digit2}${digit3}${digit4}${digit5}${digit6}`;
    const decodedToken = jwtDecode(token);

    const user = decodedToken.sub;
    const request = {
      "code": code,
      "username": user
    }
    console.log(JSON.stringify(request));
    verifyOneTimePass(request, token).then((response) => {
      console.log("response verify:");
      console.log(response.data);
      navigator('/welcome')
    }).catch((error) => {
      console.log(error.response.data);
    });
  }

  const callOnePassForm = () => {
    return (
      <div className=' custom-card-body-one-pass-form text-center bg-secondary p-5 mt-5 text-light'>
        <button className="btn-close-one-time-pass-form btn btn-danger" onClick={(e) => closeOneTimePassFinalForm(e)}>x</button>
        <h1 className='text-center mb-2'><BsShieldLockFill size={70} className='mb-2' /> Verify your account!</h1>
        <h5 className='text-center mt-4'>Enter the one pass verification code sent to your email! </h5>
        <div className="custom-form-one-pass mb-2">
          <input className="mr-2" type="text" maxLength="1" size="1" min="0" max="9" pattern="[0-9]{1}" value={digit1} onChange={(e) => setDigit1(e.target.value)} />
          <input className="mr-2" type="text" maxLength="1" size="1" min="0" max="9" pattern="[0-9]{1}" value={digit2} onChange={(e) => setDigit2(e.target.value)} />
          <input className="mr-2" type="text" maxLength="1" size="1" min="0" max="9" pattern="[0-9]{1}" value={digit3} onChange={(e) => setDigit3(e.target.value)} />
          <input className="mr-2" type="text" maxLength="1" size="1" min="0" max="9" pattern="[0-9]{1}" value={digit4} onChange={(e) => setDigit4(e.target.value)} />
          <input className="mr-2" type="text" maxLength="1" size="1" min="0" max="9" pattern="[0-9]{1}" value={digit5} onChange={(e) => setDigit5(e.target.value)} />
          <input className="mr-2 mb-4" type="text" maxLength="1" size="1" min="0" max="9" pattern="[0-9]{1}" value={digit6} onChange={(e) => setDigit6(e.target.value)} />
          <h5 className='text-info mb-4 mt-2'>We've sent a code to the email to be able to login. Check your email!</h5>

        </div>
        <button class="btn mt-5 btn-primary btn-embossed-one-pass" onClick={(e) => { verifyNewOneTimePass(e) }}>Submit</button>
      </div>)
  };


  function userLogin(e) {
    e.preventDefault();
    const validationErrors = {};
    if (!username.trim()) {
      validationErrors.username = 'Username is required!'
      setIsUsernameValid(false);
    }

    if (!password.trim()) {
      validationErrors.password = 'Password is required!'
      setIsPasswordValid(false);
    }

    setErrors(validationErrors);

    if (!validationErrors.username) {
      setIsUsernameValid(true);
    }
    if (!validationErrors.password) {
      setIsPasswordValid(true);
    }

    if (Object.keys(validationErrors).length === 0) {
      e.preventDefault();
      const user = { username, password };

      loginUser(user).then((response) => {
        localStorage.setItem('token', response.data.token);
        console.log(jwtDecode(response.data.token).oneTimePassEnabled);
        setOneTimePassEnabled(jwtDecode(response.data.token).oneTimePassEnabled);
        setMfaEnabled(jwtDecode(response.data.token).faEnabled);
        if (jwtDecode(response.data.token).faEnabled || jwtDecode(response.data.token).oneTimePassEnabled) {
          toggleMFaEventForm();
        } else {
          navigator('/welcome');
        }


      }).catch(() => {
        toggleInvalidLoginAlert();
      });
    }

  }

  const navigateToRegister = () => {
    navigator('/register');
  }

  const oneTimePassAddEmailForm = () => {
    return (
      <>
        <div className='card-body-forgot-pass text-center text-black bg-light p-5'>
          <form>
            <button className="btn-close-forgotten-pass-form btn btn-danger" onClick={(e) => closeOnePassForm(e)}>x</button>
            <h1 className='mb-5'>Verify yourself</h1>
            <p className='mb-3 text-secondary'>Enter your email and we'll send you a code to verify yourself.</p>

          </form>
          <div class="mb-3 mt-5">
            <TbMailFilled size={30} className='mail-image-one-time' />
            <input type="email" placeholder='Email' class="form-control" id="exampleInputEmail1" value={email} aria-describedby="emailHelp" onChange={(e) => setEmail(e.target.value)}>
            </input>
          </div>
          <button className='btn  btn-success mt-4' onClick={(e) => {
            toggleOnePassForm();
            toggleOneTimePassFinalForm();
            generateOneTimePassCode(e, email);
          }}>Submit!</button>
        </div>
      </>
    )
  }


  const forgottenPassForm = () => {
    return (
      <>
        <div className='card-body-forgot-pass text-center text-black bg-light p-5'>
          <form>
            <button className="btn-close-forgotten-pass-form btn btn-danger" onClick={(e) => {
              closeForgottenPassForm(e)
              closeInvalidForgottenPasswordAlert();
            }
            }>x</button>
            <h1 className='mb-5'>Reset your password</h1>
            <p className='mt-5 mb-3 text-secondary'>Enter your email and we'll send you a link to reset your password.</p>
          </form>
          <div class="mb-3 mt-5">
            <TbMailFilled size={30} className='mail-image' />
            <input type="email" placeholder='Email' class="form-control" id="exampleInputEmail1" value={email} aria-describedby="emailHelp" onChange={(e) => setEmail(e.target.value)}>
            </input>
          </div>
          <button className='btn  btn-success mt-4' onClick={(e) => toggleForgottenPassTrue(e, email)}>Submit!</button>
          {showText && <p className='mt-3 text-success'>We've sent a code to the specific email to reset your password. Check your email!</p>}
        </div>
      </>
    )
  }

  const pressEnter = (e) => {
    if (e.keyCode == 13) {
      userLogin(e);
    }
  }

  const callMfaEventForm = () => {
    return (
      <>
        <div className='card-body-mfa text-center text-black bg-light p-5'>
          <form>
            <button className="btn-close-forgotten-pass-form btn btn-danger" onClick={(e) => closeMfaForm(e)}>x</button>
            <button className="btn-close-mfa-form btn btn-danger" onClick={(e) => closeMfaForm(e)}>x</button>
            <BsShieldLockFill size={40} className='mb-2' />
            <h1 className='mb-5 text-center'> Multi Factor Authentication</h1>
            <p className='mb-3 text-secondary'>Choose one of the options below to authenticate yourself!</p>
            {oneTimePassEnabled && <button class="mb-3 mt-5  btn btn-mfa-1 btn-primary text-light p-2" onClick={() => {
              toggleOnePassForm();
              toggleMFaEventForm();
            }
            }>
              One Time Pass Authentication
            </button>
            }
            {mfaEnabled && <button class="mb-3 mt-5 btn btn-mfa-2 btn-success text-light p-2" onClick={() => {
              toggleFaEventForm();
              toggleMFaEventForm();
            }} >
              Two Factor Authentication
            </button>
            }
          </form>
        </div>
      </>
    )
  }


  const showAlertWhenClickedInvalidLogin = () => {
    return (<div class="login-alert alert alert-danger text-danger text-center" role="alert">
      Invalid credentials! Please try again!
    </div>)
  }

  const showAlertWhenEmailDoesNotExist = () => {
    return (<div class="login-alert-forgotten-pass alert alert-danger text-danger text-center" role="alert">
     
      {alertError}
      <button className="btn-close-forgotten-pass-form-alert btn btn-danger" onClick={(e) => {
              closeInvalidForgottenPasswordAlert();
            }
            }>x</button>
      
    </div>)
  }

  return (
    <>
      <div className='body-div-login-page'>
        <div>
          <img src={logo} width={150} height={150} alt='Responsive image' className='custom-img-login-page img-fluid' />
        </div>
        {invalidLoginAlert && showAlertWhenClickedInvalidLogin()}
        {invalidForgottenPasswordAlert && showAlertWhenEmailDoesNotExist()}
        <div className='card-body-login'>
          <form className='needs-validation login-custom-form p-3 bg-light' noValidate>
            <h1 className='text-center text-dark mb-4'>Sign in</h1>
            <p className='text-secondary text-center mb-4'>Welcome! Ready to start booking events? Sign in and let's get started!</p>
            <div className='form-group text-start mb-2 mt-5'>
              <label className='form-label text-light'>Username:</label>
              <input type='text' placeholder='Enter Username' name='username' value={username} className={`form-control ${isUsernameValid == true ? '' : 'is-invalid'}`}
                onChange={(e) => setUsername(e.target.value)} onKeyDown={(e) => { pressEnter(e) }}>
              </input>
              {errors.username && <div class="invalid-feedback">
                {errors.username}
              </div>}
            </div>

            <div className='form-group text-start'>
              <label className='form-label text-light'>Password:</label>
              <input type='password' placeholder='Enter Password' name='password' value={password} className={`form-control ${isPasswordValid == true ? '' : 'is-invalid'}`}
                onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => { pressEnter(e) }}
              >
              </input>
              <button className='btn btn-forgotten-password-login text-secondary text-center mt-2' onClick={(e) => {
                toggleForgottenPass(e);
              }}>Forgotten password?</button>
              {errors.password && <div class="invalid-feedback">
                {errors.password}
              </div>}
            </div>
            <button className='btn btn-submit-login btn-success mt-2' onClick={userLogin}>Sign in!</button>
          </form>
        </div>

        <div className='coding-image-div-login'>
          <img src={codingLogo} width={400} height={400} alt='Responsive image' className='img-fluid' />
          <p className='text-secondary mt-3 ml-5'>You don't have an account ?
            <button className='btn btn-return-to-sign-up btn-primary text-light mb-1 ml-3' onClick={() => { navigateToRegister() }}>Sign up!</button>
          </p>
        </div>

      </div>
      {faEventForm && callEventForm()}
      {onePassForm && oneTimePassAddEmailForm()}
      {oneTimePassFinalForm && callOnePassForm()}
      {mfaEventForm && callMfaEventForm()}
      {forgottenPass && forgottenPassForm()}
    </>
  )
}

export default UserLoginComponent