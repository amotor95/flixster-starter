import './MovieModal.css'
import { useState, useEffect } from 'react'
import { fetchMovieByID, fetchMovieVideosByID } from '../../utils/apiUtils'

const MovieModal = ({movieID, closeModal}) => {
    const [movie, setMovie] = useState({})
    const [trailers, setTrailers] = useState([])
    const [currentTrailer, setCurrentTrailer] = useState(0)

    const fetchAndProcessMovieDetails = async (movieID) => {
        const movieDetails = await fetchMovieByID(movieID)
        setMovie(movieDetails)
    }

    const fetchAndProcessMovieTrailers = async (movieID) => {
        const movieVideos = await fetchMovieVideosByID(movieID)
        const trailers = movieVideos.results.filter( (video) => {return video.type === "Trailer"})
        setTrailers(trailers)
    }

    useEffect( () => {
        fetchAndProcessMovieDetails(movieID)
        fetchAndProcessMovieTrailers(movieID)
    }, [])

    return (
        <div className='moviemodal' onClick={(e) => closeModal(e)}>
            <div className='moviemodal-content'>
                <button className='moviemodal-close-button' onClick={(e) => closeModal(e)}>×</button>
                <img className='moviemodal-content-image' alt={`${movie.title} poster`} src={'https://image.tmdb.org/t/p/w500' + movie.backdrop_path}></img>
                <section className='moviemodal-content-info'>
                    <h1 className='moviemodal-content-info-name'>{movie.title}</h1>
                    <p className='moviemodal-content-info-overview'>{movie.overview}</p>
                    <p className='moviemodal-content-info-runtime'>Runtime: {movie.runtime} minutes</p>
                    <p className='moviemodal-content-info-releasedate'>Release Date: {movie.release_date}</p>
                    <h2 className='genre-header'>Genres:</h2>
                    <div className='moviemodal-content-info-genres'>
                        {movie.genres && movie.genres.map( (genreEntry) => {
                            return (
                                <p key={genreEntry.id} className='moviemodal-content-info-genres-genre'>{genreEntry.name}</p>
                            )
                        })}
                    </div>
                </section>
                { trailers.length > 0 && trailers[currentTrailer] ?
                <section className='moviemodal-content-videos'>
                    <iframe alt={trailers[currentTrailer].name} src={`https://www.youtube.com/embed/${trailers[currentTrailer].key}`} allowFullScreen></iframe>
                    <div className='trailer-select'>
                        <button className='decrement-trailer-button' onClick={() => setCurrentTrailer(currentTrailer => {
                            if (currentTrailer - 1 > -1) {
                                return currentTrailer - 1;
                            } else {
                                return trailers.length - 1;
                            }
                        })}>&lt;</button>
                        <p className='current-trailer'>{trailers[currentTrailer].name} ({currentTrailer+1}/{trailers.length})</p>
                        <button className='increment-trailer-button' onClick={() => {setCurrentTrailer(currentTrailer => ((currentTrailer + 1) % trailers.length))}}>&gt;</button>
                    </div>
                </section>
                : <p className='no-trailers'>No trailers found!</p> }
            </div>
        </div>
    )
}

export default MovieModal