import { useState } from 'react'
import './App.css'
import SideBar from './SideBar'
import MovieBox from './MovieBox'

const App = () => {
  const [mode, setMode] = useState("now-playing")
  const [showSidebar, setShowSidebar] = useState(true)

  const handleModeChange = (newMode) => {
    setMode(newMode)
  }
  

  return (
    <div className="App">
        
        { showSidebar ? <SideBar modeHandler={handleModeChange}/> : null}
        <div className="content">
          <header>
            <div className='header-text'>
              <h1 className='flixster-title'>Flixster</h1>
              {/* Says banner component unrecognized in this browser */}
              <div className='banner'>Welcome to Flixster!</div>
            </div>
          </header>
          <main>
            <MovieBox mode={mode}/>
          </main>
          <footer className='footer'>
            <p className='footer-text'>By Jack McClure 2025</p>
          </footer>
        </div>
    </div>
  )
}

export default App
