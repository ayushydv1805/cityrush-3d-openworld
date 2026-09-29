import { useEffect, useState } from "react";
import { loadReputation, saveReputation } from "./reputationData";

export default function useReputation() {
  const [reputation, setReputation] = useState(() => loadReputation());

  useEffect(() => {
    saveReputation(reputation);
  }, [reputation]);

  return [reputation, setReputation];
}
