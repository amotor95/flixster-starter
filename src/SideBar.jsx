import './SideBar.css'

const SideBarLinks = ({modeHandler}) => {
    return (
        <div className='sidebar-links'>
            <a className='sidebar-link' onClick={ () => modeHandler("now-playing")}>Now Playing</a>
            <a className='sidebar-link' onClick={ () => modeHandler("favorites")}>Favorites</a>
            <a className='sidebar-link' onClick={ () => modeHandler("watched")}>Watched</a>
        </div>
    )
}

const SideBar = ({modeHandler}) => {
    return (
        <div className='sidebar'>
            <img className='sidebar-image' alt='flixster movie projector logo' src='/movie.png'></img>
            <SideBarLinks modeHandler={modeHandler}></SideBarLinks>
        </div>
    )
}

export default SideBar