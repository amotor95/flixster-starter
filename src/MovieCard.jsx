import './MovieCard.css'
import { useState } from 'react'
import MovieModal from './MovieModal'

const MovieCard = ( {movie} ) => {
    const [showModal, setShowModal] = useState(false)

    const closeModal = (e) => {
        if (e.currentTarget ===  e.target) {
            setShowModal(false)
        }
    }

    return (
        <div className='moviecard'>
            <div className='moviecard-clickable' onClick={() => setShowModal(true)}>
                <img className='moviecard-image' src={'https://image.tmdb.org/t/p/w500' + movie.poster_path}></img>
                <p className='moviecard-title'>{movie.title}</p>
                <p className='moviecard-vote'>{movie.vote_average}</p>
            </div>
            { showModal ? <MovieModal movieID={movie.id} closeModal={closeModal} /> : null}
        </div>
    )
}

export default MovieCard