import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.DB_LINK, { useNewUrlParser: true, useUnifiedTopology: true });

export async function GET() {
    await client.connect();
    const database = client.db('humi');
    const mealsColl = database.collection('przepis');

    const randomMeals = await mealsColl.aggregate([{ $sample: { size: 10 } }]).toArray();
    return NextResponse.json(randomMeals);
}