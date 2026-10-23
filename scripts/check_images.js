async function getWikiFileInfo(filename) {
  const url = 'https://commons.wikimedia.org/w/api.php?action=query&titles=File:' + encodeURIComponent(filename) + '&prop=imageinfo&iiprop=url|size|mime&iiurlwidth=1920&format=json';
  const res = await fetch(url, { headers: { 'User-Agent': 'ShreeAnantaTravels/1.0 (contact@shreeanantatravels.com)' } });
  const data = await res.json();
  const pages = data.query.pages;
  const pId = Object.keys(pages)[0];
  if (pId === '-1') return null;
  const info = pages[pId].imageinfo[0];
  return {
    filename,
    width: info.width,
    height: info.height,
    aspect: (info.width / info.height).toFixed(2),
    thumb: info.thumburl || info.url
  };
}

async function check() {
  const files = [
    'Madurai Meenakshi temple 2.jpg',
    'Meenakshi Amman Temple, Madurai.JPG',
    'Pamban railway bridge, rameswaram.jpg',
    'Pamban Bridge, Rameswaram 1.jpg',
    'Vivekananda Rock Memorial Kanyakumari 2014 (20).jpg',
    'Sree Padmanabhaswamy Temple Lakshadeepam.jpg',
    'Ramanathaswamy Temple corridor 01.jpg',
    'Kedarnath temple, Uttrakhand 02.jpg',
    'Kedarnath Temple and himalayas.jpg',
    'Badrinath temple - Uttarakhand 1.jpg',
    'Gangotri Town.jpg',
    'Gangotri temple in Uttarakhand..jpg',
    'Yamunotri shrine.jpg',
    'Yamunotri temple and ashram.jpg',
    'Aarti at Har-ki-Pauri, Haridwar.jpg',
    'Hawa Mahal 2011.jpg',
    'Sunset Sand Dunes Jaisalmer Dec14 DSC 6540.jpg',
    '2 Mehrangarh fort Jodhpur Rajasthan.jpg',
    'Udaipur City Palace at Night.jpg',
    'Houseboat on Alleppey backwaters (Kerala, India 2023) (52704577484).jpg',
    'Munnar Tea Gardens.jpg',
    'Periyar National Park-Thekkady Lake - Jalakanyaka-WUS07796.jpg',
    'Kochi chinese fishing-net-20080215-01a.jpg'
  ];
  for (const f of files) {
    const res = await getWikiFileInfo(f);
    if (res) {
      console.log(res.filename.padEnd(52) + ' | ' + res.width + 'x' + res.height + ' | aspect: ' + res.aspect + ' | ' + res.thumb);
    } else {
      console.log('NOT FOUND: ' + f);
    }
  }
}
check().catch(console.error);
