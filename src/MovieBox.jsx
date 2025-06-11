import SearchBar from './SearchBar'
import MovieList from './MovieList'
import LoadMoreBar from './LoadMoreBar'
import { useEffect, useState } from 'react'



const MovieBox = (mode) => {
    const [movies, setMovies] = useState({})
    const [originalOrder, setOriginalOrder] = useState([])
    const [order, setOrder] = useState([])
    const [page, setPage] = useState(1)
    const [morePages, setMorePages] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [sortMode, setSortMode] = useState("none")
    const [favorites, setFavorites] = useState([324544, 541671])
    const [watched, setWatched] = useState([447273])
    const [pageCleared, setPageCleared] = useState(false)

    const fetchMovieList = async (movieIDList) => {
        const fetchMovie = async (movieID) => {
            const apiKey = import.meta.env.VITE_APP_API_KEY
            const options = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${apiKey}`
                }
            };
            let response = null
            response = await fetch(`https://api.themoviedb.org/3/movie/${movieID}?language=en-US`, options)
            if (!response.ok) {
                throw new Error('Failed to fetch movies')
            }
            const data = await response.json()
            return data
        }
        const promises = movieIDList.map((movieID) => fetchMovie(movieID))
        let movieList = await Promise.all(promises)
        let movieDict = {}
        movieList.map((movie) => movieDict[movie.id] = movie)
        setMovies(movieDict)
        if (mode.mode === "favorites") {
            setOriginalOrder(favorites)
            setOrder(favorites)
        }  else if (mode.mode === "watched") {
            setOriginalOrder(watched)
            setOrder(watched)
        }
    }

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
            // TMDB seems to be giving 1-2 repeats from the end of the last page on load more
            data.results.map( (movie) => {
                if (!order.includes(movie.id) && !newOrder.includes(movie.id)) {
                    newMovies[movie.id] = movie
                    newOrder.push(movie.id)
                }
            })
            setOriginalOrder([...originalOrder, ...newOrder])
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
        if (sortMode==="none") {
            setOrder(originalOrder)
        } else {
            const newOrder = movieEntries.map( (entry) => entry[0])
            setOrder(newOrder)
        }
    }

    // useEffect(() => {
    //     if (mode.mode === "now-playing") {
    //         updateSearchQuery("")
    //     }
    // }, [mode])

    useEffect(() => {
        if (mode.mode === "now-playing") {
            setOrder([])
            setOriginalOrder([])
            setMovies({})
            setSortMode("none")
            setPage(1)
            setSearchQuery("")
            setPageCleared(true)
        }
    }, [mode])

    // By waiting for order to trigger and then fetching movies it assures the order is cleared for swap to favorites/watched -> now-playing
    // Also used a pageCleared state to only fetchMovies() once relevant variables are cleared
    useEffect(() => {
        if (mode.mode === "now-playing" && order.length === 0) {
            if (pageCleared) {
                fetchMovies()
            }
            setPageCleared(false)
        } else if (mode.mode === "favorites") {
            fetchMovieList(favorites)
        } else if (mode.mode === "watched") {
            fetchMovieList(watched)
        }
    }, [mode, pageCleared])

    useEffect(() => {
        fetchMovies();
    }, [page, searchQuery])

    useEffect(() => {
        sortMovies()
    }, [sortMode, movies])

    const loadMore = () => {
        setPage( (oldPage) => {
            return oldPage + 1;
        })
    }

    const updateSearchQuery = (term) => {
        if (!(term === searchQuery)) {
            setSortMode("none")
            setOrder([])
            setOriginalOrder([])
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

    const toggleFavorite = (movieID) => {
        let newFavorites = [...favorites]
        if (newFavorites.includes(movieID)) {
            newFavorites = newFavorites.filter( (id) => {return id !== movieID})
            console.log(movieID)
        } else {
            newFavorites.push(movieID)
        }
        setFavorites(newFavorites)
    }

    const toggleWatched = (movieID) => {
        let newWatched = [...watched]
        if (newWatched.includes(movieID)) {
            newWatched = newWatched.filter( (id) => {return id !== movieID})
        } else {
            newWatched.push(movieID)
        }
        setWatched(newWatched)
    }

    return (
        <div className='moviebox'>
            { mode.mode === "now-playing" ? <SearchBar searchQuery={searchQuery} searchHandler={updateSearchQuery} sortMode={sortMode} sortHandler={updateSortMode} clearHandler={handleClear}/> : null }
            <MovieList movies={movies} order={order} favorites={favorites} watched={watched} toggleFavorite={toggleFavorite} toggleWatched={toggleWatched}/>
            { mode.mode === "now-playing" && (!Object.values(movies).length == 0 || !morePages) ? <LoadMoreBar loadMoreHandler={loadMore}/> : null }
        </div>
    )
}

export default MovieBox