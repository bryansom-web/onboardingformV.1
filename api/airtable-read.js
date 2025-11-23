// api/airtable-read.js
// Lee los últimos registros de Airtable para que el GPT (o tú) puedan analizarlos.

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const baseId = "appW0Wnz7f8pkxDDN"; // ← reemplaza esto
  const tableName = "Imported table"; // ← o el nombre real de tu tabla
  const token = process.env.AIRTABLE_API_TOKEN;

  if (!token) {
    return res.status(500).json({ error: "AIRTABLE_API_TOKEN is not set" });
  }

  try {
    const url = new URL(`https://api.airtable.com/v0/${baseId}/${tableName}`);

    // Opcional: ordenamos por fecha de envío (submittedAt) descendente
    url.searchParams.append("maxRecords", "10");
    url.searchParams.append("sort[0][field]", "submittedAt");
    url.searchParams.append("sort[0][direction]", "desc");

    const airtableRes = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!airtableRes.ok) {
      const text = await airtableRes.text();
      console.error("Airtable error:", airtableRes.status, text);
      return res
        .status(500)
        .json({ error: "Failed to fetch Airtable data", detail: text });
    }

    const data = await airtableRes.json();

    // Devolvemos tal cual los records de Airtable
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error calling Airtable:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
