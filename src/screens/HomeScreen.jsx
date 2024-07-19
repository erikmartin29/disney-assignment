import React, { useEffect, useState } from 'react'
import Row from '../components/Row'

const HomeScreen = () => {
    const [data, setData] = useState([])
    const [numRows, setNumRows] = useState(0)
    const [selectedRow, setSelectedRow] = useState(0)

    useEffect(() => {
        const fetchData = async () => {
            try {
                // fetch data from the endpoint
                const response = await fetch('https://cd-static.bamgrid.com/dp-117731241344/home.json')
                const json = await response.json()
                
                // apply a filter so that we are only including data in the format we want (no meta field is our indicator)
                const filteredData = json.data.StandardCollection.containers.filter(obj => !obj.set.meta)

                // map the filtered data to a new object to only keep the information we need
                const newData = filteredData.map(obj => {
                    return {
                        text: obj.set.text.title.full.set.default.content,
                        refID: obj.set.refId
                    }
                })

                setData(newData)
                setNumRows(newData.length)
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }
        fetchData()
    }, [])

    // handle keypress events to navigate the rows (keeps within bounds)
    useEffect(() => {
        const handleKeyPress = (event) => {  
            if (event.key === 'w' && selectedRow > 0) {
                setSelectedRow(prevRow => prevRow - 1)
            } else if (event.key === 's' && selectedRow < numRows - 1) {
                setSelectedRow(prevRow => prevRow + 1)
            }
        }
        document.addEventListener('keydown', handleKeyPress)
        return () => {
            document.removeEventListener('keydown', handleKeyPress)
        }
    }, [selectedRow, numRows])

    return (
        <div>
            {data && data.map((obj, idx) => (
                <Row title={obj.text} refID={obj.refID} isRowSelected={selectedRow === idx} key={obj.refID} />
            ))}
        </div>
    )
}

export default HomeScreen