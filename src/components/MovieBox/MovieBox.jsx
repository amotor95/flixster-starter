import SearchBar from '../SearchBar/SearchBar'
import MovieList from '../MovieList/MovieList'
import LoadMoreBar from '../LoadMoreBar/LoadMoreBar'
import './MovieBox.css'
import { useEffect, useState } from 'react'
import { movieEntriesTitleSort, movieEntriesReleaseDateSort, movieEntriesVoteAverageSort } from '../../utils/sortingUtils'
import { fetchMovieByID, fetchMoviesBySearch } from '../../utils/apiUtils'

//review1-branch

const MovieBox = (mode) => {
    // Movies is a dict
    // Decoupled movies and ids to allow O(1) movie retrieval
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
    const [searchText, setSearchText] = useState("")

    // Used for fetching and processing favorites and watched movies
    // Takes in a list of movieIDs, fetches corresponding movies from TMDB
    // Replaces the movies, order, and originalOrder states
    const fetchAndProcessMoviesByIDList = async (movieIDList) => {
        const processMoviesByID = (movieData) => {
            let movieDict = {}
            movieData.map((movie) => movieDict[movie.id] = movie)
            setMovies(movieDict)
            switch (mode.mode) {
                case "favorites":
                    setOriginalOrder(favorites)
                    setOrder(favorites)
                    break
                case "watched":
                    setOriginalOrder(watched)
                    setOrder(watched)
                    break
            }
        }
        const moviePromises = movieIDList.map((movieID) => fetchMovieByID(movieID))
        let movieData = await Promise.all(moviePromises)
        processMoviesByID(movieData)
    }

    // Used for fetching and processing now-playing and searched movies
    // Takes in the page (and searchQuery) states to fetch relevant movies from TMDB
    // Replaces the movies, order, and originalOrder states
    const fetchAndProcessMoviesBySearch = async () => {
        const processMoviesBySearch = (moviesData) => {
            if (moviesData.total_pages === page) {setMorePages(false)}
            let newMovies = {}
            let newOrder = []
            // TMDB seems to be giving 1-2 repeats from the end of the last page on load more
            moviesData.results.map( (movie) => {
                if (!order.includes(movie.id) && !newOrder.includes(movie.id)) {
                    newMovies[movie.id] = movie
                    newOrder.push(movie.id)
                }
            })
            setOriginalOrder([...originalOrder, ...newOrder])
            newMovies = {...movies, ...newMovies}
            newOrder = [...order, ...newOrder]
            setOrder(newOrder)
            setMovies(newMovies)
        }

        let moviesData = await fetchMoviesBySearch(page, searchQuery)
        processMoviesBySearch(moviesData)
    }

    // Sorts movies based on sort mode (either title, release date, or vote average
    // Works on the movies state dict and the order state list
    const sortMovieOrder = () => {
        if (movies.length === 0) {
            return;
        }
        // Split movies dict into keys (id) and values (movie)
        let movieEntries = Object.entries(movies)
        // Listened to feedback about using switch/case for repeated if/else if or where it's easier to read
        switch (sortMode) {
            case "title":
                movieEntriesTitleSort(movieEntries)
                break;
            case "release":
                movieEntriesReleaseDateSort(movieEntries)
                break;
            case "vote":
                movieEntriesVoteAverageSort(movieEntries)
                break;
            case "none":
                setOrder(originalOrder)
                return;
            default:
                console.error("Sort mode not found")
                break
        }
            const newOrder = movieEntries.map( (entry) => entry[0])
            setOrder(newOrder)
    }

    // If mode changes to now-playing, resets relevant states to prevent the favorites/watched movies from lingering
    useEffect(() => {
        if (mode.mode === "now-playing") {
            setOrder([])
            setOriginalOrder([])
            setMovies({})
            setSortMode("none")
            setPage(1)
            setSearchQuery("")
            updateSearchText("")
            setPageCleared(true)
        }
        setSortMode("none")
    }, [mode])

    // Uses the mode change as a trigger to grab the relevant movies for new mode
    // If mode changed to now-playing, needs setPageCleared(true) to load now-playing movies
    // to prevent race conditions mentioned above
    useEffect(() => {
        switch (mode.mode) {
            case "now-playing":
                if(order.length === 0 && pageCleared) {
                    fetchAndProcessMoviesBySearch()
                    setPageCleared(false)
                }
                break
            case "favorites":
                fetchAndProcessMoviesByIDList(favorites)
                break
            case "watched":
                fetchAndProcessMoviesByIDList(watched)
                break
        }
    }, [mode, pageCleared])

    // When Load More is pressed or searchQuery is updated
    useEffect(() => {
        fetchAndProcessMoviesBySearch();
    }, [page, searchQuery])

    // When sortMode is updated or movies is udpated
    // Assures sort after sortMode change AND when Load More adds more movies
    useEffect(() => {
        sortMovieOrder()
    }, [sortMode, movies])

    // Increments page 
    // (note if fetchAndProcessMoviesBySearch() loads last page for searchQuery, Load More button dissapeers)
    const loadMore = () => {
        setPage( (oldPage) => {
            return oldPage + 1;
        })
    }

    // Handles new search term
    // If search term changes, it clears old movies/orders and resets page
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
    
    // Sort mode dropdown handler
    const updateSortMode = (mode) => {
        setSortMode(mode)
    }

    // Sort mode dropdown handler
    const updateSearchText = (text) => {
        setSearchText(text)
    }

    // Clear button handler
    const handleClear = () => {
        updateSortMode("none")
        updateSearchText("")
        updateSearchQuery("")
    }

    // Favorite button handler
    const toggleFavorite = (movieID) => {
        let newFavorites = [...favorites]
        if (newFavorites.includes(movieID)) {
            newFavorites = newFavorites.filter( (id) => {return id !== movieID})
        } else {
            newFavorites.push(movieID)
        }
        setFavorites(newFavorites)
    }

    // Watched button handler
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
            <SearchBar mode={mode.mode} searchQuery={searchQuery} searchText={searchText} searchTextHandler={updateSearchText} searchHandler={updateSearchQuery} sortMode={sortMode} sortHandler={updateSortMode} clearHandler={handleClear}/>
            <MovieList movies={movies} order={order} favorites={favorites} watched={watched} toggleFavorite={toggleFavorite} toggleWatched={toggleWatched}/>
            { mode.mode === "now-playing" && !(Object.values(movies).length == 0) && morePages ? <LoadMoreBar loadMoreHandler={loadMore}/> : <p className='no-more-movies'>End of results...</p> }
        </div>
    )
}

export default MovieBox