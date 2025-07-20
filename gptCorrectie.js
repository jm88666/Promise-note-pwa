
export async function verbeterTekst(tekst) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Verbeter grammatica, spelling en stijl van deze tekst. Verander de betekenis niet.",
        },
        {
          role: "user",
          content: tekst,
        },
      ],
    }),
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content || tekst;
}
