const fileName = "block-time";
const csvFilePath = '../CSV/IEHR/'+fileName+'.csv';
const csv = require('csvtojson');
const fs = require('fs');
let provider = require('../JSON/provider-info.json').data;
var moment = require("moment");

var id = 0; 
var calenderStart = moment("01/09/2019","MM-DD-YYYY");

function findProviderUserID(lastName) {
    var providerInfo;
    provider.forEach((item) => {
        if (lastName == item.lastName) {
           providerInfo = item;
        }
    });
    return providerInfo;
};

function generateBlockTimeID(){
    ++id;
    return "bt"+id;
};

function getDoW (date){
    return moment(date).format("DDD");
};

function getNumOfWeek (day){
    console.log(day);
    switch(day.trim()){
        case "monday" : return 1;
        case "tuesday" : return 2;
        case "wednesday" : return 3;
        case "thursday" : return 4;
        case "friday" : return 5;
        case "saturday" : return 6;
        case "sunday" : return 0;
        case "day" : return [1,2,3,4,5,6,0];
    }
}

function getDayOfWeek(repeat){
   var d1, d2;
   var dowArray = [];
    var dow = repeat.toLowerCase().split("every")[1];
//    d1 = dow.indexOf("-")!=-1 ? getNumOfWeek(dow.split("-")[0].trim().toLowerCase()) : 999;
//    if(d1!=999){
//         d2 =getNumOfWeek(dow.split("-")[1].trim().toLowerCase());
//         // var i = d1>d2 ? d2 : d1;
//         // var l = d1>d2 ? d1 : d2;
//         var i = d1;
//         var l = d2;
//         for(i ;i<=l ;i++){
//             if(i==7){
//                 dowArray.push(0);
//             }else{
//                 dowArray.push(i);
//             }
//         };
//         return dowArray;
//    } else{
           return [getNumOfWeek(dow)]; 
    // }
}

function getTime(dateAndTime){
    var time = dateAndTime.split(" ");
    return time[1]+time[2];
}

function createProviderOfficeHoursData(providerInfo, element) {
    var dataObj = {};
    var dow ="";
    dataObj.ID = generateBlockTimeID();
    dataObj.start = moment(getTime(element.dateAndTime), "h:mm a").format("HH:mm");
    var end = moment(dataObj.start, "HH:mm").add(parseInt(element.duration.split(" ")[0]), "hours").format("hh:mm a");
    // condition to convert 00:00 to 24:00. 
    // if it is 00:00 block time is created for early morning. This case fo evening to midnight.
    // this is only for end time. start time is kept same.
    if( end == "12:00 am"){
        dataObj.end = "24:00";
    }else{
        dataObj.end = moment(end, "hh:mm a").format("HH:mm");
    }
    // for whole day block time cases.
    var duration= moment(element.duration.split(" "),"h").format("HH:mm");
    dataObj.duration = duration == "00:00" ? "24:00" : duration; 
    dataObj.startTime = "Wed Jan 9 2019 " +dataObj.start;
    dataObj.endTime =  "Wed Jan 9 2019 " +dataObj.end;
    dataObj.dow= getDayOfWeek(element.repeat);
    dataObj.allDay = false;
    dataObj.description = element.description;
    dataObj.repeat= element.repeat;
    dataObj.reason = element.reason;
    dataObj.providerInfo = {};
    dataObj.providerInfo.providerUserID=providerInfo.providerUserID;
    dataObj.providerInfo.salutation=providerInfo.salutation;
    dataObj.providerInfo.firstName=providerInfo.firstName;
    dataObj.providerInfo.lastName=providerInfo.lastName;
    dataObj.type="Break entry";

    return dataObj;
}

function dataWrapper(data) {
    var blockTimeData = {
        "info": {
            "status": "200",
            "message": "OK"
        },
        "data": []
    };
    data.forEach((element) =>{
        var flag = 0;
        var props=Object.keys(element);
        // for loop to eleminate empty entries
        for (j = 1; j < props.length; j++) {
            if (element[props[j]] != "") {
                flag = 1;
                break;
            }

        }

        if (flag) {
        var providerInfo=findProviderUserID(element.providerName);
       

        // this condition is for saturday and sunday. removing that blocktime for now.

            var providerOfficeHour=createProviderOfficeHoursData(providerInfo, element);
            blockTimeData.data.push(providerOfficeHour);
        }
    });
    // console.log(moment().format('LT'));
    return blockTimeData;
}

module.exports = function () {
csv()
    .fromFile(csvFilePath)
    .then((jsonObj) => {
        var formattedData = dataWrapper(jsonObj);
        fs.writeFile('../JSON/'+fileName+'.json', JSON.stringify(formattedData), 'utf8', function (err) {
            if (err) throw err;
            console.log('Block time data created!');
        });
    });
};