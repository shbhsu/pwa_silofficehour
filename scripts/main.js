
var calender = new Vue({
  el: '#calender',
  data() {
    return {
      calenders: []
    }
  }
  ,
  created: function initCalender() {
    var calenders = [];
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://aucal.pdis.nat.gov.tw/auCal');
    xhr.send();
    xhr.onload = function () {
      if (xhr.status === 200) {
        var res = JSON.parse(xhr.responseText)

        var dayList = getWednesday(4,new Date().getDate());
        var pointer = 0;



        for (i = 0; i < dayList.length; i++) {
          var element = dayList[i];


          //時區轉換
          var TWStart = new Date(res.items[pointer].start).toLocaleString("en-US", { timeZone: "Asia/Taipei" });
          var TWEnd = new Date(res.items[pointer].end).toLocaleString("en-US", { timeZone: "Asia/Taipei" });

          if (calenders.length >= 12) {
            break;
          }
       

          var date = ("0" + (element.getMonth() + 1)).slice(-2) + "/" + ("0" + element.getDate()).slice(-2);//MM/dd
          var auDate = ("0" + (new Date(TWStart).getMonth() + 1)).slice(-2) + "/" + ("0" + new Date(TWStart).getDate()).slice(-2);
          console.log(date + "  " + auDate);
          if (auDate === (date)) {
            if (res.items[pointer].holiday == true) {//排除假日
              console.log(date + "holiday")
            }
            else {

              var startDT = new Date(TWStart);
              var endDT = new Date(TWEnd);
              var clsSubtitle = 'calenderSubtitle';
              if (startDT.getHours() != 10) {
                clsSubtitle = 'calenderSubtitle Red';
              }
              var datetime = ("0" + startDT.getHours()).slice(-2) + ":" + ("0" + startDT.getMinutes()).slice(-2) + "～" + ("0" + endDT.getHours()).slice(-2) + ":" + ("0" + endDT.getMinutes()).slice(-2);
              var objCalender = { title: "唐鳳都在這", date: date + "(三)", subtitle: datetime, cls: "calenderGreen", clsSubtitle: clsSubtitle }
              calenders.push(objCalender);
            }
            pointer++;
          }
          else {
            var objCalender = { title: "另有公務行程", date: date + "(三)", subtitle: "另有公務行程", cls: "calenderRed", clsSubtitle: "calenderSubtitle Red" }
            calenders.push(objCalender);
          }
        };


        var updateDT = new Date(new Date(res.updateTime).toLocaleString("en-US", { timeZone: "Asia/Taipei" }));
        new Vue({
          el: '#updateDT',
          data() {
            return {

              updateDT: "最後更新時間：" + updateDT.getFullYear() + "-" + (updateDT.getMonth() + 1) + "-" + updateDT.getDate() + " " + updateDT.getHours() + ":00 GMT+8"
            }
          }
        })

      }
      else {
        //err
      }
    };


    this.calenders = calenders;
  }
})


//auto reload
function myrefresh() {

  try {
    var xhrTest = new XMLHttpRequest();
    xhrTest.open('GET', 'https://aucal.pdis.nat.gov.tw/auCal');
    xhrTest.send();
    xhrTest.onload = function () {
      if (xhrTest.status === 200) {
        window.location.reload();

      }
    }

  }
  catch (err) {
    console.log("refresh err")
  }
}
var interval_time = 1000 * 60 * 60 * 1; //every 1 Hr

setInterval(function () {
  myrefresh();
  console.log("re render");
}, interval_time);


function getWednesday(monthCount,setfirstDate) {
  var d = new Date(),
    month = d.getMonth(),
    Wednesdays = [];

  d.setDate(setfirstDate);
  // Get the first Wednesday in the month
  while (d.getDay() !== 3) {
    d.setDate(d.getDate() + 1);
  }
  var tmpd = new Date();
  tmpd.setMonth(tmpd.getMonth() + monthCount);
  var endmonth = tmpd.getMonth();

  // Get all the other Wednesday in the month
  while (d.getMonth() !== endmonth) {
    Wednesdays.push(new Date(d.getTime()));
    d.setDate(d.getDate() + 7);
  }
  return Wednesdays;
}



