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

//製作紅色icon
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
    let iconColor;
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
//以上map

let date = new Date();
let day = date.getDay();
//星期幾
function dayChinese(day) {
  let today = document.querySelector('.today span');
  switch (day) {
    case 1:
      today.textContent = '一';
      break;
    case 2:
      today.textContent = '二';
      break;
    case 3:
      today.textContent = '三';
      break;
    case 4:
      today.textContent = '四';
      break;
    case 5:
      today.textContent = '五';
      break;
    case 6:
      today.textContent = '六';
      break;
    case 7:
      today.textContent = '日';
      break;
  }
}

//日期
function thisDate() {
  let thisDate = document.getElementById('thisDate');
  thisDate.textContent =
    date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
}

//可購買日
function canBuy() {
  let canBuy = document.querySelector('.canBuy');
  if (day === 1 || day === 3 || day === 5) {
    canBuy.innerHTML = `<p>身分證末碼為<span>1,3,5,7,9</span>可購買</p>`;
  } else if (day === 2 || day === 4 || day === 6) {
    canBuy.innerHTML = `<p>身分證末碼為<span>2,4,6,8,0</span>可購買</p>`;
  } else {
    canBuy.innerHTML = `<p>今日皆可購買</p>`;
  }
}

//現在時間
function currentTime() {
  document.getElementById('currentTime').textContent = moment().format('LTS');
  setTimeout('currentTime()', 1000); //每秒呼叫一次功能
}

//選擇城市
function selectCountry(e) {
  let select = e.target.value;
  let country = document.getElementById('country');
  let pharmacy = document.querySelector('.pharmacy');
  let data = JSON.parse(xhr.responseText).features;
  // console.log(data);
  let str = '';
  let townOption = '';
  let town = document.getElementById('town');
  for (let i = 0; i < data.length; i++) {
    // let content = `<li>${data[i].properties.name}</li>`
    let townContent = `<option>${data[i].properties.town}</option>;`;
    if (data[i].properties.county === select) {
      // console.log(data[i].properties.town);
      townOption += townContent;
    }
  }
  town.innerHTML = townOption;
$(function () {
  $('#town').focus(function () {
    $('select option').each(function () {
      text = $(this).text();
      if ($('select option:contains(' + text + ')').length > 1)
        $('select option:contains(' + text + '):gt(0)').remove();
    });
  });
});
  // pharmacy.innerHTML = str;
}
country.addEventListener('change', selectCountry);

function selectTown(e){
  let data = JSON.parse(xhr.responseText).features;
  let pharmacy = document.querySelector('.pharmacy');
  
  let select = e.target.value;
  let str = '';
  for (let i = 0; i < data.length; i++) {
    let content = `<li>${data[i].properties.name}</li>`;
    if (select === data[i].properties.town) {
      str += content;
    }
  }
  pharmacy.innerHTML = str;
}
town.addEventListener('change', selectTown);

// let btn = document.getElementById('btn');
// function clickSearch(e){
//   let search = document.getElementById('search').value;
//   let data = JSON.parse(xhr.responseText).features;
//   let str ='';
//   for(let i=0; i<data.length; i++) {
//     let content = `<li>${data[i].properties.name}</li>`;

//     if( search == data[i].properties.name || 
//         search == data[i].properties.address ||
//         search == data[i].properties.country ||
//         search == data[i].properties.town ||
//         search == data[i].properties.cunli
//         ){
//           str += content;
//         }
//   }
//   pharmacy.innerHTML = str;
// }
// btn.addEventListener('click', clickSearch);



//預設執行
function init() {
  dayChinese(day);
  thisDate();
  canBuy();
  currentTime();
}
init();
