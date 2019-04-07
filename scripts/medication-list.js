var moment = require("moment");
const fileName = "medication-list";
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
function createData(element, i) {

    var dataObj = {};
    dataObj.Id = i;
    dataObj.status=element.status;
    dataObj.drugType=element.drugType;
    dataObj.drugName=element.drugName;
    dataObj.dosage=element.dosage;
    dataObj.quantity=element.quantity;
    dataObj.drugForm=element.drugForm;
    dataObj.route=element.route;
    dataObj.doseTiming=element.doseTiming;
    dataObj.frequency=element.frequency;
    dataObj.duration=element.duration;
    dataObj.lastRefillDate=(element.lastRefillDate=='NA' || element.lastRefillDate== "")?"":moment(element.lastRefillDate).format("MM/DD/YYYY");
    dataObj.noOfRefills=element.noOfRefills;
    dataObj.dateStarted=(element.dateStarted=='NA' || element.dateStarted== "")?"":moment(element.dateStarted).format("MM/DD/YYYY");
    dataObj.dateStopped=(element.dateStopped=='NA' || element.dateStopped== "")?"":moment(element.dateStopped).format("MM/DD/YYYY");
    dataObj.fillDate=(element.fillDate=='NA' || element.fillDate== "")?"":moment(element.fillDate).format("MM/DD/YYYY");
    dataObj.reasonStopped=element.reasonStopped;
    dataObj.diagnosis=element.diagnosis;
    dataObj.defaultProvider=element.defaultProvider;

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
                var patientData = createData(element, i);
                // continue;
            }
            else {
                console.log(element);
            }
        }
        else {
            var patientData = createData(element, i);

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
                console.log('medication list created!');
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
                console.log('medication list created!');
            });
        });