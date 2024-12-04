import { connectToMongoDB, db } from "../../../lib/mongodb/mongodb";

export default async function handler(req, res) {
    try{
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");

        const {userId, userData} = req.body;

        if(!db){
            await connectToMongoDB();
        }

        if(!userId || !userData){
            res.send({
                data: "Invalid Request",
                status: 400
            })
            return
        }

        const collection = db.collection('dataLayerUserHistory');

        let userPrevData = await collection.findOne({userId});

        if(userPrevData){
            await collection.updateOne({userId}, {$set: {data: {...userPrevData.data, [userData.strongs]: userData}}});
        }else{
            await collection.insertOne({
                userId,
                data: {
                    [userData.strongs]: userData
                }
            });
        }

        res.send({
            data: {
                userId,
                userData
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