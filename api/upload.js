import { put } from "@vercel/blob";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const blob = await put(req.query.filename || "file", req, {
      access: "public",
    });

    // devolvemos la URL pública para guardarla en Airtable
    res.status(200).json({ url: blob.url });
  } catch (error) {
    console.error("Blob upload error:", error);
    res.status(500).json({ error: "Upload failed" });
  }
}
