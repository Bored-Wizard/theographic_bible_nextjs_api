import { connectToMongoDB, db } from "../../../lib/mongodb/mongodb";

export default async function handler(req, res) {
    try{
        res.setHeader('Access-Control-Allow-Origin', '*');

        const {userId} = req.query;

        if(!db){
            await connectToMongoDB();
        }

        if(!userId){
            res.send({
                data: "Invalid Request",
                status: 400
            })
            return
        }

        const collection = db.collection('dataLayerUserHistory');
        
        const userHistory = await collection.findOne({userId});

        if(!userHistory){
            res.status(400).send({
                data: "Invalid Request",
                status: 400
            })
            return
        }

        res.send({
            data: userHistory,
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