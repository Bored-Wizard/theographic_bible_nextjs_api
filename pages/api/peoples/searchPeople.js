import { connectToMongoDB, db } from "../../../lib/mongodb/mongodb";
export default async function handler(req, res) {
    try{
        res.setHeader('Access-Control-Allow-Origin', 'https://ao.bot');
        if(!db){
            await connectToMongoDB();
        }

        const collection = db.collection('biblegraphs');

        const {query} = req.query;

        let people = await collection.find({displayTitle: new RegExp(query, 'i'), type: "people", "timeline.0": {$exists: true}}).toArray()

        people = people.map((item) => {
            return {
                title: item.displayTitle,
                uid: item.uid,
                index: item.personID
            }
        })

        res.send({
            data: [...people],
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