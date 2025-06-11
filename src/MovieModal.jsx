import './MovieModal.css'
import { useState, useEffect } from 'react'

const MovieModal = ({movieID, closeModal}) => {
    const [movie, setMovie] = useState({})
    const [trailers, setTrailers] = useState([])
    const [currentTrailer, setCurrentTrailer] = useState(0)

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

    const fetchTrailers = async (movieID) => {
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
            response = await fetch(`https://api.themoviedb.org/3/movie/${movieID}/videos?language=en-US`, options)
            if (!response.ok) {
                throw new Error('Failed to fetch videos')
            }
            const data = await response.json()
            const trailers = data.results.filter( (video) => {return video.type === "Trailer"})
            setTrailers(trailers)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect( () => {
        fetchMovie(movieID)
        fetchTrailers(movieID)
    }, [])

    // console.log(trailers[currentTrailer].key)
    return (
        <div className='moviemodal' onClick={(e) => closeModal(e)}>
            <div className='moviemodal-content'>
                <button className='moviemodal-close-button' onClick={(e) => closeModal(e)}>×</button>
                <img className='moviemodal-content-image' src={'https://image.tmdb.org/t/p/w500' + movie.poster_path}></img>
                    <div className='moviemodal-content-right'>
                    { trailers.length > 0 && trailers[currentTrailer] ?
                    <section className='movie-modal-content-videos'>
                        <p className='movie-modal-content-videos-numvideos'>Number of trailers: {trailers.length}</p>
                        <iframe alt={trailers[currentTrailer].name} src={`https://www.youtube.com/embed/${trailers[currentTrailer].key}`} allowFullScreen></iframe>
                        <div className='trailer-select'>
                            <button className='decrement-trailer-button' onClick={() => setCurrentTrailer(currentTrailer => {
                                if (currentTrailer - 1 > -1) {
                                    return currentTrailer - 1;
                                } else {
                                    return trailers.length - 1;
                                }
                            })}>&lt;</button>
                            <p className='current-trailer'>{trailers[currentTrailer].name}</p>
                            <button className='increment-trailer-button' onClick={() => {setCurrentTrailer(currentTrailer => ((currentTrailer + 1) % trailers.length))}}>&gt;</button>
                        </div>
                    </section>
                    : null }
                    <section className='moviemodal-content-info'>
                        <h1 className='moviemodal-content-info-name'>{movie.title}</h1>
                        <p className='moviemodal-content-info-overview'>{movie.overview}</p>
                        <p className='moviemodal-content-info-runtime'>Runtime: {movie.runtime} minutes</p>
                        <p className='moviemodal-content-info-releasedate'>Release Date: {movie.release_date}</p>
                        <div className='moviemodal-content-info-genres'>
                            <h2>Genres:</h2>
                            {movie.genres && movie.genres.map( (genreEntry) => {
                                return (
                                    <p key={genreEntry.id} className='moviemodal-content-info-genres-genre'>{genreEntry.name}</p>
                                )
                            })}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default MovieModal