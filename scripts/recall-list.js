// function formatDate(date) {
//     var monthNames = [
//       "January", "February", "March",
//       "April", "May", "June", "July",
//       "August", "September", "October",
//       "November", "December"
//     ];
  
//     var day = date.getDate();
//     var monthIndex = date.getMonth();
//     var year = date.getFullYear();
  
//     return day + ' ' + monthNames[monthIndex] + ' ' + year;
//   }
//   var date= new Date("1/12/2018")
//   console.log(date)
//   console.log(formatDate(date));
//   var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
//   console.log(date.toLocaleDateString("en-US", options));
//   console.log(date)
//*************************************** 
const fileName = "recall-list";
const csvFilePath = '../CSV/IEHR/'+fileName+'.csv';
const csv = require('csvtojson');
const fs = require('fs');
let patient = require('../JSON/patient-info.json').data;
let provider = require('../JSON/provider-info.json').data;
var moment = require("moment");

function findChartNo(firstName, lastName) {
    var chartNumber;
    // console.log("firstname, lastname", firstName, lastName)
    patient.forEach((item) => {
        if (firstName == item.firstName && lastName == item.lastName) {
            chartNumber = item.chartNumber;
        }
    });
    return chartNumber;
};

function findProviderInfo(lastname){
    var providerInfo;

    provider.forEach((item) => {
        if (item.lastName==lastname){

            providerInfo=item;
        }
    });
    return providerInfo;
};

function generateRecallId(id){
    if(id>=100){
        return "RL"+id;
    }else if(id>=10){
        return "RL0"+id;
    }else{
        return "RL00"+id;
    }
};

function createRecallData(element, chartNo, providerInfo) {

    var dataObj = {};
    dataObj.recallId = element.recallId;
    dataObj.patientInfo={};
    dataObj.patientInfo.chartNumber=chartNo;
    dataObj.providerInfo={};
    dataObj.providerInfo.providerUserID=providerInfo? providerInfo.providerUserID : "undefined";
    dataObj.recallStatus=element.recallStatus;
    dataObj.recallReason=element.recallReason;
    // var date= new Date(element.recallWeek);
    // dataObj.recallWeek=date.toLocaleDateString("en-US");
    dataObj.recallWeek=moment(element.recallWeek).format("MM/DD/YYYY");
    return dataObj;
}

function dataWrapper(data) {
    var patientSurgicalHistoryData = {
        "info": {
            "status": "200",
            "message": "OK"
        },
        "data": []
    };

    var chartNo = "";
    var i = 1;
    var patientsData = {};
    data.forEach(element => {
        var providerInfo= findProviderInfo(element.providerName.split("Dr. ")[1]);
        // console.log(providerInfo);
        var name = element.patientName.split(" ");
        chartNo = findChartNo(name[0], name[1]);
        element.recallId = generateRecallId(i);
        patientsData=createRecallData(element,chartNo,providerInfo);
    patientSurgicalHistoryData['data'].push(patientsData);
    i=i+1;
    });

    return patientSurgicalHistoryData;
}

// function that can be accessible outside this file 
module.exports = function recallList() {
    csv()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
            var formattedData = dataWrapper(jsonObj);
            fs.writeFile('../JSON/'+fileName+'.json', JSON.stringify(formattedData), 'utf8', function (err) {
                if (err) throw err;
                console.log('recall list data created!');
            });
        });
    };
    
    
    // redefineing the same piece of code so that this file can be solely executed.
    csv()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
            var formattedData = dataWrapper(jsonObj);
            fs.writeFile('../JSON/'+fileName+'.json', JSON.stringify(formattedData), 'utf8', function (err) {
                if (err) throw err;
                console.log('recall list data created!');
            });
        });