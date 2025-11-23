// api/airtable-read.js
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const baseId = "appW0Wnz7f8pkxDDN";      // ✅ este ya sabemos que está bien
  const tableName = "Imported table";      // nombre exacto de la tabla
  const token = process.env.AIRTABLE_API_TOKEN;  // 👈 importante

  if (!token) {
    return res.status(500).json({ error: "AIRTABLE_API_TOKEN is not set" });
  }

  try {
    const url = new URL(`https://api.airtable.com/v0/${baseId}/${tableName}`);
    url.searchParams.append("maxRecords", "10");

    const airtableRes = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,   // 👈 así debe ir
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
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error calling Airtable:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
