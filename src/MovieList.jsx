import MovieCard from './MovieCard'
import './MovieList.css'

const MovieList = ( {movies, order} ) => {
    return (
        <div className="movielist">
            { movies.length === 0 ? <p>No movies found!</p> : 
            order.map( (id) => {
                // console.log(movies[id])
                return <MovieCard key={id} movie={movies[id]}/>;
            })}
        </div>
    )
}

export default MovieList