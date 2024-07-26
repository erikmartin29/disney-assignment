import React, { useEffect, useState } from 'react'
import Row from '../components/Row'
import { fetchData } from '../behaviors/fetchData'

const BASE_Y_OFFSET = 232.5 // Y offset for each row scrolled, 225px image + 5px margin + 2.5px border
const FIRST_CLEAN_ROW = 2 // this is the first row that doesn't have parsing issues
const ANIMATION_PARAMS = "transform 0.25s ease-in-out"; // parameters for the scrolling animation

const HomeScreen = () => {
    const [data, setData] = useState([]) // data for each Row component

    const [focusedRow, setFocusedRow] = useState(FIRST_CLEAN_ROW) // index of the focused row
    const [numRows, setNumRows] = useState(0)

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
            return 0
        else
            return (focusedRow - 5) * -BASE_Y_OFFSET + 'px'
    }

    return (
        <div style={{ transform: `translateY(${calculateYOffset()})`, transition: ANIMATION_PARAMS }}>
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