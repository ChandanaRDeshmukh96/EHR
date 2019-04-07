// for UI purposes, text area that does not have value is assinged with NA and the date fields thta does not have value is given with blank -> ""
const fileName = "immunization";
const csvFilePath = '../CSV/IEHR/'+fileName+'.csv';
const csv = require('csvtojson');
const fs = require('fs');
let patient = require('../JSON/patient-info.json').data;
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
}
function createData(element, i) {

    var dataObj = {};
    dataObj.id = i;
    dataObj.immunizationType=element.immunizationType;
    dataObj.orderingPhysician=element.orderingPhysician;
    dataObj.followUpDirections=element.followUpDirections;
    dataObj.dosage=element.dosage;
    dataObj.manufacturer=element.manufacturer;
    dataObj.lotNumber=element.lotNumber;
    dataObj.expirationDate=element.expirationDate=='NA'?'':moment(element.expirationDate).format("MM/DD/YYYY");
    dataObj.siteOfAdministration=element.siteOfAdministration;
    dataObj.site=element.site;
    dataObj.otherSite='None';
    dataObj.adverseEffects=element.adverseEffects;
    dataObj.visGiven=element.visGiven;
    dataObj.followUpDirectionsProvided=element.followUpDirectionsProvided;
    dataObj.patientInsToReturnOn=element.patientInsToReturnOn;
    dataObj.immunizationStartDate=element.immunizationStartDate=='NA'?'':moment(element.immunizationStartDate).format("MM/DD/YYYY");
    dataObj.nextDoseDueDate=element.nextDoseDueDate=='NA'?'':moment(element.nextDoseDueDate).format("MM/DD/YYYY");

    return dataObj;

}

function dataWrapper(data) {
    var patientImmunizationData = {
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
    patientImmunizationData['data'] = patientsData;

    return patientImmunizationData;
}

// function that can be accessible outside this file 
module.exports = function accessLevels() {
    csv()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
            var formattedData = dataWrapper(jsonObj);
            fs.writeFile('../JSON/'+fileName+'.json', JSON.stringify(formattedData), 'utf8', function (err) {
                if (err) throw err;
                console.log('immunization data created!');
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
                console.log('immunization data created!');
            });
        });