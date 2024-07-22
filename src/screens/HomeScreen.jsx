import React, { useEffect, useState } from 'react'
import Row from '../components/Row'
import { fetchData } from '../behaviors/fetchData'

const HomeScreen = () => {
    const [data, setData] = useState([]) // data for each Row component

    const [focusedRow, setFocusedRow] = useState(2) // default to 2 because first two rows had parsing issues
    const [numRows, setNumRows] = useState(0)

    const transition = "transform 0.25s ease-in-out"; // parameters for scrolling animation

    // fetch and parse data from the API on component mount
    useEffect(() => {
        fetchData(setData, setNumRows)
    }, [])

    // handle keypress events to navigate the rows (and keep within bounds)
    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'ArrowUp' && focusedRow > 2) // normally this would be 0, but the first two rows had parsing issues
                setFocusedRow(prevRow => prevRow - 1)
            else if (event.key === 'ArrowDown' && focusedRow < numRows - 1)
                setFocusedRow(prevRow => prevRow + 1)
        }
        document.addEventListener('keydown', handleKeyPress)
        return () => { document.removeEventListener('keydown', handleKeyPress) }
    }, [focusedRow, numRows])

    function calculateYOffset() {
        if (focusedRow <= 5) // no need to scroll down until the 5th row is selected
            return 0;
        else
            return (focusedRow - 5) * -232.5 + 'px'
    }

    return (
        <div style={{ transform: `translateY(${calculateYOffset()})`, transition }}>
            {data && data.map((obj, idx) => (
                <Row
                    title={obj.text}
                    items={obj.items}
                    isRowFocused={focusedRow === idx}
                    key={obj.text}
                />
            ))}
        </div>
    )
}


export default HomeScreen