import React from 'react'
import logo from '../assets/fmi-deskspot-high-resolution-logo-white-transparent.png';
import './DeskspotComponent.css'

const DeskspotComponent = () => {
  return (
    <div className='container text-start'>
      <div>
       <img src={logo} width={135} height={135} alt='Responsive image'className='img-fluid position-absolute top-0 start-0 translate-middle mx-9'/>
       <br/>
      <h1 className='text-center display-1 fw-bold text-light font-weight-bold mt-3'>FMI DeskSpot</h1>
      <div className="d-flex flex-column flex-shrink-0 text-white bg-dark position-absolute position-absolute top-50 start-0 translate-middle mx-7 text-start">
    <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
      <svg className="bi me-0" width="10" height="8"><use xlinkHref="#bootstrap"></use></svg>
      <span className="fs-2 mx-8"></span>
    </a>
    <hr/>
    <ul className="nav nav-pills flex-column mb-auto">
      <li>
      <div className="btn-group">
  <button type="button" className="btn btn-danger dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">l̥
    Action
  </button>
  <ul className="dropdown-menu">
    <li><a className="dropdown-item" href="#">Action</a></li>
    <li><a className="dropdown-item" href="#">Another action</a></li>
    <li><a className="dropdown-item" href="#">Something else here</a></li>
    <li><hr className="dropdown-divider"/></li>
    <li><a className="dropdown-item" href="#">Separated link</a></li>
  </ul>
</div>
      </li>
    </ul>
    <hr/>
    <div className="dropdown">
      <a href="#" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
        <img src="https://github.com/mdo.png" alt="" width="32" height="32" className="rounded-circle me-2"/>
        <strong>mdo</strong>
      </a>
      <ul className="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1">
        <li><a className="dropdown-item" href="#">New project...</a></li>
        <li><a className="dropdown-item" href="#">Settings</a></li>
        <li><a className="dropdown-item" href="#">Profile</a></li>
        <li><hr className="dropdown-divider"/></li>
        <li><a className="dropdown-item" href="#">Sign out</a></li>
      </ul>
    </div>
  </div>
      </div>
    </div>
  )
}

export default DeskspotComponent