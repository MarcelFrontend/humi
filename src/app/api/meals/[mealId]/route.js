import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.DB_LINK, { useNewUrlParser: true, useUnifiedTopology: true });
const clientPromise = client.connect();

export async function GET(request, { params }) {
    const mealId = Number(params.mealId);
    const client = await clientPromise;
    const db = client.db('humi');

    const meal = await db.collection('przepis').findOne({ id: mealId });
    if (!meal) return NextResponse.json({ error: 'Meal not found' }, { status: 404 });

    const ingredients = await db.collection('skladniki_przepisu').aggregate([
        { $match: { przepis_id: mealId } },
        {
            $lookup: {
                from: 'skladnik',
                localField: 'skladniki_id',
                foreignField: 'id',
                as: 'skladnik_info'
            }
        },
        { $unwind: '$skladnik_info' },
        {
            $project: {
                skladnik_id: '$skladnik_info.id',
                nazwa: '$skladnik_info.nazwa',
                kalorie: '$skladnik_info.kalorie'
            }
        }
    ]).toArray();

    return NextResponse.json({ meal, ingredients });
}
