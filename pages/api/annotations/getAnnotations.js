import { connectToMongoDB, db } from "../../../lib/mongodb/mongodb";

export default async function handler(req, res) {
    try{
        res.setHeader('Access-Control-Allow-Origin', 'https://ao.bot');

        if(!db){
            await connectToMongoDB();
        }

        // changed name to title for the sake of consistency
        const {page, count, query, date} = req.query;

        const collection = db.collection('annotation');

        if(!page || !count || (!query && !date)){
            res.send({
                data: "Invalid Request",
                status: 400
            })
            return
        }

        // find a document based on the _id field
        // const annotations = await collection.find({title}).toArray();

        // find documents and sort them according to title field and title should not be null
        if(query){
            const annotations = await collection.find({title: {$ne: null},title: new RegExp(query, 'i')}).sort({title: 1}).skip((parseInt(page) - 1) * parseInt(count)).limit(parseInt(count)).toArray();
            const nextAnnotations = await collection.find({title: {$ne: null},title: new RegExp(query, 'i')}).sort({title: 1}).skip((parseInt(page)) * parseInt(count)).limit(parseInt(count)).toArray();

            res.send({
                data: annotations,
                nextCount: nextAnnotations.length,
                status: 200
            })
        }else if(date){
            console.log(date)
            let today = date - 1;
            let tomorrow = date + 1;
            const annotations = await collection.find({createdAt: {$gte: today}}).toArray();
            const nextAnnotations = await collection.find({createdAt: {$eq: date}}).skip((parseInt(page)) * parseInt(count)).limit(parseInt(count)).toArray();
            res.send({
                data: annotations,
                nextCount: nextAnnotations.length,
                status: 200
            })
        }
    }catch(err){
        console.log(err)
        res.status(500).send({
            data: err,
            status: 500
        })
    }
}