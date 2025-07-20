
import React, { useState } from "react";
import { verbeterTekst } from "./gptCorrectie";

export default function NoteEditor() {
  const [tekst, setTekst] = useState("");

  const handleVerbeter = async () => {
    const nieuw = await verbeterTekst(tekst);
    setTekst(nieuw);
  };

  return (
    <div>
      <textarea
        value={tekst}
        onChange={(e) => setTekst(e.target.value)}
        placeholder="Typ hier je notitie..."
        rows={10}
        cols={50}
      />
      <br />
      <button onClick={handleVerbeter}>✨ Verbeter Tekst</button>
    </div>
  );
}
