export const fetchMovieByID = async (movieID) => {
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
        response = await fetch(`https://api.themoviedb.org/3/movie/${movieID}?language=en-US`, options)
        if (!response.ok) {throw new Error('Failed to fetch movie by ID')}
        const data = await response.json()
        return data
    } catch (error) {
        console.error(error)
    }
}

export const fetchMoviesBySearch = async (page, searchQuery) => {
    const buildMovieSearchURL = (page, searchQuery) => {
        return searchQuery === ""
        ? `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=${page}&include_adult=false`
        :`https://api.themoviedb.org/3/search/movie?query=${searchQuery}&include_adult=false&language=en-US&page=${page}`
    }
    try {
        const apiKey = import.meta.env.VITE_APP_API_KEY
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${apiKey}`
            }
        };
        const searchURL = buildMovieSearchURL(page, searchQuery)
        let response = await fetch(searchURL, options)
        if (!response.ok) {throw new Error('Failed to fetch movies by search')}
        const data = await response.json()
        return data
    } catch (error) {
        console.error(error)
    }
}

export const fetchMovieVideosByID = async (movieID) => {
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
        return data
    } catch (error) {
        console.error(error)
    }
}