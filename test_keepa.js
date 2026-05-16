const KEEPA_API_KEY = "pa8osmtpo6bq3bbf3vgfqmp78p0ifbouv34flbvs51hsjqkb7kg6qjgddpspinlp";

async function searchKeepaProducts(term) {
  const url = `https://api.keepa.com/search?key=${KEEPA_API_KEY}&domain=10&type=product&term=${encodeURIComponent(term)}`;
  const res = await fetch(url);
  const data = await res.json();
  console.log(JSON.stringify(data).slice(0, 500));
}

searchKeepaProducts("Boat");
