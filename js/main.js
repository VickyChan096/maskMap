//L是Leaflet框架的名字，有可能會與其他框架衝突
//map函式('設定在#map',{先定位在center這個座標,zoom定位在16})
let map = L.map('map', {
  center: [25.00144398527068, 121.51330907919525],
  zoom: 16,
});

//OSM的圖磚資料.addTo加入到(map裡面去)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //右下角資訊
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

//製作綠色icon
let greenIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

let redIcon = new L.Icon({
  iconUrl:
    'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

//新增一個marker圖層，專門用來放群組
let markers = new L.MarkerClusterGroup().addTo(map);

// //加上marker，設定它的座標
// L.marker([25.00144398527068, 121.51330907919525], { icon: greenIcon })
//   //將這個座標放到對應的地圖裡
//   .addTo(map)
//   //針對這個marker加上html進去
//   .bindPopup('<h1>四號公園</h1>')
//   //預設開啟
//   .openPopup();

//開啟一個網路請求
let xhr = new XMLHttpRequest();
//準備跟伺服器要資料
xhr.open(
  'get',
  'https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json',
  true
);
//執行要資料的動作
xhr.send(null);
//當資料回傳好時，下面語法自動觸發
xhr.onload = function () {
  let data = JSON.parse(xhr.responseText).features;
  for (let i = 0; data.length > i; i++) {
    var iconColor;
    if (data[i].properties.mask_adult == 0) {
      iconColor = redIcon;
    } else {
      iconColor = greenIcon;
    }
    markers.addLayer(
      L.marker(
        [data[i].geometry.coordinates[1], data[i].geometry.coordinates[0]],
        { icon: iconColor }
      ).bindPopup(
        '<h1>' +
          data[i].properties.name +
          '</h1>' +
          '<p>成人口罩數量' +
          data[i].properties.mask_adult +
          '</p>'
      )
    );
    // add more markers here...
    // L.marker().addTo(map)
    //   )
  }
  map.addLayer(markers);
};