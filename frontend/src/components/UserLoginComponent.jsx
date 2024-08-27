import React, { useEffect, useRef, useState } from 'react'
import logo from '../assets/fmi-deskspot-high-resolution-logo-white-transparent.png';
import './UserLoginComponent.css'
import { useNavigate } from 'react-router-dom';
import { BsShieldLockFill } from "react-icons/bs";
import { loginUser, sendMessageToEmail, verifyTwoFA } from '../services/UserService';
import { jwtDecode } from 'jwt-decode'

import { TbMailFilled } from "react-icons/tb";

const UserLoginComponent = () => {
  const navigator = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const token = localStorage.getItem('token');

  const [digit1, setDigit1] = useState('');
  const [digit2, setDigit2] = useState('');
  const [digit3, setDigit3] = useState('');
  const [digit4, setDigit4] = useState('');
  const [digit5, setDigit5] = useState('');
  const [digit6, setDigit6] = useState('');

  const [faEventForm, setFaEventForm] = useState(false);
  const [forgottenPass, setForgottenPass] = useState(false);
  const [showText, setShowText] = useState(false);


  const toggleFaEventForm = () => {
    return setFaEventForm(!faEventForm);
  }

  const toggleForgottenPass = (e) => {
    e.preventDefault();
    return setForgottenPass(!forgottenPass);
  }

  const updateForgottenPassState = () => {
    setShowText(false);
    return setForgottenPass(!forgottenPass);
  }

  const toggleForgottenPassTrue = (e, newEmail) => {
    e.preventDefault();
    setShowText(true);
    const userForgottenPassDTO = {
      email: newEmail
    }

    console.log("Here");
    sendMessageToEmail(userForgottenPassDTO).then((response) => {
      console.log(response);
    }).catch((error) => {
      console.log(error);
    })

    setTimeout(() =>
      updateForgottenPassState(), 2000);
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
        <div className=' custom-card-body-2 text-center bg-secondary p-5 mt-5 text-light'>

          <h1 className='text-center mb-2'><BsShieldLockFill size={70} className='mb-2' /> Verify your account!</h1>
          <h5 className='text-center mt-4'>Enter the 6-digit verification code from your Authenticator app! </h5>
          <div className="custom-form-2 mb-2">
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


  function userLogin(e) {
    e.preventDefault();
    const user = { username, password };

    loginUser(user).then((response) => {
      localStorage.setItem('token', response.data.token);
      if (jwtDecode(response.data.token).faEnabled) {
        toggleFaEventForm();
      } else {
        navigator('/welcome');
      }
    }).catch((error) => {
      console.log(error);
      alert('Wrong credentials!');
    });
  }

  const navigateToRegister = () => {
    navigator('/register');
  }


  const forgottenPassForm = () => {
    return (
      <>
        <div className='card-body-forgot-pass text-center text-black bg-light p-5'>
          <form>
            <h1 className='mb-5'>Reset your password</h1>
            <p className='mb-3 text-secondary'>Enter your email and we'll send  send you a link to reset your password.</p>
          
          </form>
          <div class="mb-3 mt-5">
              <TbMailFilled size={30} className='mail-image' />
              <input type="email" placeholder='Email' class="form-control" id="exampleInputEmail1" value={email}  aria-describedby="emailHelp" onChange={(e) => setEmail(e.target.value)}>
              </input>
            </div>
            <button className='btn  btn-success mt-4' onClick={(e) => toggleForgottenPassTrue(e,email)}>Submit!</button>
            {showText && <p className='mt-3 text-success'>We've sent a code to the specific email to reset your password. Check your email!</p>}
        </div>
      </>
    )
  }


  return (
    <>
      <div className='container'>
        <div>
          <img src={logo} width={135} height={135} alt='Responsive image' className='custom-img img-fluid position-absolute mx-6 mt-4' />
          <br />
          <h1 className='text-center display-1 fw-bold text-light font-weight-bold mt-3'>FMI DeskSpot</h1>
        </div>
        <h2 className='header-sign-in display-4 fw-normal text-center text-light mb-5'>Sign in</h2>

        <div className=' mt-5 bg-transparent border-0 position-absolute top-50 start-50 translate-middle'>

          <div className='card-body-login text-center col-md-12'>
            <form>
              <div className='form-group text-start mb-2'>
                <label className='form-label text-light'>Username:</label>
                <input type='text' placeholder='Enter Username' name='username' value={username} className='form-control'
                  onChange={(e) => setUsername(e.target.value)}>
                </input>
              </div>

              <div className='form-group text-start'>
                <label className='form-label text-light'>Password:</label>
                <input type='password' placeholder='Enter Password' name='password' value={password} className='form-control'
                  onChange={(e) => setPassword(e.target.value)}
                >
                </input>
                <button className='btn text-light text-center ml-5 mt-2' onClick={(e) => {
                  toggleForgottenPass(e);
                }}>Forgotten password?</button>
              </div>
              <button className='btn  btn-success mt-2' onClick={userLogin}>Sign in!</button>
            </form>

          </div>
        </div>

        <p className='par-navigator text-light mt-5'>You don't have an account ?
          <button className='btn btn-primary text-light mb-1 ml-3' onClick={() => { navigateToRegister() }}>Sign up!</button>
        </p>
      </div>
      {faEventForm && callEventForm()}
      {forgottenPass && forgottenPassForm()}
    </>
  )
}

export default UserLoginComponent