import React, { useEffect, useState } from 'react'
import { BASE_X_OFFSET, IMAGE_EXCEPTIONS, ANIMATION_PARAMS} from '../constants/constants'

const Row = ({ title, items, isRowFocused }) => {
    const [focusedCell, setFocusedCell] = useState(0) // index of the focused cell
    const numCells = items.length // number of cells in the row

    // handle keypress events to navigate the cells
    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'ArrowLeft' && focusedCell > 0)
                setFocusedCell(prevRow => prevRow - 1)
            else if (event.key === 'ArrowRight' && focusedCell < numCells - 1)
                setFocusedCell(prevRow => prevRow + 1)
            else if (event.key === 'ArrowUp' || event.key === 'ArrowDown')
                setFocusedCell(0) //reset the focused cell if we're moving to another row
        }
        document.addEventListener('keydown', handleKeyPress)
        return () => {
            document.removeEventListener('keydown', handleKeyPress)
        }
    }, [focusedCell, numCells])

    function calculateXOffset() {
        if (isRowFocused) 
            // only scroll if the focused cell is not in the last 5 cells
            if (focusedCell <= numCells - 5) {
                return focusedCell * -BASE_X_OFFSET + 'px';
            } else {
                return (numCells - 5) * -BASE_X_OFFSET + 'px';
            }
        else
            return '0px'
    }

    return (
        <div>
                <div style={{ height: "225px", display: "flex", justifyContent: "left", alignItems: "center", marginBottom: '5px' }}>
                    <div>
                        <p>{title}</p>
                        <div style={{ width: `${numCells * BASE_X_OFFSET}px`, transform: `translateX(${calculateXOffset()})`, transition: ANIMATION_PARAMS, display: 'flex', flexWrap: 'nowrap', marginTop: 15 }}>
                            {items.map((obj, idx) => {
                                // check for broken images
                                if (IMAGE_EXCEPTIONS.includes(obj.img)) {
                                    items.splice(idx, 1) // remove the item from the list
                                } else {
                                    //define the styles for the cell
                                    const isCellFocused = idx === focusedCell && isRowFocused
                                    const scale = isCellFocused ? "1.0" : "0.9";
                                    const opacity = isCellFocused ? "100%" : "70%";
                                    const blurOpacity = isCellFocused ? "100%" : "0%";
                                    const border = isCellFocused ? "2px solid white" : "2px solid transparent";
                                    const shadows = isCellFocused ? "10px 10px 30px black" : "15px 15px 30px black";
                                    return (
                                        <div key={obj.title} style={{ transform: `scale(${scale})`, justifyContent: 'center', transformOrigin: 'center', position: 'relative', marginRight: '20px' }}>
                                            <img
                                                width="300px"
                                                src={obj.img}
                                                alt={obj.title}
                                                style={{ border, opacity, transition: ANIMATION_PARAMS, boxShadow: shadows, position: 'relative', zIndex: 1 }}
                                            />
                                            <img
                                                width="300px"
                                                src={obj.img}
                                                alt={`blur:${obj.title}`}
                                                style={{ opacity: blurOpacity, transition: ANIMATION_PARAMS, position: 'absolute', zIndex: 0, filter: 'blur(9px)', top: 2, left: 2, }}
                                            />
                                        </div>
                                    );
                                }
                            })}
                        </div>
                    </div>
                </div>
        </div>
    )
}

export default Row