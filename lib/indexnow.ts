const SITE_URL = "https://www.physiofix.net";

export async function submitToIndexNow(
  urls: string | string[]
) {
  const key = process.env.INDEXNOW_KEY;

  if (!key) {
    console.warn("INDEXNOW_KEY is not configured");
    return;
  }

  const urlList = Array.isArray(urls) ? urls : [urls];

  const validUrls = urlList.filter((url) =>
    url.startsWith(`${SITE_URL}/`)
  );

  if (!validUrls.length) return;

  try {
    const response = await fetch(
      "https://api.indexnow.org/indexnow",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          host: new URL(SITE_URL).host,
          key,
          keyLocation: `${SITE_URL}/${key}.txt`,
          urlList: validUrls,
        }),
      }
    );

    if (!response.ok) {
      console.error(
        `IndexNow failed: ${response.status}`
      );
    }

    return response.status;
  } catch (error) {
    console.error("IndexNow request failed:", error);
  }
}