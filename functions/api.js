export async function onRequest(context) {
  const url = new URL(context.request.url);
  const genre = url.searchParams.get("genre") || "112203";

  const appId = context.env.RAKUTEN_APP_ID;
  if (!appId) {
    return new Response(
      JSON.stringify({ error: "RAKUTEN_APP_ID not set" }),
      { status: 500 }
    );
  }

  const apiUrl =
    `https://app.rakuten.co.jp/services/api/IchibaItem/Ranking/20170628` +
    `?applicationId=${appId}&genreId=${genre}`;

  try {
    const res = await fetch(apiUrl);
    const data = await res.json();

    const items = (data.Items || []).map(i => ({
      name: i.Item.itemName,
      price: i.Item.itemPrice,
      image: i.Item.mediumImageUrls?.[0]?.imageUrl || "",
      url: i.Item.itemUrl
    }));

    return new Response(JSON.stringify({ items }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Rakuten API error" }),
      { status: 500 }
    );
  }
}
