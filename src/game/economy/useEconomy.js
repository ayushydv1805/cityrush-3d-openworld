import { useEffect, useState } from "react";
import { loadEconomy, saveEconomy } from "./economyData";

export default function useEconomy() {
  const [economy, setEconomy] = useState(() => loadEconomy());

  useEffect(() => {
    saveEconomy(economy);
  }, [economy]);

  return [economy, setEconomy];
}
