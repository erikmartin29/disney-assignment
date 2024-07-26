// fetches and parses data from the API, referencing the refID via additional calls to fetchByRefID if necessary
// takes the setter functions for the data and the number of rows as arguments
export const fetchData = async (setData, setNumRows) => {
    try {
        const response = await fetch('https://cd-static.bamgrid.com/dp-117731241344/home.json');
        const json = await response.json();
        const containers = json.data.StandardCollection.containers;

        //map the data to keep only the information we need (titles and images)
        const data = await Promise.all(containers.map(async (obj) => {
            if (obj.set.refId) { //fetch the data from the refId if there is one
                return {
                    text: obj.set.text.title.full.set.default.content,
                    items: await fetchByRefID(obj.set.refId)
                };
            } else {
                //if there's no refId, we can just parse the data for the show directly
                const items = obj.set.items.map(item => {
                    return {
                        title: item.text.title.full.series?.default?.content || item.text.title.full.program?.default?.content,
                        img: item.image.tile["1.78"]?.series?.default?.url || item.image.tile["1.78"]?.program?.default?.url
                    };
                });

                return {
                    text: obj.set.text.title.full.set.default.content,
                    items: items
                };
            }
        }));

        setData(data);
        setNumRows(data.length);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

// fetches and parses data from the API given the refID
const fetchByRefID = async (refID) => {
    try {
        const response = await fetch(`https://cd-static.bamgrid.com/dp-117731241344/sets/${refID}.json`);
        const json = await response.json();

        // since the keys vary depending on the group's category, we need to find the right one
        const keys = ['CuratedSet', 'PersonalizedCuratedSet', 'BecauseYouSet', "TrendingSet", "editorial"];
        const objKey = Object.keys(json.data).find(key => keys.includes(key));

        const showData = json.data[objKey].items.map(obj => {
            // figure out whether it's a series or a program, so we can use the right key when parsing the object
            const type = Object.keys(obj.text.title.full).find(key => key.includes('series') || key.includes('program'));
            return {
                title: obj.text.title.full[type].default.content,
                img: obj.image.tile["1.78"][type].default.url, // ensure we use the 1.78 aspect ratio image
            };
        });
        return showData;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};
