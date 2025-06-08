"use server"
const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.DB_LINK);
const database = client.db('humi');

const mealsColl = database.collection('przepis');
const mealRecipesColl = database.collection('skladniki_przepisu');

async function fetchIngredients(mealId) {
    const ingredients = await mealRecipesColl.aggregate([
        {
            $match: { przepis_id: mealId }
        },
        {
            $lookup: {
                from: 'skladnik',
                localField: 'skladniki_id',
                foreignField: 'id',
                as: 'skladnik_info'
            }
        },
        {
            $unwind: '$skladnik_info'
        },
        {
            $project: {
                skladnik_id: '$skladnik_info.id',
                nazwa: '$skladnik_info.nazwa',
                kalorie: '$skladnik_info.kalorie'
            }
        }
    ]).toArray();

    return ingredients;
}

export async function getMeals() {
    try {
        const randomMeals = await mealsColl.aggregate([
            { $sample: { size: 10 } }
        ]).toArray();

        return JSON.stringify(randomMeals);
    } catch (e) {
        console.error(e);
        return null;
    }
}

export async function getMealWithIngredients(mealId) {
    try {
        const meal = await mealsColl.findOne({ id: Number(mealId) });
        
        if (!meal) {
            return null;
        }

        const ingredients = await fetchIngredients(Number(mealId));

        return JSON.stringify({
            meal,
            ingredients
        });
    } catch (e) {
        console.error(e);
        return null;
    }
}