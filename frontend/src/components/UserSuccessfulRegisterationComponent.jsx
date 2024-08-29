import React from 'react'
import logo from '../assets/fmi-deskspot-high-resolution-logo-white-transparent.png';
import './UserSuccessfulRegistrationComponent.css'
import green_tick from '../assets/tick-icon.png'
import { useNavigate } from 'react-router-dom';

const UserSuccessfulRegisterationComponent = () => {

  const navigator = useNavigate();

  function returnToLoginScreen(e){
    e.preventDefault();      
    navigator('/login');
  }
  
  return (
    <div className='container text-center'>
      <div>
         <img src={logo} width={135} height={135} alt='Responsive image ' className='custom-img img-fluid position-absolute mx-6 mt-4'/>
         <br/>
        <h1 className='text-center display-1 fw-bold text-light font-weight-bold mt-3'>FMI DeskSpot</h1>
      </div>
      <div>
       
      </div>
      <br/>
      
      <div className="modal-content-test bg-success text-center  mt-6 p-3" tabIndex="-1">
      <img src={green_tick} width={80} height={80} alt='Responsive image' className='rounded mx-auto d-block mt-5.bg-success'/>
        <div className="modal-dialog">
          <div className="modal-content">
             
            <h1 className="modal-title text-white mb-5 display-5 fw-bold ">Registration successful!</h1>
            <div className="modal-body mb-5 text-light">
              <h4 className='text-wrap mb-5'>Congratulations, your accoount has been successfully registered! <br/> You can now enter into your FMI DeskSpot!</h4>
              <button type="button" className="btn btn-primary p-2" onClick={returnToLoginScreen}>Continue</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserSuccessfulRegisterationComponent