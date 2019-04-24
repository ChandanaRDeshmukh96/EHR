var moment = require("moment");
const fileName = "patient-medical-history";
const csvFilePath = '../CSV/IEHR/'+fileName+'.csv';
const csv = require('csvtojson');
const fs = require('fs');
let patient = require('../JSON/patient-info.json').data;

function findChartNo(firstName, lastName) {
    var chartNumber;
    // console.log("firstname, lastname", firstName, lastName)
    patient.forEach((item) => {
        if (firstName == item.firstName && lastName == item.lastName) {
            chartNumber = item.chartNumber;
        }
    });
    return chartNumber;
}
function createPatientData(element, i) {

    var dataObj = {};
    dataObj.id = i;
    dataObj.pmhDescription = element.pmhDescription;
    dataObj.diagnosisDate = moment(element.diagnosisDate).format("MM/DD/YYYY") === "Invalid date" ? "" : moment(element.diagnosisDate).format("MM/DD/YYYY");
    dataObj.dateModified= "Jan 09,2019 10:30 am";
    dataObj.resolution = element.resolution;
    var duration=element.duration.split(" ");
    dataObj.duration = duration[0]==""?"0":duration[0];
    var durationUnit= duration[1] ? duration[1] : element.durationUnit;
    if(durationUnit.indexOf("day")!= -1){
        dataObj.durationUnit = "Day(s)";
    }else if(durationUnit.indexOf("week") != -1){
        dataObj.durationUnit = "Week(s)";
    }else if(durationUnit.indexOf("month") != -1){
        dataObj.durationUnit = "Month(s)";
    }else if(durationUnit.indexOf("year") != -1){
        dataObj.durationUnit = "Year(s)";
    }else{
        dataObj.durationUnit = "Day(s)";
    }
    return dataObj;
}

function dataWrapper(data) {
    var patientSurgicalHistoryData = {
        "info": {
            "status": "200",
            "message": "OK"
        },
        "data": {}
    };

    var chartNo = "";
    var i = 1;
    var patientsData = {};
    var props = Object.keys(data[0]);
    data.forEach(element => {
        var flag = 0;
        // for loop to eleminate empty entries
        for (j = 1; j < props.length; j++) {
            if (element[props[j]] != "") {
                flag = 1;
                break;
            }

        }

        if (flag) {

        if (element.patientName != "") {
            i = 1;
            var name = element.patientName.split(" ");
            chartNo = findChartNo(name[0], name[1]);
            if (chartNo) {
                patientsData[chartNo] = [];
                var patientData = createPatientData(element, i);
                // continue;
            }
            else {
                console.log(element);
            }
        }
        else {
            var patientData = createPatientData(element, i);

        }
        i += 1;
        if (chartNo != undefined)
            patientsData[chartNo].push(patientData)
    }

    });
    patientSurgicalHistoryData['data'] = patientsData;

    return patientSurgicalHistoryData;
}
// function that can be accessible outside this file 
module.exports = function accessLevels() {
    csv()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
            var formattedData = dataWrapper(jsonObj);
            fs.writeFile('../JSON/'+fileName+'.json', JSON.stringify(formattedData), 'utf8', function (err) {
                if (err) throw err;
                console.log('Patient medical history data created!');
            });
        });
    };