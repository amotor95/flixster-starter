import MovieCard from '../MovieCard/MovieCard'
import './MovieList.css'
import MovieModal from '../MovieModal/MovieModal'
import { useState } from 'react'

const MovieList = ( {movies, order, favorites, watched, toggleFavorite, toggleWatched} ) => {
    const [showModal, setShowModal] = useState(false)
    const [modalMovieID, setModalMovieID] = useState(0)

    const closeModal = (e) => {
        if (e.currentTarget ===  e.target) {
            setShowModal(false)
        }
    }
    const openModal = (id) => {
        setModalMovieID(id)
        setShowModal(true)
    }

    return (
        <div className="movielist">
            {   
                movies.length === 0 ? <p>No movies found!</p> : 
                movies && order && order.map( (id) => {
                    return <MovieCard key={id} movie={movies[id]} favorites={favorites} watched={watched} toggleFavorite={toggleFavorite} toggleWatched={toggleWatched} openModal={openModal}/>
                })
            }
            { showModal ? <MovieModal movieID={modalMovieID} closeModal={closeModal} /> : null}
        </div>
    )
}

export default MovieList