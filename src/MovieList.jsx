import MovieCard from './MovieCard'
import './MovieList.css'

const MovieList = ( {movies, order, favorites, watched, toggleFavorite, toggleWatched} ) => {
    return (
        <div className="movielist">
            {  
                movies.length === 0 ? <p>No movies found!</p> : 
                movies && order && order.map( (id) => {
                    return <MovieCard key={id} movie={movies[id]} favorites={favorites} watched={watched} toggleFavorite={toggleFavorite} toggleWatched={toggleWatched}/>;
                })
            }
        </div>
    )
}

export default MovieList