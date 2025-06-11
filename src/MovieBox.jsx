import SearchBar from './SearchBar'
import MovieList from './MovieList'
import LoadMoreBar from './LoadMoreBar'
import { useEffect, useState } from 'react'



const MovieBox = () => {
    const [movies, setMovies] = useState({})
    const [order, setOrder] = useState([])
    const [page, setPage] = useState(1)
    const [morePages, setMorePages] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [sortMode, setSortMode] = useState("none")

    const fetchMovies = async () => {
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
            if (searchQuery === "") {
                response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=${page}&include_adult=false`, options)
            } else {
                response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${searchQuery}&include_adult=false&language=en-US&page=${page}`, options)
            }
            if (!response.ok) {
                throw new Error('Failed to fetch movies')
            }
            const data = await response.json()
            if (data.total_pages === page) {
                setMorePages(false)
            }
            let newMovies = {}
            let newOrder = []
            data.results.map( (movie) => {
                newMovies[movie.id] = movie
                newOrder.push(movie.id)
            })
            newMovies = {...movies, ...newMovies}
            setMovies(newMovies)
            newOrder = [...order, ...newOrder]
            setOrder(newOrder)
        } catch (error) {
            console.error(error)
        }
    }

    const sortMovies = () => {
        // Was creating reference to movies, not a copy, so it wasn't re-rendering
        // Destructuring makes a copy, will recognize sortedMovies as new 
        // So setMovies(sortedMovies) triggers re-render
        if (movies.length === 0) {
            return;
        }
        // Split movies dict into keys (id) and values (movie)
        let movieEntries = Object.entries(movies)
        if (sortMode === "title") {
            movieEntries.sort((left_entry, right_entry) => {
                const left = left_entry[1]
                const right = right_entry[1]
                if (left.title < right.title) {return -1;}
                if (left.title > right.title) {return 1;}
                return 0;
            })
        } else if (sortMode === "release") {
            // Listened to feedback about shortening sorting comparator
            // Note: can't subtract strings in JS
            movieEntries.sort((left_entry, right_entry) => {
                const left = left_entry[1]
                const right = right_entry[1]
                left.date = new Date(left.release_date)
                right.date = new Date(right.release_date)
                return right.date - left.date
            })
        } else if (sortMode === "vote") {
            movieEntries.sort((left_entry, right_entry) => {
                const left = left_entry[1]
                const right = right_entry[1]
                return right.vote_average-left.vote_average
            })
        }
        const newOrder = movieEntries.map( (entry) => entry[0])
        setOrder(newOrder)
    }

    useEffect(() => {
        fetchMovies()
        sortMovies()
    }, [page, searchQuery])

    useEffect(() => {
        sortMovies()
    }, [sortMode])

    const loadMore = () => {
        setPage( (oldPage) => {
            return oldPage + 1;
        })
    }

    const updateSearchQuery = (term) => {
        if (!(term === searchQuery)) {
            setSortMode("none")
            setMovies({})
            setPage(1)
            setSearchQuery(term)
        }
    }

    const updateSortMode = (mode) => {
        setSortMode(mode)
    }

    const handleClear = () => {
        updateSortMode("none")
        updateSearchQuery("")
    }

    return (
        <div className='moviebox'>
            <SearchBar searchQuery={searchQuery} searchHandler={updateSearchQuery} sortMode={sortMode} sortHandler={updateSortMode} clearHandler={handleClear}/>
            <MovieList movies={movies} order={order}/>
            { (!Object.values(movies).length == 0 || !morePages) ? <LoadMoreBar loadMoreHandler={loadMore}/> : null }
        </div>
    )
}

export default MovieBox