import './LoadMoreBar.css'

const LoadMoreBar = ( {loadMoreHandler} ) => {
    return (
        <div className='loadmore-bar'>
            <button className='loadmore-button' onClick={loadMoreHandler}>Load More</button>
        </div>
    )
}

export default LoadMoreBar