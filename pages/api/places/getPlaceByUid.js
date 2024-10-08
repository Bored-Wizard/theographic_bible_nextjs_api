import { removeParentDuplicate } from "@/lib/utils";
import { connectToMongoDB, db } from "../../../lib/mongodb/mongodb";
export default async function handler(req, res) {
    try{
        res.setHeader('Access-Control-Allow-Origin', 'https://ao.bot');
        if(!db){
            await connectToMongoDB();
        }

        const {uid} = req.query;

        const collection = db.collection('biblegraphs');

        const placeGraph = await collection.aggregate([
            {
                $match: {
                    "uid": uid
                }
            },
            {
                $graphLookup: {
                    from: "biblegraphs",
                    startWith: uid,
                    connectFromField: "eventsHere",
                    connectToField: "uid",
                    as: "eventsHere"
                }
            }
        ]).toArray();

        let place = removeParentDuplicate(placeGraph[0], ["eventsHere"], uid)
        res.send({
            data: {
                ...place
            },
            status: 200
        })
    }catch(err){
        res.status(500).send({
            data: err,
            status: 500
        })
    }
}