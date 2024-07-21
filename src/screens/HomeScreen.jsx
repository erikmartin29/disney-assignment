import React, { useEffect, useState } from 'react'
import Row from '../components/Row'

const HomeScreen = () => {
    const [data, setData] = useState([])
    const [numRows, setNumRows] = useState(0)
    const [focusedRow, setFocusedRow] = useState(2) // default to 2 because first two rows had parsing issues

    // fetch and parse data from the API on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://cd-static.bamgrid.com/dp-117731241344/home.json')
                const json = await response.json()
                const containers = json.data.StandardCollection.containers

                //map the data to keep only the information we need (titles and images)
                const data = await Promise.all(containers.map(async obj => {
                    if(obj.set.refId) { //fetch the data from the refId if there is one
                        const fetchByRefID = async (refID) => {
                            try {
                                const response = await fetch(`https://cd-static.bamgrid.com/dp-117731241344/sets/${refID}.json`)
                                const json = await response.json()
                               
                                // since the keys vary depending on the group's category, we need to find the right one
                                const keys = ['CuratedSet','PersonalizedCuratedSet', 'BecauseYouSet', "TrendingSet", "editorial"]
                                const objKey = Object.keys(json.data).find(key => keys.includes(key));
                                const showData = json.data[objKey].items.map(obj => {
                                    // figure out whether it's a series or a program, so we can use the right key when parsing the object
                                    const type = Object.keys(obj.text.title.full).find(key => key.includes('series') || key.includes('program'));
                                    return {
                                        title: obj.text.title.full[type].default.content,
                                        img: obj.image.tile["1.78"][type].default.url, // ensure we use the 1.78 aspect ratio image
                                    }
                                })
                                return showData
                            } catch (error) {
                                console.error('Error fetching data:', error)
                            }
                        }

                        return {
                            text: obj.set.text.title.full.set.default.content,
                            items: await fetchByRefID(obj.set.refId)
                        }
                    } else {
                        //if there's no refId, we can just parse the data for the show directly
                        const items = obj.set.items.map(item => {
                            return {
                                title: item.text.title.full.series?.default?.content || item.text.title.full.program?.default?.content,
                                img: item.image.tile["1.78"]?.series?.default?.url || item.image.tile["1.78"]?.program?.default?.url
                            }
                        })

                        return {
                            text: obj.set.text.title.full.set.default.content,
                            items: items                      
                        }
                    }
                }))

                setData(data)
                setNumRows(data.length)
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }
        fetchData()
    }, [])

    // handle keypress events to navigate the rows (and keep within bounds)
    useEffect(() => {
        const handleKeyPress = (event) => {  
            if (event.key === 'w' && focusedRow > 2) // normally this would be 0, but the first two rows had parsing issues
                setFocusedRow(prevRow => prevRow - 1)
            else if (event.key === 's' && focusedRow < numRows - 1)
                setFocusedRow(prevRow => prevRow + 1)
        }
        document.addEventListener('keydown', handleKeyPress)
        return () => { document.removeEventListener('keydown', handleKeyPress)}
    }, [focusedRow, numRows]) //this also needs to keep track of focusedRow since it changes

    //calculate the y-offset for the row based on the focused row
    let yOffset;
    if (focusedRow <= 5) { // no need to scroll until the 5th row is selected
        yOffset = 0
    } else {
        yOffset = (focusedRow - 5) * -225 + 'px'
    }

    const transition = "transform 0.25s ease-in-out, opacity 0.35s ease-in";

    return (
        <div style={{transform: `translateY(${yOffset})`, transition}}>
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