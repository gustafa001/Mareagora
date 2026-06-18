const https = require('https');

const urls = [
  'https://www.youtube.com/@ubacam6924/live',
  'https://www.youtube.com/@HomesinRio/live',
  'https://www.youtube.com/@EarthCam/live'
];

urls.forEach(u => {
  https.get(u, (res) => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', () => {
      const m = d.match(/rel="canonical" href="https:\/\/www\.youtube\.com\/watch\?v=([^"]+)"/);
      console.log(u + ' -> ' + (m ? m[1] : 'NOT FOUND'));
    });
  });
});
