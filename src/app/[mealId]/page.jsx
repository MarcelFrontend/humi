"use client"
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

async function getMeal(id) {
  const res = await fetch(`/api/meals/${id}`, { cache: 'no-store' });
  return res.json();
}

const Page = () => {
  const params = useParams();
  const [mealData, setMealData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMealData = async (mealId) => {
    setLoading(true);
    try {
      const data = await getMeal(mealId);
      setMealData(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params?.mealId) {
      fetchMealData(params.mealId);
    }
  }, [params]);

  if (loading) return <div className="text-center text-lg">Ładowanie...</div>;
  if (error) return <div className="text-red-500">Błąd: {error.message}</div>;
  if (!mealData || !mealData.meal) return <div className="text-center">Nie pobrano danych przepisu.</div>;

  return (
    <div className="h-dvh flex items-start flex-col p-1">
      <Link href="/" className="bg-orange-500 font-bold px-4 py-3 rounded-md">Powrót na stronę główną</Link>
      <div className="h-full w-full flex items-center justify-center">
        <div className="w-[30rem] mb-6 p-4 border rounded-lg shadow-md bg-white">
          <h1 className="text-2xl font-bold text-gray-800">{mealData.meal.nazwa}</h1>
          <Image
            src={mealData.meal.zdjecie}
            alt={mealData.meal.nazwa}
            className="w-full h-auto object-cover rounded-t-lg"
            width={300}
            height={300}
          />
          <p className="text-gray-600">{mealData.meal.krotki_opis}</p>
          <h2 className="text-xl font-semibold mt-4 text-gray-700">Składniki:</h2>
          <ul className="list-disc list-inside">
            {mealData.ingredients.map((ingredient) => (
              <li key={ingredient.skladnik_id} className="text-gray-700">
                {ingredient.nazwa} - <span className="font-semibold">{ingredient.kalorie} kcal</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Page;
