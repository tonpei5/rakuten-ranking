export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const genre = url.searchParams.get("genre") || "112203";

    const cacheKey = new Request(url.toString());
    const cache = caches.default;
    const cached = await cache.match(cacheKey);
    if (cached) return cached;

    const apiUrl = `https://app.rakuten.co.jp/services/api/IchibaItem/Ranking/20170628?applicationId=${env.RAKUTEN_APP_ID}&genreId=${genre}`;

    const res = await fetch(apiUrl);
    const json = await res.json();

    const items = json.Items.map(i => ({
        name: i.Item.itemName,
        price: i.Item.itemPrice,
        image: i.Item.mediumImageUrls[0]?.imageUrl,
        url: i.Item.itemUrl
    }));

    const response = new Response(JSON.stringify({ items }), {
        headers: { "Content-Type": "application/json" }
    });

    await cache.put(cacheKey, response.clone());
    return response;
  }
};
