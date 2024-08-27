import React, { useState } from 'react'
import logo from '../assets/fmi-deskspot-high-resolution-logo-white-transparent.png';
import './UserPasswordChangeComponent.css'
import { updateUserPassword } from '../services/UserService';
import { useNavigate } from 'react-router-dom';

const UserPasswordChangeComponent = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const navigator = useNavigate();


  const updatePassword = (e, newPassword, confirmNewPassword) => {

    e.preventDefault();
    if (newPassword != confirmNewPassword) {
      alert("Passwords do not match!");
    } else {
      const userDTO = {
        password: newPassword
      };
      updateUserPassword(userDTO).then((response) => {
        console.log(response);
        alert("Password changed successfully! You can return to login.")
      }).catch((error) => {
        console.log(error);
      })
    }
  }

  const navigateToLogin = () => {
    navigator('/login');
  }

  return (
    <div className='container'>
      <div>
        <img src={logo} width={135} height={135} alt='Responsive image' className='custom-img img-fluid position-absolute mx-6 mt-4' />
        <br />
        <h1 className='text-center display-1 fw-bold text-light font-weight-bold mt-3'>FMI DeskSpot</h1>
      </div>
      <div className='card-body-forgotten-password text-center text-light bg-secondary p-5'>
        <form>
          <h1 className='mb-5'>Change your password!</h1>
          <div className='form-group text-start'>
            <label className='form-label text-light'>New password:</label>
            <input type='password' placeholder='New password' name='password' value={newPassword} className='form-control'
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className='form-group text-start'>
            <label className='form-label text-light'>Confirm new password:</label>
            <input type='password' placeholder='Confirm new password' name='password' value={confirmNewPassword} className='form-control'
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
          </div>
          <button className='btn  btn-success mt-4' onClick={(e) => updatePassword(e, newPassword, confirmNewPassword)}>Change Password!</button>
        </form>


        <button className='par-navigator-2 btn btn-light text-secondary mb-1 ml-3' onClick={() => { navigateToLogin() }}>Back to sign in</button>

      </div>
    </div>


  )
}

export default UserPasswordChangeComponent