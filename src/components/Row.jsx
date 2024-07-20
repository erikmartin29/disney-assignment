import React, { useEffect, useState } from 'react'

const Row = ({ title, items, isRowFocused }) => {
    const [focusedCell, setFocusedCell] = useState(0)
    const numCells = items.length
    const exceptions = ['New to Disney+', 'Collections'] //list of exceptions whose categories were giving me too much trouble to parse

    // handle keypress events to navigate the cells
    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'a' && focusedCell > 0)
                setFocusedCell(prevRow => prevRow - 1)
            else if (event.key === 'd' && focusedCell < numCells - 1)
                setFocusedCell(prevRow => prevRow + 1)
            else if (event.key === 'w' || event.key === 's')
                setFocusedCell(0) //reset the focused cell if we're moving to another row
        }
        document.addEventListener('keydown', handleKeyPress)
        return () => {
            document.removeEventListener('keydown', handleKeyPress)
        }
    }, [focusedCell, numCells])

    //calculate the x-offset for the row based on the focused cell
    let xOffset = 0;
    if (isRowFocused && focusedCell < numCells - 4) { // don't move ant further if we're 4 away from the end
        xOffset = focusedCell * -300 + 'px'
    } else {
        xOffset = isRowFocused ? (numCells - 5) * -300 + 'px' : '0px'
    }

    const transition = "transform 0.2s ease-in-out, opacity 0.2s ease-in-out";

    return (
        <div id="row">
            {!exceptions.includes(title) && 
                <div style={{ height: '225px' }}>
                    <p width="100px" class={`justify-left text-left ${isRowFocused ? 'font-extrabold' : ''}`}>{title}</p>
                    <div style={{ display: 'flex', flexWrap: 'nowrap', transform: `translateX(${xOffset})`, transition }}>
                        { items.map((obj, idx) => {
                            if (exceptions.includes(obj.title))
                                return null;
                            else {
                                //define styles for both focused and unfocused states
                                const scale = idx === focusedCell && isRowFocused ? "1.0" : "0.90";
                                const opacity = idx === focusedCell && isRowFocused ? "100%" : "50%";
                                const border = idx === focusedCell && isRowFocused ? "2px solid white" : "2px solid transparent";
                                const shadows = idx === focusedCell && isRowFocused ? "10px 10px 30px black" : "none";

                                return (
                                    <div key={obj.title} style={{ flex: "row" , justifyContent: 'center' }}>
                                        <img
                                            width="300px"
                                            src={obj.img}
                                            alt={obj.title}
                                            style={{ transformOrigin: 'center', transform: `scale(${scale})`, opacity, border, transition, boxShadow: shadows }}
                                        />
                                    </div>
                                );
                            }
                        })}
                    </div> 
            </div>}
        </div>
    )
}

export default Row