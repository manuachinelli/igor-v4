export default async function sendToIgor(userId: string, message: string): Promise<string> {
  const res = await fetch("https://manuachinelli.app.n8n.cloud/webhook/d6a72405-e6de-4e91-80da-9219b57633dd", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ userId, message })
  });

  if (!res.ok) throw new Error("Error al comunicarse con Igor");

  const data = await res.json();
  return data.reply;
}
