import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import UserRegistrationComponent from './components/UserRegistrationComponent'
import UserSuccessfulRegisterationComponent from './components/UserSuccessfulRegisterationComponent'
import UserLoginComponent from './components/UserLoginComponent'
import FloorPageComponent from './components/FloorPageComponent'
import RoomsPageComponent from './components/RoomsPageComponent'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<UserLoginComponent />}></Route>
          <Route path='/register' element={<UserRegistrationComponent />}></Route>
          <Route path='/successful-register' element={<UserSuccessfulRegisterationComponent />}></Route>
          <Route path='/welcome'>
            <Route index={true} element={<FloorPageComponent />} />
            <Route index={false} path="/welcome/floors/:floorId/rooms/:roomId" element={<RoomsPageComponent />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
