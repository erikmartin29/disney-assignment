import React, { useEffect, useState } from 'react'

const Row = ({ title, items, isRowFocused }) => {
    const [focusedCell, setFocusedCell] = useState(0) // index of the focused cell
    const numCells = items.length
    const collectionExceptions = ['New to Disney+', 'Collections'] // list of category names to ignore
    const animationParams = "transform 0.25s ease-in-out, opacity 0.35s ease-in";

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
        if (isRowFocused && focusedCell < numCells - 4) // don't move ant further if we're 4 away from the end
            return focusedCell * -324 + 'px' // 300px image + 20px margin
        else
            return isRowFocused ? (numCells - 5) * -324 + 'px' : '0px'
    }

    return (
        <div>
            {!collectionExceptions.includes(title) &&
                <div style={{ height: "225px", display: "flex", justifyContent: "left", alignItems: "center", marginBottom: '5px' }}>
                    <div>
                        <p>{title}</p>
                        <div style={{ width: `${numCells * 320}px`, transform: `translateX(${calculateXOffset()})`, transition: animationParams, display: 'flex', flexWrap: 'nowrap', marginTop: 15 }}>
                            {items.map((obj, idx) => {
                                if (collectionExceptions.includes(obj.title))
                                    return null;
                                else {
                                    //define styles based on whether the cell is focused
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
                                                style={{ border, opacity, transition: animationParams, boxShadow: shadows, position: 'relative', zIndex: 1 }}
                                            />
                                            <img
                                                width="300px"
                                                src={obj.img}
                                                alt={`blur:${obj.title}`}
                                                style={{ opacity: blurOpacity, transition: animationParams, position: 'absolute', zIndex: 0, filter: 'blur(9px)', top: 2, left: 2, }}
                                            />
                                        </div>
                                    );
                                }
                            })}
                        </div>
                    </div>
                </div>}
        </div>
    )
}

export default Row