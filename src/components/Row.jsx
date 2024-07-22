import React, { useEffect, useState } from 'react'

const Row = ({ title, items, isRowFocused }) => {
    const [focusedCell, setFocusedCell] = useState(0)
    const numCells = items.length
    const exceptions = ['New to Disney+', 'Collections'] //list of exceptions whose categories were giving me too much trouble to parse

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

    //calculate the x-offset for the row based on the focused cell
    let xOffset;
    if (isRowFocused && focusedCell < numCells - 4) { // don't move ant further if we're 4 away from the end
        xOffset = focusedCell * -320 + 'px'
    } else {
        xOffset = isRowFocused ? (numCells - 5) * -320 + 'px' : '0px'
    }

    const transition = "transform 0.25s ease-in-out, opacity 0.35s ease-in";
    const blurTransition = "opacity 0.35s ease-in";

    return (
        <div>
            {!exceptions.includes(title) &&
                <div style={{ height: "225px", display: "flex", justifyContent: "left", alignItems: "center", marginBottom: '5px'}}>
                    <div>
                        <p>{title}</p>
                        <div style={{ width: `${numCells * 320}px`, display: 'flex', flexWrap: 'nowrap', transform: `translateX(${xOffset})`, transition, marginTop: 15}}>
                            {items.map((obj, idx) => {
                                if (exceptions.includes(obj.title))
                                    return null;
                                else {
                                    //define styles for both focused and unfocused states
                                    const scale = idx === focusedCell && isRowFocused ? "1.0" : "0.9";
                                    const opacity = idx === focusedCell && isRowFocused ? "100%" : "70%";
                                    const blurOpacity = idx === focusedCell && isRowFocused ? "100%" : "0%";
                                    const border = idx === focusedCell && isRowFocused ? "2px solid white" : "2px solid transparent";
                                    const shadows = idx === focusedCell && isRowFocused ? "10px 10px 30px black" : "15px 15px 30px black";

                                    return (
                                        <div key={obj.title} style={{ justifyContent: 'center', transformOrigin: 'center', transform: `scale(${scale})`, marginRight: '20px', position: 'relative' }}>
                                            <img
                                                width="300px"
                                                src={obj.img}
                                                alt={obj.title}
                                                style={{ border, opacity, transition, boxShadow: shadows, position: 'relative', zIndex: 1 }}
                                            />
                                            <img
                                                width="300px"
                                                src={obj.img}
                                                alt={`blur:${obj.title}`}
                                                style={{ filter: 'blur(7px)', top: 2, left: 2, opacity: blurOpacity, transition: blurTransition, position: 'absolute', zIndex: 0 }}
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