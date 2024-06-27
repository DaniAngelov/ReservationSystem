import React, { useState } from 'react'
import logo from '../assets/fmi-deskspot-high-resolution-logo-white-transparent.png';
import './UserLoginComponent.css'
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/UserService';

const UserLoginComponent = () => {
  const navigator = useNavigate();
  
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');


  function userLogin(e){
    e.preventDefault();
    const user = {username,password};
    
    loginUser(user).then((response) => {
      console.log(response.data);
      navigator('/users');
    });
  }

return (
  <div className='container'>
    <div>
       <img src={logo} width={135} height={135} alt='Responsive image'className='img-fluid position-absolute mx-6 mt-4'/>
       <br/>
      <h1 className='text-center display-1 fw-bold text-light font-weight-bold mt-3'>FMI DeskSpot</h1>
    </div>
    <div className='card mt-5 bg-transparent border-0 position-absolute top-50 start-50 translate-middle'>
      <h2 className='display-4 fw-normal text-center text-light mb-4'>Sign in</h2>

      <div className='card-body text-center'>
        <form>
            <div className='form-group text-start mb-2'>
              <label className='form-label text-light'>Username:</label>
              <input type='text' placeholder='Enter Username' name='username' value={username} className='form-control'
              onChange={(e) => setUsername(e.target.value)}>
              </input>
            </div>
              
            <div className='form-group text-start mb-2'>
              <label className='form-label text-light'>Password:</label>
              <input type='text' placeholder='Enter Password' name='password' value={password} className='form-control'
              onChange={(e) => setPassword(e.target.value)}
              >
              </input>
            </div>
            <br/>
            <button className='btn  btn-success mt-2' onClick={userLogin}>Sign in!</button>
        </form>  
      </div>

    </div>
  </div>
)
}

export default UserLoginComponent