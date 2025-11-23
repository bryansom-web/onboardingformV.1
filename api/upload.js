import { put } from "@vercel/blob";

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  try {
    const filename = req.query.filename || "file";

    const blob = await put(filename, req, {
      access: "public",
      addRandomSuffix: true,   // 👈 clave para evitar el error
      // si quisieras permitir sobrescribir en lugar de esto:
      // allowOverwrite: true,
    });

    return res.status(200).json(blob);
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: String(err?.message || err) });
  }
}
