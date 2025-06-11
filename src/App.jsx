import { useState } from 'react'
import './App.css'
import SideBar from './SideBar'
import MovieBox from './MovieBox'

const App = () => {
  const [mode, setMode] = useState("home")

  const handleModeChange = ({newMode}) => {
    // console.log("new mode: " + newMode)
    // setMode(newMode)
  }
  

  return (
    <div className="App">
      <main>
        <header>
          <img className='header-image' src='./src/assets/movie-projector-logo.jpg'></img>
          <div className='header-text'>
            <h1 className='flixster-title'>Flixster</h1>
            {/* Says banner component unrecognized in this browser */}
            <div className='banner'>Welcome to Flixster!</div>
          </div>
        </header>
        <MovieBox/>
        <footer className='footer'>
          <p className='footer-text'>By Jack McClure 2025</p>
        </footer>
      </main>
    </div>
  )
}

export default App
