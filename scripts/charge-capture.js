// manual work to be done -> 
// there should be only placeholders in provider notes for checked in appointments.


const fileName = "charge-capture";
const csvFilePath = '../CSV/IEHR/' + fileName + '.csv';
const csv = require('csvtojson');
const fs = require('fs');
let diagnosis = require('../JSON/ICD-code.json').data["ICD-10-CM"];
// let procedure = require('../JSON/cpt-codes.json').data["2018"];
/* diagnosis = readJsonFile('../data/json/ICD-code.json');
procedure = readJsonFile('../data/json/cpt-codes.json'); */
// console.log("diagnosis");
// console.log(diagnosis);
let patient = require('../JSON/patient-info.json').data;
// let appointments = require('../JSON/appointments.json').data;
var moment = require("moment");

var dataWrapperObj = {
    "info": {
        "status": "200",
        "message": "OK"
    },
    "data": {}
};

function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
};

function findChartNo(firstName, lastName) {
    var chartNumber = "";
    // console.log("firstname, lastname", firstName, lastName)
    patient.forEach((item) => {
        if (firstName == item.firstName && lastName == item.lastName) {
            // console.log(item);
            chartNumber = item.chartNumber;            
        }
    });
    if(chartNumber == ""){
        console.log("Patient " + firstName + " " + lastName + " not found");
    }
    return chartNumber;
}

function findIcdCodeObj(code) {
    // diagnosis.forEach((item) => {
    //     var codes = Object.keys(item);
    //     console.log("codes: " + codes);
    //     if (codes[0] == code) {
        var obj = {};
        if(diagnosis[code]){
            obj.id = code;
            obj.value = diagnosis[code]["description"];
            return obj;
        }else{
            console.log("code: " + code + " not found");
        }
    // });
};

function createDataObj(element) {
    var name = element.patientName.split(" ");
    var diagCodes = [];
    var chartNo = findChartNo(name[0], name[1]);
    var diagcode = [];
    diagCodes = element.diagnosticCode.split(",");
    diagCodes.forEach((code) => {
        var codeObj = findIcdCodeObj(code.trim());
        if (codeObj) {
            diagcode.push(codeObj);
        }
    })
    dataWrapperObj.data[chartNo] = diagcode;
}

function dataWrapper(data) {
    
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
            createDataObj(element);
        }
    });


    return dataWrapperObj;
}

// function that can be accessible outside this file 
module.exports = function () {
    csv()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
            var formattedData = dataWrapper(jsonObj);
            fs.writeFile('../JSON/' + fileName + '.json', JSON.stringify(formattedData), 'utf8', function (err) {
                if (err) throw err;
                console.log('charge capture data created!');
            });
        });
};