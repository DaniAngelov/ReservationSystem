import React, { useState } from 'react'
import './UserRegistrationComponent.css'
import { createUser } from '../services/UserService';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/fmi-deskspot-high-resolution-logo-white-transparent.png';
import codingLogo from '../assets/coding-logo.jpg';

const UserRegistrationComponent = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [userRole, setUserRole] = useState('');
  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);

  const [errors, setErrors] = useState({});

  const navigator = useNavigate();

  function saveUser(e) {
    e.preventDefault();
    const validationErrors = {};
    if (!username.trim()) {
      validationErrors.username = 'Username is required!'
      setIsUsernameValid(false);
    } else if (username.length < 6) {
      validationErrors.username = 'Username should be at least 6 characters!'
      setIsUsernameValid(false);
    }

    if (!email.trim()) {
      validationErrors.email = 'Email is required!'
      setIsEmailValid(false);
    } else if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email)) {
      validationErrors.email = 'Email is not valid! Follow this structure: example@gmail.com'
      setIsEmailValid(false);
    }


    if (!password.trim()) {
      validationErrors.password = 'Password is required!'
      setIsPasswordValid(false);
    } else if (password.length < 6) {
      validationErrors.password = 'Password should be at least 6 characters!'
      setIsPasswordValid(false);
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(password)) {
      validationErrors.password = 'Password is not valid! It should contain at least 1 normal, 1 capital, 1 special symbol and 1 number.'
      setIsPasswordValid(false);
    }

    setErrors(validationErrors);

    if (!validationErrors.username) {
      setIsUsernameValid(true);
    }
    if (!validationErrors.email) {
      setIsEmailValid(true);
    }
    if (!validationErrors.password) {
      setIsPasswordValid(true);
    }

    if (Object.keys(validationErrors).length === 0) {
      const user = {
        "username":username, 
        "password":password,
        "email": email,
        "role": userRole };
      console.log(user);
      navigator('/successful-register');
      createUser(user).then((response) => {
        console.log(response.data);
        navigator('/successful-register');
      });
    }
  }

  const navigateToLogin = () => {
    navigator('/login');
  }

  return (
    <div className='body-div-registration-page'>
      <div>
        <img src={logo} width={150} height={150} alt='Responsive image' className='custom-img-registration-page img-fluid' />
      </div>

      <div className='card-body-register'>

        <form className='needs-validation register-custom-form p-3 bg-light' noValidate>
          <h1 className='text-center text-dark mb-4'>Sign up</h1>
          <p className='text-secondary text-center mb-4'>Welcome! Ready to finally join FMI DeskSpot and start booking events? Fill the form below and let's get started!</p>
          <div className='form-floating mb-2'>
            <input required type='text' placeholder='Enter Username' name='username' id="floatingInput21" value={username} className={`form-control ${isUsernameValid == true ? '' : 'is-invalid'}`}
              onChange={(e) => setUsername(e.target.value)}>
            </input>
            <label for="floatingInput21 text-secondary">Username</label>
            {errors.username && <div class="invalid-feedback">
              {errors.username}
            </div>}

          </div>

          <div className='form-floating text-start mb-2'>
            <input required type='password' placeholder='Enter Password' name='password' id="floatingInput22" value={password} className={`form-control ${isPasswordValid == true ? '' : 'is-invalid'}`}
              onChange={(e) => setPassword(e.target.value)}
            >
            </input>
            <label for="floatingInput22 text-secondary">Password</label>
            {errors.password && <div class="invalid-feedback">
              {errors.password}
            </div>}
          </div>

          <div className='form-floating text-start'>
            <input required type='email' placeholder='Enter Email Address'  id="floatingInput23" name='email' value={email} className={`form-control ${isEmailValid == true ? '' : 'is-invalid'}`}
              onChange={(e) => setEmail(e.target.value)}>
            </input>
            <label for="floatingInput23 text-secondary">Email</label>
            {errors.email && <div class="invalid-feedback">
              {errors.email}
            </div>}
          </div>

          <div class="form-floating text-start mt-2">
                  <select type="text" class="form-control text-start" id="floatingInput24" placeholder="Choose role" value={userRole}
                    onChange={(e) => setUserRole(e.target.value)}>
                    <option>USER</option>
                    <option>QA</option>
                    <option>DEVELOPER</option>
                    <option>DEVOPS</option>
                  </select>
                  <label for="floatingInput24 text-light">
                   Choose role
                  </label>
                </div>
          <button className='btn btn-submit-register btn-success' onClick={(e) => {
            saveUser(e);
          }
          }>Sign up!</button>
        </form>
      </div>

      <div className='coding-image-div'>
        <img src={codingLogo} width={400} height={400} alt='Responsive image' className='img-fluid' />
        <p className='text-secondary mt-3 ml-5'>You already have an account ?
          <button className='btn btn-return-to-login btn-primary text-light ml-3 mb-1' onClick={() => { navigateToLogin() }}>Sign in!</button>
        </p>
      </div>

    </div>
  )
}

export default UserRegistrationComponent