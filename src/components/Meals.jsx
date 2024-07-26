import { useState, useEffect } from "react";
import MealItem from "./MealItem";

export default function Meals() {
  const [loadedMeals, setLoadedMeals] = useState([]);

  useEffect(() => {
    async function fetchMeals() {
      const res = await fetch("http://localhost:3000/meals");

      if (!res.ok) {
        console.error("Failed to fetch meals");
        return;
      }

      const meals = await res.json();
      setLoadedMeals(meals);
      console.log(meals);
    }

    fetchMeals();
  }, []);

  return (
    <ul id="meals">
      {loadedMeals.map((meal) => (
        <MealItem key={meal.id} meal={meal} />
      ))}
    </ul>
  );
}
