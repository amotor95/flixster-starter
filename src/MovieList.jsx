import MovieCard from './MovieCard'
import './MovieList.css'

const MovieList = ( {movies} ) => {
    return (
        <div className="movielist">
            { movies.length === 0 ? <p>No movies found!</p> : 
            movies.map( (movie) => {
                return <MovieCard key={movie.id} movie={movie}/>;
            })}
        </div>
    )
}

export default MovieList