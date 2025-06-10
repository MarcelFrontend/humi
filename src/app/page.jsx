"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Page = () => {
  const [mealsData, setMealsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const interStyles = "hover:scale-105 active:scale-95 duration-300";

  const fetchMealsData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/meals`, { cache: 'no-store' });
      const data = await res.json();
      setMealsData(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMealsData();
  }, []);

  if (loading) return <div className="text-center text-lg">Ładowanie...</div>;
  if (error) return <div className="text-red-500">Błąd: {error.message}</div>;
  if (!mealsData || mealsData.length === 0) return <div className="text-center">Brak danych.</div>;

  return (
    <div className="relative flex items-center justify-center flex-col p-4">
      <Link href="/form" className={`absolute left-3 top-3 px-3 py-1 bg-orange-700 rounded-sm ${interStyles}`}>Dodaj przepis</Link>
      {mealsData.map((meal) => (
        <Link href={`/${meal.id}`} key={meal.id} className={`w-[30rem] mb-6 p-4 border rounded-lg shadow-md bg-white ${interStyles}`}>
          <h1 className="text-2xl font-bold text-gray-800">{meal.nazwa}</h1>
          <Image
            src={meal.zdjecie}
            alt={meal.nazwa}
            className="w-full h-auto object-cover rounded-t-lg"
            width={300}
            height={300}
          />
          <p className="text-gray-600">{meal.krotki_opis}</p>
        </Link>
      ))}
    </div>
  );
};

export default Page;
