export default async function handler(req, res) {
  const code = req.query.code;
  if (!code) return res.status(400).send("No code provided");

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: "https://hccsri.xyz/api/spotify/callback",
  });

  const auth = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  const r = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const data = await r.json();
  res.status(200).json(data);
}
