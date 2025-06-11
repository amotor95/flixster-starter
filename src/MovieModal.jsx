import './MovieModal.css'
import { useState, useEffect } from 'react'

const MovieModal = ({movieID, closeModal}) => {
    const [movie, setMovie] = useState({})

    const fetchMovie = async (movieID) => {
        try {
            const apiKey = import.meta.env.VITE_APP_API_KEY
            const options = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${apiKey}`
                }
            };
            let response = null
            response = await fetch(`https://api.themoviedb.org/3/movie/${movieID}`, options)
            if (!response.ok) {
                throw new Error('Failed to fetch movies')
            }
            const data = await response.json()
            setMovie(data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect( () => {
        fetchMovie(movieID)
    }, [])
    return (
        <div className='moviemodal' onClick={(e) => closeModal(e)}>
            <div className='moviemodal-content'>
                <button className='moviemodal-close-button' onClick={(e) => closeModal(e)}>×</button>
                <img className='moviemodal-content-image' src={'https://image.tmdb.org/t/p/w500' + movie.poster_path}></img>
                <div className='moviemodal-content-info'>
                    <h1 className='moviemodal-content-info-name'>{movie.title}</h1>
                    <p className='moviemodal-content-info-name'>{movie.vote_average}</p>
                </div>
            </div>
        </div>
    )
}

export default MovieModal