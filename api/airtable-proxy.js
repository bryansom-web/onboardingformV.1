export default async function handler(req, res) {
  // Solo aceptamos POST
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    // Body que viene del formulario (JSON)
    const payload = req.body || {};

    // URL REAL de tu webhook de Airtable
    const AIRTABLE_WEBHOOK_URL =
      "https://hooks.airtable.com/workflows/v1/genericWebhook/appZu9MszkR6KTMZY/wflfgRWDEox6koBLd/wtrRM9Mr5nAgYQCEX";

    // Llamamos a Airtable desde el servidor (Vercel)
    const airtableRes = await fetch(AIRTABLE_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!airtableRes.ok) {
      const text = await airtableRes.text();
      console.error("Airtable respondió con error:", airtableRes.status, text);
      res
        .status(500)
        .json({ success: false, error: "Airtable error", detail: text });
      return;
    }

    // Todo bien
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error en el proxy de Airtable:", err);
    res.status(500).json({ success: false, error: "Proxy error" });
  }
}
