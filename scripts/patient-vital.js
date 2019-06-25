const fileName = "patient-vital";
const csvFilePath = '../CSV/IEHR/'+fileName+'.csv';
const csv = require('csvtojson');
const fs = require('fs');
let patient = require('../JSON/patient-info.json').data;
let provider = require('../JSON/provider-info.json').data;
var moment = require("moment");


var id = 0;

function caseFilter(string) 
{
    string = string.toLowerCase();
    return string.charAt(0).toUpperCase() + string.slice(1);
};

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

function createVitalData(element) {
    var dataObj = {};
    dataObj.id = ++id;
    dataObj.unitSystem = "imperial";
    dataObj.height = element.height.split(" ")[0];
    dataObj.weight = element.weight.split(" ")[0];
    dataObj.systolic = element.BP.split("/")[0];
    dataObj.diastolic = element.BP.indexOf(" ")!=-1 ? element.BP.split("/")[1].split(" ")[0] : element.BP.split("/")[1];
    dataObj.armExamined = element.armExamined;
    dataObj.patientPosition = element.patientPosition;
    dataObj.pulse = element.pulse;
    dataObj.respiratoryRate = element.respiratoryRate;
    dataObj.painScale = element.painScale;
    dataObj.temperature = element.temperature.split(" ")[0];
    dataObj.selectedTempType = caseFilter(element.selectedTempType);
    dataObj.headCircumference = element.headCircumference;
    dataObj.spo2 = element.spo2;
    dataObj.dateTime = moment(element.date).format("ddd MMM DD YYYY") +" "+ moment(element.time, "h:mm").format("hh:mm:ss");

    return dataObj;
}

function dataWrapper(data) {
    var patientVitalData = {
        "info": {
            "status": "200",
            "message": "OK"
        },
        "data": {}
    };
    data.forEach(element => {
        var flag = 0;
        var props = Object.keys(element);
        for (var j = 0; j < props.length; j++) {
            if (element[props[j]] != "") {
                flag = 1;
                break;
            }
        }
        if (flag == 1) {
            var name = element.patientName.split(" ");
            var chartNumber = findChartNo(name[0], name[1]);
            var vitalData = createVitalData(element);
            if(!chartNumber){
                console.log(element);
            }
            if(patientVitalData.data[chartNumber] != null){
                patientVitalData.data[chartNumber].push(vitalData);
            }else{
                patientVitalData.data[chartNumber]=[];
                patientVitalData.data[chartNumber].push(vitalData);
            }
        }
    });

    return patientVitalData;
}

// function that can be accessible outside this file 
module.exports = function () {
    csv()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
            var formattedData = dataWrapper(jsonObj);
            fs.writeFile('../JSON/'+fileName+'.json', JSON.stringify(formattedData), 'utf8', function (err) {
                if (err) throw err;
                console.log('patient vitals recorded!');
            });
        });
    };
    
