async function searchWiki(query) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=8&gsrnamespace=6&prop=imageinfo&iiprop=url|size|mime&iiurlwidth=800&format=json`;
  const res = await fetch(url, { headers: { 'User-Agent': 'ShreeAnantaTravels/1.0 (contact@shreeanantatravels.com)' } });
  const data = await res.json();
  if (!data.query || !data.query.pages) return [];
  return Object.values(data.query.pages).map(p => {
    const info = p.imageinfo ? p.imageinfo[0] : {};
    return {
      title: p.title.replace('File:', ''),
      width: info.width,
      height: info.height,
      url: info.url,
      thumb: info.thumburl
    };
  });
}

async function test() {
  const queries = [
    'Meenakshi Amman Temple Madurai',
    'Pamban Bridge Rameswaram',
    'Vivekananda Rock Memorial Kanyakumari',
    'Sree Padmanabhaswamy Temple Thiruvananthapuram',
    'Kedarnath Temple Himalayas',
    'Badrinath Temple Uttarakhand',
    'Gangotri Temple Bhagirathi',
    'Yamunotri Temple Uttarakhand',
    'Har Ki Pauri Haridwar Ganga Aarti',
    'Hawa Mahal Jaipur',
    'Sam Sand Dunes Jaisalmer',
    'Mehrangarh Fort Jodhpur',
    'Lake Pichola Udaipur City Palace',
    'Alleppey Houseboat Kerala',
    'Munnar Tea Gardens Kerala',
    'Chinese Fishing Nets Kochi'
  ];

  for (const q of queries) {
    console.log(`\n=== QUERY: ${q} ===`);
    const results = await searchWiki(q);
    results.slice(0, 3).forEach(r => {
      console.log(`- Title: ${r.title}`);
      console.log(`  Size: ${r.width}x${r.height}`);
      console.log(`  URL: ${r.thumb}`);
    });
  }
}

test().catch(console.error);
