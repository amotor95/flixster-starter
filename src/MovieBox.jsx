import SearchBar from './SearchBar'
import MovieList from './MovieList'
import LoadMoreBar from './LoadMoreBar'
import { useEffect, useState } from 'react'



const MovieBox = () => {
    const [movies, setMovies] = useState([])
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
            // console.log([...movies, ...data.results])
            setMovies([...movies, ...data.results])
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
        let sortedMovies = [...movies]
        if (sortMode === "title") {
            sortedMovies.sort((left, right) => {
                if (left.title < right.title) {return -1;}
                if (left.title > right.title) {return 1;}
                return 0;
            })
        } else if (sortMode === "release") {
            // Listened to feedback about shortening sorting comparator
            // Note: can't subtract strings/titles in JS
            sortedMovies.sort((left, right) => {
                left.year = parseInt(left.release_date.slice(0, 4))
                right.year = parseInt(right.release_date.slice(0, 4))
                left.month = parseInt(left.release_date.slice(5, 7))
                right.month = parseInt(right.release_date.slice(5, 7))
                left.day = parseInt(left.release_date.slice(8, 10))
                right.day = parseInt(right.release_date.slice(8, 10))
                if (!(right.year === left.year)) {
                    return right.year - left.year
                } else if (!(right.month === left.month)) {
                    return right.month - left.month
                } else {
                    return right.day - left.day
                }
                
            })
        } else if (sortMode === "vote") {
            sortedMovies.sort((left, right) => right.vote_average-left.vote_average)
        }
        setMovies(sortedMovies)
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
            setMovies([])
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
            <MovieList movies={movies}/>
            { (!movies.length == 0 || !morePages) ? <LoadMoreBar loadMoreHandler={loadMore}/> : null }
        </div>
    )
}

export default MovieBox