import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import UserRegistrationComponent from './components/UserRegistrationComponent'
import UserSuccessfulRegisterationComponent from './components/UserSuccessfulRegisterationComponent'
import UserLoginComponent from './components/UserLoginComponent'
import FloorPageComponent from './components/FloorPageComponent'
import RoomsPageComponent from './components/RoomsPageComponent'
import { useState } from 'react'
import UserSettingsPageComponent from './components/UserSettingsPageComponent'
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";
import UserPasswordChangeComponent from './components/UserPasswordChangeComponent.jsx'

function App() {

  const [room, setRoom] = useState([]);
  const [faculty, setFaculty] = useState('');

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/register' element={<UserRegistrationComponent />}></Route>
          <Route path='/login' element={<UserLoginComponent />}></Route>
          <Route path='/successful-register' element={<UserSuccessfulRegisterationComponent />}></Route>
          <Route path='/change-password' element={<UserPasswordChangeComponent />}></Route>
          <Route path='/welcome'>
            <Route index={true} element={<FloorPageComponent setRoom={setRoom} setFaculty={setFaculty} />} />
            <Route index={false} path="/welcome/floors/:floorId/rooms/:roomId" element={<RoomsPageComponent room={room} faculty={faculty} />} />
          </Route>
          <Route path='/settings' element={<UserSettingsPageComponent />} />

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
