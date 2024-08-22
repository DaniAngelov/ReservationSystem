import React, { useState } from 'react'
import './UserRegistrationComponent.css'
import { createUser } from '../services/UserService';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/fmi-deskspot-high-resolution-logo-white-transparent.png';

const UserRegistrationComponent = () => {

    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [email,setEmail] = useState('');

    const navigator = useNavigate();
    
    function saveUser(e){
      e.preventDefault();

      const user = {username,password,email};
      
      createUser(user).then((response) => {
        console.log(response.data);
        navigator('/successful-register');
      });
    }
  
  return (
    <div className='container'>
      <div>
         <img src={logo} width={135} height={135} alt='Responsive image'className='custom-img img-fluid position-absolute mx-6 mt-4'/>
         <br/>
        <h1 className='text-center display-1 fw-bold text-light font-weight-bold mt-3'>FMI DeskSpot</h1>
      </div>
      <div className='card mt-5 bg-transparent border-0 position-absolute top-50 start-50 translate-middle'>
        <h2 className='display-4 fw-normal text-center text-light mb-4'>Sign up</h2>

        <div className='card-body-register text-center col-md-12'>
          <form>
              <div className='form-group text-start mb-2'>
                <label className='form-label text-light'>Username:</label>
                <input type='text' placeholder='Enter Username' name='username' value={username} className='form-control'
                onChange={(e) => setUsername(e.target.value)}>
                </input>
              </div>
                
              <div className='form-group text-start mb-2'>
                <label className='form-label text-light'>Password:</label>
                <input type='password' placeholder='Enter Password' name='password' value={password} className='form-control'
                onChange={(e) => setPassword(e.target.value)}
                >
                </input>
              </div>

              <div className='form-group text-start'>
                <label className='form-label text-light'>Email:</label>
                <input type='email' placeholder='Enter Email Address' name='email' value={email} className='form-control'
                onChange={(e) => setEmail(e.target.value)}>
                </input>
              </div>
              <br/>
              <button className='btn  btn-success mt-2' onClick={saveUser}>Sign up!</button>
          </form>  
        </div>

      </div>
    </div>
  )
}

export default UserRegistrationComponent