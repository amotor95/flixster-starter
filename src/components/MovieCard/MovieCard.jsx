import './MovieCard.css'
import { useState } from 'react'
import MovieModal from '../MovieModal/MovieModal'
import { BsEyeSlash, BsEyeFill } from "react-icons/bs";
import { FaStar, FaRegStar } from "react-icons/fa";

const MovieCard = ( {movie, favorites, watched, toggleFavorite, toggleWatched, openModal } ) => {
    return (
        <div className='moviecard'>
            <div className='moviecard-modalclickable' onClick={() => openModal(movie.id)}>
                <img className='moviecard-image' alt={`${movie.title} poster`} src={'https://image.tmdb.org/t/p/w500' + movie.poster_path}></img>
                <p className='moviecard-title'>{movie.title}</p>
                <p className='moviecard-vote'>{movie.vote_average}</p>
            </div>
            <div className='moviecard-buttons'>
                <button className='moviecard-favorite-button' onClick={() => toggleFavorite(movie.id)}>{ favorites.includes(movie.id) ? <FaStar /> : <FaRegStar /> }</button>
                <button className='moviecard-watched-button' onClick={() => toggleWatched(movie.id)}>{ watched.includes(movie.id) ? <BsEyeFill /> : <BsEyeSlash /> }</button>
            </div>
        </div>
    )
}

export default MovieCard