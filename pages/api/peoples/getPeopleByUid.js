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

        const peopleGraph = await collection.aggregate([
            {
                $match: {
                    "uid": uid
                }
            },
            {
                $graphLookup: {
                    from: "biblegraphs",
                    startWith: uid,
                    connectFromField: "father",
                    connectToField: "uid",
                    as: "father"
                }
            },
            {
                $graphLookup: {
                    from: "biblegraphs",
                    startWith: uid,
                    connectFromField: "mother",
                    connectToField: "uid",
                    as: "mother"
                }
            },
            {
                $graphLookup: {
                    from: "biblegraphs",
                    startWith: uid,
                    connectFromField: "siblings",
                    connectToField: "uid",
                    as: "siblings"
                }
            },
            {
                $graphLookup: {
                    from: "biblegraphs",
                    startWith: uid,
                    connectFromField: "children",
                    connectToField: "uid",
                    as: "children"
                }
            },
            {
                $graphLookup: {
                    from: "biblegraphs",
                    startWith: uid,
                    connectFromField: "partners",
                    connectToField: "uid",
                    as: "partners"
                }
            }
        ]).toArray();

        let people = removeParentDuplicate(peopleGraph[0], ["father", "mother", "siblings", "children", "partners"], uid)
        res.send({
            data: {
                ...people
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