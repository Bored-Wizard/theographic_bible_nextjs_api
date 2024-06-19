import db from "../../../lib/nedb/index.js";

export default async function handler(req, res) {
    try{
        res.setHeader('Access-Control-Allow-Origin', 'https://ao.bot');
        if (req.method === 'POST') {

            let result = db.find({_id: req.body.id}, (err, newDox) => {
                if (err) throw err
                return newDox
            });

            res.send({
                data: result,
                status: 200
            })
        } else {
            res.status(405).end(); // Method Not Allowed
        }
    }catch(err){
        res.status(500).send({
            data: err,
            status: 500
        })
    }
}