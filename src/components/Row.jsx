import React, { useEffect, useState } from 'react'

const allowedTypes = ['CuratedSet','PersonalizedCuratedSet', 'BecauseYouSet', "TrendingSet", "editorial"]

const Row = ({ title, refID }) => {
    const [data, setData] = useState(null)

    // fetch data upon component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                //fetch data from the endpoint
                const response = await fetch(`https://cd-static.bamgrid.com/dp-117731241344/sets/${refID}.json`)
                const json = await response.json()
                
                // figure out what "type" this object is, since the key is dynamic based on the type
                const objKey = Object.keys(json.data).find(key => allowedTypes.includes(key));

                // map the data to a new object to only keep the information we need
                const newData = json.data[objKey].items.map(obj => {
                    // figure out whether it's a series or a program, so we can use the right key when parsing the object
                    const type = Object.keys(obj.text.title.full).find(key => key.includes('series') || key.includes('program'));

                    return {
                        title: obj.text.title.full[type]?.default.content,
                        img: obj.image.tile["1.78"]?.[type]?.default?.url, // ensure we use the 1.78 aspect ratio image
                        type
                    }
                })
                
                setData(newData)
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }
    
        fetchData()
    }, [refID])
    
    return (
        <div>
            <h3>{title}</h3>
            {/*<p>{refID}</p>*/}
            <div style={{ display: 'flex', flexWrap: 'nowrap' }}>
                {data && data.map((obj, idx) => (
                    <div key={obj.title} style={{ flex: '0 0 20%', margin: '10px'}}>
                        <img width="100%" src={obj.img} alt={obj.title} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Row