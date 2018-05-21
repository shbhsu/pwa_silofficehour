
var calender = new Vue({
  el: '#calenderList',
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

        var dayList = getWednesday(4,(new Date(res.items[0].start)>=new Date())? new Date().getDate():new Date(res.items[0].start).getDate());
        var pointer = 0;

        var resBook;
        var xhrBook = new XMLHttpRequest();
        xhrBook.open('GET', 'https://aucal.pdis.nat.gov.tw/getReserve');
        xhrBook.onload = function () {
            if (xhrBook.status === 200) {
                resBook = JSON.parse(xhrBook.responseText)

                var booked = [];

                resBook.reservations.forEach(element => {
                    var tmpKey = element.startDate.substring(0, element.startDate.indexOf('T'))
                    if (booked[tmpKey] == null) {
                        booked[tmpKey] = 1;

                    }
                    else {
                        booked[tmpKey] = booked[tmpKey] + 1;
                    }
                });

                const MaxBooking = 3;//每日可預約總數
                const MaxAvailableMonth = 2; //開放可預約月數 本月+N月

                calenders.forEach(element => {

                    if (booked[element.fullDT] == MaxBooking) {//
                        element.bookStatus = "已額滿"
                        element.clsBookStatus="red"
                    }
                    else if (booked[element.fullDT] < MaxBooking) {
                        element.bookStatus = "尚可預約"
                        element.clsBookStatus="blue"
                    }
                    else if (new Date(element.fullDT).getMonth() <= (new Date().getMonth() + MaxAvailableMonth) && new Date(element.fullDT) > new Date()) {

                        element.bookStatus = "尚可預約"
                        element.clsBookStatus="blue"
                    }
                    else {
                        element.bookStatus = "未開放預約"
                        element.clsBookStatus="red"
                    }

                });

            }
            else {
                //err
            }
        };

        xhrBook.send();


        for (i = 0; i < dayList.length; i++) {
          var element = dayList[i];


          //時區轉換
          var TWStart = new Date(res.items[pointer].start).toLocaleString("en-US", { timeZone: "Asia/Taipei" });
          var TWEnd = new Date(res.items[pointer].end).toLocaleString("en-US", { timeZone: "Asia/Taipei" });

          if (calenders.length >= 12) {
            break;
          }
       

          var date = ("0" + (element.getMonth() + 1)).slice(-2) + "-" + ("0" + element.getDate()).slice(-2);//MM/dd
          var auDate = ("0" + (new Date(TWStart).getMonth() + 1)).slice(-2) + "-" + ("0" + new Date(TWStart).getDate()).slice(-2);
          console.log(date + "  " + auDate);
          if (auDate === (date)) {
            if (res.items[pointer].holiday == true) {//排除假日
              console.log(date + "holiday")
            }
            else {

              var startDT = new Date(TWStart);
              var endDT = new Date(TWEnd);
              var clsSubtitle = 'calenderSubtitle blue';
              if (startDT.getHours() != 10) {
                clsSubtitle = 'calenderSubtitle red';
              }
              var datetime = ("0" + startDT.getHours()).slice(-2) + ":" + ("0" + startDT.getMinutes()).slice(-2) + "～" + ("0" + endDT.getHours()).slice(-2) + ":" + ("0" + endDT.getMinutes()).slice(-2);
               var objCalender = { fullDT: element.getFullYear() + "-" + date, title: date + "(三)", date: date + "(三)", subtitle: datetime, cls: "calenderGreen", clsSubtitle: clsSubtitle, bookStatus: "" ,clsBookStatus:""}
              calenders.push(objCalender);
            }
            pointer++;
          }
          else {
            var objCalender = { fullDT: element.getFullYear() + "-" + date, title: date + "(三)", date: date + "(三)", subtitle: "另有公務行程", cls: "calenderRed", clsSubtitle: "calenderSubtitle red", bookStatus: "",clsBookStatus:"" }
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



