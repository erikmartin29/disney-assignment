import React, { useEffect, useState } from 'react'
import Row from '../components/Row'

const HomeScreen = () => {
    const [data, setData] = useState([])

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
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }
        fetchData()
    }, [])

    return (
        <div>
            {data && data.map(obj => (
                <Row title={obj.text} refID={obj.refID} key={obj.refID} />
            ))}
        </div>
    )
}

export default HomeScreen