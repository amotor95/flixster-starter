import './SearchBar.css'
import { useState } from 'react'

const SearchBar = ({ searchQuery, searchHandler, sortMode, sortHandler, clearHandler }) => {
    const [searchText, setSearchText] = useState("")
    return (
        <div className="searchbar">
            <div className='searchbar-searchbar'>
                <input className='searchbar-input' onChange={(e) => setSearchText(e.target.value)} value={searchText} placeholder="Search..."></input>
                <button className='searchbar-submit' onClick={() => searchHandler(searchText)}>Search</button>
                { !(searchQuery === "") ? <button className='searchbar-clear' onClick={() => {setSearchText(""); clearHandler()}}>Clear</button> : null }
            </div>
            <div className='searchbar-sort'>
                <select name="filter" id="searchbar-sort-dropdown" value={sortMode} onChange={(e) => {sortHandler(e.target.value);}}>
                    <option value="none">-</option>
                    <option value="title">Title (A-Z)</option>
                    <option value="release">Release date (chronological)</option>
                    <option value="vote">Vote average (descending)</option>
                </select>
            </div>
        </div>
    )
}

export default SearchBar