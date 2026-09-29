import { useEffect, useState } from "react";
import { loadGarage, saveGarage } from "./garageData";

export default function useGarage() {
  const [garage, setGarage] = useState(() => loadGarage());

  useEffect(() => {
    saveGarage(garage);
  }, [garage]);

  return [garage, setGarage];
}
