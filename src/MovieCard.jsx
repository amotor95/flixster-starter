import './MovieCard.css'
import { useState } from 'react'
import MovieModal from './MovieModal'
import { BsEyeSlash, BsEyeFill } from "react-icons/bs";
import { FaStar, FaRegStar } from "react-icons/fa";

const MovieCard = ( {movie, favorites, watched, toggleFavorite, toggleWatched } ) => {
    const [showModal, setShowModal] = useState(false)

    const closeModal = (e) => {
        if (e.currentTarget ===  e.target) {
            setShowModal(false)
        }
    }
    return (
        <div className='moviecard'>
            <div className='moviecard-modalclickable' onClick={() => setShowModal(true)}>
                <img className='moviecard-image' alt={`${movie.title} poster`} src={'https://image.tmdb.org/t/p/w500' + movie.poster_path}></img>
                <p className='moviecard-title'>{movie.title}</p>
                <p className='moviecard-vote'>{movie.vote_average}</p>
            </div>
            <div className='moviecard-buttons'>
                <button className='moviecard-favorite-button' onClick={() => toggleFavorite(movie.id)}>{ favorites.includes(movie.id) ? <FaStar /> : <FaRegStar /> }</button>
                <button className='moviecard-watched-button' onClick={() => toggleWatched(movie.id)}>{ watched.includes(movie.id) ? <BsEyeFill /> : <BsEyeSlash /> }</button>
            </div>
            { showModal ? <MovieModal movieID={movie.id} closeModal={closeModal} /> : null}
        </div>
    )
}

export default MovieCard