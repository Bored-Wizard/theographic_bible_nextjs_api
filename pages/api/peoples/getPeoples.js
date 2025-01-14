import { connectToMongoDB, db } from "../../../lib/mongodb/mongodb";
export default async function handler(req, res) {
    try{
        res.setHeader('Access-Control-Allow-Origin', 'https://ao.bot');
        if(!db){
            await connectToMongoDB();
        }

        const collection = db.collection('biblegraphs');

        const {page, count} = req.query;

        // let places = await collection.find({type: "place"}).sort({placeID: 1}).skip((parseInt(page) - 1) * parseInt(count)).limit(parseInt(count)).toArray();

        // find me the entry with type equal to place and has more than 0 entries in eventsHere field
        let places = await collection.find({type: "people", "timeline.0": {$exists: true}}).sort({placeID: 1}).skip((parseInt(page) - 1) * parseInt(count)).limit(parseInt(count)).toArray();
        let totalPlaces = await collection.find({type: "people", "timeline.0": {$exists: true}}).count();

        places = places.map((item) => {
            return {
                title: item.displayTitle,
                uid: item.uid,
                index: item.placeID
            }
        })

        res.send({
            data: {
                places,
                totalPlaces
            },
            status: 200
        })
    }catch(err){
        console.log(err)
        res.status(500).send({
            data: err,
            status: 500
        })
    }
}