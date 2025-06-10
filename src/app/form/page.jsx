"use client";
import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import Link from 'next/link';

const AddMealForm = () => {
    const [mealName, setNazwa] = useState('');
    const [krotkiOpis, setKrotkiOpis] = useState('');
    const [mealMakingSteps, setMealMakingSteps] = useState(['']);
    const [calories, setCalories] = useState(32);
    const [zlozonosc, setZlozonosc] = useState(43);
    const [mealType, setMealType] = useState('mięsne');
    const [mealMakingTime, setMealMakingTime] = useState('');
    const [mealFromCountry, setMealFromCountry] = useState('amerykańskie');
    const [mealImage, setMealImage] = useState("");
    const [mealIngredients, setMealIngredients] = useState([{ ingredient: '', calories: '' }]);

    const interStyles = "hover:scale-105 active:scale-95 duration-300"

    const validateForm = () => {
        if (!mealName.trim()) {
            alert('Nazwa przepisu jest wymagana');
            return false;
        }
        if (!krotkiOpis.trim()) {
            alert('Krótki opis jest wymagany');
            return false;
        }
        if (mealMakingSteps.some(step => !step.trim())) {
            alert('Wszystkie kroki muszą być uzupełnione');
            return false;
        }
        const cal = Number(calories);
        if (isNaN(cal) || cal < 0) {
            alert('Kalorie muszą być liczbą większą lub równą 0');
            return false;
        }
        const zloz = Number(zlozonosc);
        if (isNaN(zloz) || zloz < 0 || zloz > 100) {
            alert('Złożoność musi być liczbą z zakresu 0-100');
            return false;
        }
        if (!mealMakingTime.trim()) {
            alert('Czas przygotowania jest wymagany');
            return false;
        }
        const timeLower = mealMakingTime.toLowerCase();
        if (
            !(
                timeLower.includes('hour') ||
                timeLower.includes('hr') ||
                timeLower.includes('godz') ||
                timeLower.includes('min') ||
                timeLower.includes('minute')
            )
        ) {
            alert('Czas przygotowania powinien zawierać jednostkę czasu (np. godziny, minuty)');
            return false;
        }
        if (!mealFromCountry.trim()) {
            alert('Pochodzenie jest wymagane');
            return false;
        }
        if (mealIngredients.length === 0) {
            alert('Przepis musi zawierać co najmniej jeden składnik');
            return false;
        }
        if (mealIngredients.some(s => !s.ingredient.trim())) {
            alert('Wszystkie składniki muszą mieć nazwę');
            return false;
        }
        if (mealIngredients.some(s => {
            const kcal = Number(s.calories);
            return isNaN(kcal) || s.calories === '';
        })) {
            alert('Kalorie składników muszą być liczbą');
            return false;
        }
        if (mealImage.trim()) {
            try {
                new URL(mealImage);
            } catch {
                alert('Podany link do zdjęcia jest nieprawidłowy');
                return false;
            }
        }
        return true;
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const mealData = {
            mealName,
            krotkiOpis,
            mealMakingSteps,
            calories: Number(calories),
            zlozonosc: Number(zlozonosc),
            mealType,
            mealMakingTime,
            mealFromCountry,
            mealImage,
            mealIngredients: mealIngredients.map(i => ({
                ingredient: i.ingredient,
                calories: Number(i.calories)
            })),
        };

        emailjs.send('service_tznc19z', 'template_f2nsfai', mealData, "HzGe_rjFUfcpNaEZK")
            .then((res) => {
                console.log("Pomyślnie dodano nowy przepis:", res);
            })
            .catch((err) => {
                console.error('Nie udało się przesłać przepisu:', err);
            });
    };

    return (
        <div className="relative h-dvh flex items-center justify-center">
            <Link href="/" className={`absolute top-4 left-2 bg-orange-500 font-bold px-4 py-3 rounded-md ${interStyles}`}>Powrót na stronę główną</Link>
            <form onSubmit={handleSubmit} className="max-w-96 h-fit flex flex-col gap-1 px-7 py-2 border-2 rounded-lg">
                <h2 className="text-2xl font-bold">Dodaj nowy przepis</h2>
                <div className="flex flex-col gap-1">
                    <label className="self-start">Nazwa:</label>
                    <input
                        type="text"
                        value={mealName}
                        onChange={(e) => setNazwa(e.target.value)}
                        required
                        className="max-w-32 p-2 border border-gray-400 rounded"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="self-start">Krótki opis:</label>
                    <textarea
                        value={krotkiOpis}
                        onChange={(e) => setKrotkiOpis(e.target.value)}
                        required
                        className="w-64 max-w-96 p-2 border border-gray-400 rounded"
                    />
                </div>
                <div className="flex items-start flex-col gap-1 mb-2">
                    <label className="self-start">Lista kroków:</label>
                    <div className="max-h-64 flex flex-col gap-2 overflow-y-auto py-2 px-3">
                        {mealMakingSteps.map((krok, index) => (
                            <input
                                key={index}
                                type="text"
                                value={krok}
                                onChange={(e) => {
                                    const newListaKrokow = [...mealMakingSteps];
                                    newListaKrokow[index] = e.target.value;
                                    setMealMakingSteps(newListaKrokow);
                                }}
                                className="max-w-44 p-2 border border-gray-400 rounded"
                            />
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={() => setMealMakingSteps([...mealMakingSteps, ''])}
                        className="mt-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Dodaj krok
                    </button>
                </div>
                <ul className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <label className="">Kalorie:</label>
                        <input
                            type="number"
                            value={calories}
                            placeholder="0"
                            onChange={(e) => setCalories(e.target.value)}
                            min="0"
                            className="max-w-32 p-2 border border-gray-400 rounded"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <label className="">Złożoność:</label>
                        <input
                            type="number"
                            value={zlozonosc}
                            placeholder="0"
                            onChange={(e) => setZlozonosc(e.target.value)}
                            className="max-w-32 p-2 border border-gray-400 rounded"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <label className="">Typ:</label>
                        <select
                            value={mealType}
                            onChange={(e) => setMealType(e.target.value)}
                            className="max-w-32 p-2 border border-gray-400 rounded"
                        >
                            <option className="text-black bg-white" value="mięsne">Mięsne</option>
                            <option className="text-black bg-white" value="wegetariańskie">Wegetariańskie</option>
                            <option className="text-black bg-white" value="wegańskie">Wegańskie</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-3">
                        <label className="">Czas:</label>
                        <input
                            type="text"
                            value={mealMakingTime}
                            placeholder="2hrs 32min"
                            onChange={(e) => setMealMakingTime(e.target.value)}
                            className="max-w-32 p-2 border border-gray-400 rounded"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <label className="">Pochodzenie:</label>
                        <input
                            type="text"
                            value={mealFromCountry}
                            onChange={(e) => setMealFromCountry(e.target.value)}
                            className="max-w-32 p-2 border border-gray-400 rounded"
                        />
                    </div>
                    <div className="flex flex-col gap-3">
                        <label className="">Zdjęcie:</label>
                        <input
                            placeholder="Proszę wpisać link do zdjęcia."
                            type="text"
                            onChange={(e) => setMealImage(e.target.value)}
                            className="max-w-64 p-2 border border-gray-400 rounded"
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <label className="">Składniki przepisu:</label>
                        <div className="max-h-64 flex flex-col gap-2 overflow-y-auto py-2 px-3">
                            {mealIngredients.map((skladnik, index) => (
                                <div key={index} className="flex mb-2">
                                    <input
                                        type="text"
                                        placeholder="Nazwa składnika"
                                        value={skladnik.ingredient}
                                        onChange={(e) => {
                                            const newSkladniki = [...mealIngredients];
                                            newSkladniki[index].ingredient = e.target.value;
                                            setMealIngredients(newSkladniki);
                                        }}
                                        className="w-3/4 p-2 border border-gray-400 rounded mr-2"
                                    />
                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="Cal"
                                        value={skladnik.calories}
                                        onChange={(e) => {
                                            const newSkladniki = [...mealIngredients];
                                            newSkladniki[index].calories = e.target.value;
                                            setMealIngredients(newSkladniki);
                                        }}
                                        className="w-1/4 p-2 border border-gray-400 rounded"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setMealIngredients([...mealIngredients, { ingredient: '', calories: '' }])}
                        className="self-start p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Dodaj składnik
                    </button>
                </ul>
                <button
                    type="submit"
                    className={`p-2 bg-green-500 text-white rounded hover:bg-green-600 hover:cursor-pointer mt-3 mb-1 ${interStyles}`}>
                    Dodaj przepis
                </button>
            </form>
        </div>
    );
};

export default AddMealForm;
