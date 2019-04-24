const fileName = "social-history";
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
};

function caseFilter(string) 
{
    string = string.toLowerCase();
    return string.charAt(0).toUpperCase() + string.slice(1);
};

function createPatientData(element, i) {

    var dataObj = {};
    dataObj.id = i;
    dataObj.alcoholConsumption ={};
    dataObj.alcoholConsumption.value =  element.alcoholConsumption;
    dataObj.frequency={};
    dataObj.frequency.value = element.frequency;
    dataObj.alcoholMoreDetail = element.comments;
    dataObj.smoking={};
    dataObj.smoking.value = element.smoking;
    dataObj.snomedCat={};
    dataObj.snomedCat.value=element.snomedCat;
    dataObj.caffeineUse={};
    dataObj.caffeineUse.value=element.caffeineUse;
    dataObj.caffeineUse.other="";
    dataObj.illicitDrugs={};
    dataObj.illicitDrugs.value=element.illicitDrugs;
    dataObj.illicitDrugs.other="";
    dataObj.drugDetails=element.drugDetails;
    dataObj.exercise=element.exercise;
    dataObj.sleepPerHours=element.sleep;
    dataObj.useOfSeatBelt=element.useOfSeatBelt;
    dataObj.livingArrangements=element.livingArrangements;
    dataObj.marriage=element.marriage;
    dataObj.occupation=element.occupation;
    dataObj.education=element.education;
    dataObj.sexuallyActive=element.sexuallyActive;
    dataObj.sexualPartners={};
    // var temp=element.sexualPartners.split(';');
    dataObj.sexualPartner=element.number;
    dataObj.sexualPartners.gender=caseFilter(element.gender);
    dataObj.historyOfSTIDiagnosis=element.historyOfSTIDiagnosis;
    dataObj.additionalDescription=element.additionalDescription;
    dataObj.useOfProtection=element.useOfProtection=='NA'?'':element.useOfProtection;

    return dataObj;
}

function dataWrapper(data) {
    var patientSocialHistoryData = {
        "info": {
            "status": "200",
            "message": "OK"
        },
        "data": {}
    };

    var chartNo = "";
    var i = 1;
    var patientsData = {};var props = Object.keys(data[0]);
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
    patientSocialHistoryData['data'] = patientsData;

    return patientSocialHistoryData;
}

// function that can be accessible outside this file 
module.exports = function () {
    csv()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
            var formattedData = dataWrapper(jsonObj);
            fs.writeFile('../JSON/'+fileName+'.json', JSON.stringify(formattedData), 'utf8', function (err) {
                if (err) throw err;
                console.log('social history data created!');
            });
        });
    };