"use server"
const { MongoClient, ObjectId } = require("mongodb");

const client = new MongoClient(process.env.DB_LINK);
const database = client.db('humi');

const dbCollectionMeals = database.collection('przepis');
const dbCollectionIngredients = database.collection('skladnik');
const dbCollectionRecipeIngredients = database.collection('skladniki_przepisu');
const dbCollectionImages = database.collection('fs.files');
const dbCollectionChunks = database.collection('fs.chunks');

async function fetchIngredients(mealId) {
    const ingredients = await dbCollectionRecipeIngredients.aggregate([
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

async function fetchImageById(imageId) {
    if (!imageId) {
        return null;
    }

    const image = await dbCollectionImages.findOne({ _id: new ObjectId(imageId) });
    if (!image) {
        return null;
    }

    const chunks = await dbCollectionChunks.find({ files_id: image._id }).toArray();
    if (chunks.length === 0) {
        return null;
    }

    // Łączenie danych binarnych w jeden bufor
    const imageData = Buffer.concat(chunks.map(chunk => chunk.data)).toString('base64');
    return imageData; // Zwracamy dane w formacie Base64
}

export async function getIngredientsForMeal(mealId) {
    try {
        const ingredients = await fetchIngredients(mealId);
        return JSON.stringify(ingredients);
    } catch (e) {
        console.error(e);
        return null;
    }
}

export async function getMealWithIngredients(mealId) {
    try {
        const meal = await dbCollectionMeals.findOne({ id: mealId });
        if (!meal) {
            return null;
        }

        const ingredients = await fetchIngredients(mealId);
        return JSON.stringify({
            meal,
            ingredients
        });
    } catch (e) {
        console.error(e);
        return null;
    }
}

export async function getRandomMealsWithIngredients() {
    try {
        const randomMeals = await dbCollectionMeals.aggregate([
            { $sample: { size: 10 } }
        ]).toArray();

        const mealsWithIngredients = await Promise.all(randomMeals.map(async (meal) => {
            const ingredients = await fetchIngredients(meal.id);
            return {
                meal,
                ingredients
            };
        }));

        return JSON.stringify(mealsWithIngredients);
    } catch (e) {
        console.error(e);
        return null;
    }
}

export async function getMealsWithIngredients() {
    try {
        const randomMeals = await dbCollectionMeals.aggregate([
            { $sample: { size: 10 } }
        ]).toArray();

        const mealsWithIngredients = await Promise.all(randomMeals.map(async (meal) => {
            const ingredients = await fetchIngredients(meal.id);
            const imageBase64 = await fetchImageById(meal.id);
            return {
                meal,
                ingredients,
                image: imageBase64
            };
        }));

        return JSON.stringify(mealsWithIngredients);
    } catch (e) {
        console.error(e);
        return null;
    }
}