// Takes a list of movie entries (a list of {id: int, movie: {}}) and sorts alphabetically by title property
export const movieEntriesTitleSort = (movieEntries) => {
    movieEntries.sort((left_entry, right_entry) => {
        if (left_entry[1].title < right_entry[1].title) {return -1;}
        if (left_entry[1].title > right_entry[1].title) {return 1;}
        return 0;
    })
    return movieEntries
}

// Takes a list of movie entries (a list of {id: int, movie: {}}) and sorts by release date property (newest to oldest)
export const movieEntriesReleaseDateSort = (movieEntries) => {
    // Listened to feedback about shortening sorting comparator
    // Note: can't subtract strings in JS
    movieEntries.sort((left_entry, right_entry) => {
        const left_date = new Date(left_entry[1].release_date)
        const right_date = new Date(right_entry[1].release_date)
        return right_date - left_date
    })
    return movieEntries
}

// Takes a list of movie entries (a list of {id: int, movie: {}}) and sorts by vote average property (highest to lowest)
export const movieEntriesVoteAverageSort = (movieEntries) => {
    movieEntries.sort((left_entry, right_entry) => {
        return right_entry[1].vote_average-left_entry[1].vote_average
    })
    return movieEntries
}