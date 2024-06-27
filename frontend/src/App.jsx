import './App.css'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import UserRegistrationComponent from './components/UserRegistrationComponent'
import UserSuccessfulRegisterationComponent from './components/UserSuccessfulRegisterationComponent'
import UserLoginComponent from './components/UserLoginComponent'
import DeskspotComponent from './components/DeskspotComponent'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element = {<UserLoginComponent />}></Route>
          <Route path='/register' element = { <UserRegistrationComponent />}></Route>
          <Route path='/successful-register' element={ <UserSuccessfulRegisterationComponent/>}></Route>
          <Route path='/welcome' element={
            <DeskspotComponent />
          }></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
