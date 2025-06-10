import { useState } from 'react'
import './App.css'
import SideBar from './SideBar'
import MovieBox from './MovieBox'

const App = () => {
  // const [mode, setMode] = useState("home")

  const handleModeChange = ({newMode}) => {
    // console.log("new mode: " + newMode)
    // setMode(newMode)
  }

  return (
    <div className="App">
      <SideBar modeHandler={handleModeChange}/>
      <main>
        <h1 className='flixster-title'>Flixster</h1>
        <MovieBox/>
        <div className='footer'>
          <p className='footer-text'>By Jack McClure 2025</p>
        </div>
      </main>
    </div>
  )
}

export default App
