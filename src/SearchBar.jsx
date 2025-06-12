import './SearchBar.css'
import { useState } from 'react'

const SearchBar = ({ mode, searchQuery, searchText, searchTextHandler, searchHandler, sortMode, sortHandler, clearHandler }) => {
    return (
        <div className="searchbar">
            { mode === "now-playing" ?
                <div className='searchbar-searchbar'>
                    <input className='searchbar-input' onKeyDown={(e) => { if (e.key === "Enter") {searchHandler(searchText)}}} onChange={(e) => searchTextHandler(e.target.value)} value={searchText} placeholder="Search..."></input>
                    <button className='searchbar-submit' onClick={() => searchHandler(searchText)}>Search</button>
                    { !(searchQuery === "") ? <button className='searchbar-clear' onClick={() => {clearHandler()}}>Clear</button> : null }
                </div> : null
            }
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