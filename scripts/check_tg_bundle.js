async function check() {
  const res = await fetch('https://travelgrowindia.com/assets/index-DEz4UC7Z.js');
  const text = await res.text();
  const regex = /"([^"]*(?:Tour|Package|Yatra|Trip|Holiday|Expedition|Days|Nights)[^"]*)"/gi;
  const matches = new Set();
  let m;
  while ((m = regex.exec(text)) !== null) {
    if (m[1].length > 5 && m[1].length < 70 && !m[1].includes('/') && !m[1].includes('{')) {
      matches.add(m[1]);
    }
  }
  console.log('Found packages in TravelGrow JS:');
  Array.from(matches).slice(0, 35).forEach(title => console.log(' •', title));
}
check().catch(console.error);
