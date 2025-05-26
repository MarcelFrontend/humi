"use client"
import React, { useEffect, useState } from 'react';
import { getMealsWithIngredients } from './backend';

const Page = () => {
  const [mealsData, setMealsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMealsData = async () => {
    setLoading(true);
    try {
      const val = await getMealsWithIngredients();
      setMealsData(JSON.parse(val));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMealsData();
  }, []);

  if (loading) {
    return <div className="text-center text-lg">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>
  }

  if (!mealsData || mealsData.length === 0) {
    return <div className="text-center">No meal data available.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {mealsData.map(({ meal, ingredients, image }) => (
        <div key={meal.id} className="mb-6 p-4 border rounded-lg shadow-md bg-white">
          <h1 className="text-2xl font-bold text-gray-800">{meal.nazwa}</h1>
          {image ? (
            <img
              src={`data:image/jpeg;base64,${image}`}
              alt={meal.nazwa}
              className="w-full h-48 object-cover rounded-t-lg"
            />
          ) : (
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-red-500">Brak zdjęcia</span>
            </div>
          )}

          <p className="text-gray-600">{meal.krotki_opis}</p>
          <h2 className="text-xl font-semibold mt-4">Składniki:</h2>
          <ul className="list-disc list-inside">
            {ingredients.map((ingredient) => (
              <li key={ingredient.skladnik_id} className="text-gray-700">
                {ingredient.nazwa} - <span className="font-semibold">{ingredient.kalorie} kcal</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default Page;
