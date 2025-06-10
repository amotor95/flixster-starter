import './MovieCard.css'

const MovieCard = ( {movie} ) => {
    return (
        <div className='moviecard'>
            <img className='moviecard-image' src={'https://image.tmdb.org/t/p/w500' + movie.poster_path}></img>
            <p className='moviecard-title'>{movie.title}</p>
            <p className='moviecard-vote'>{movie.vote_average}</p>
        </div>
    )
}

export default MovieCard