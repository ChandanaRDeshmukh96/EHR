const fileName = "access-levels";
const csvFilePath = '../CSV/IEHR/'+fileName+'.csv';
const csv = require('csvtojson');
const fs = require('fs');
let patient = require('../JSON/patient-info.json').data;
let provider = require('../JSON/provider-info.json').data;
let staff = require('../JSON/medical-staff-info.json')
var moment = require("moment");

// function findStaffId(firstName, lastName) {
//     var chartNumber = 0;
//     // console.log("firstname, lastname", firstName, lastName)
//     staff.forEach((item) => {
//         if (firstName == item.firstName && lastName == item.lastName) {
//             chartNumber = item.chartNumber;
//         }
//     });
//     return chartNumber;
// };

// function findProviderID(firstName, lastName){
//     var providerInfo = 0;

//     provider.forEach((item) => {
//         if (item.firstName==firstName && item.lastName==lastname){

//             providerInfo=item;
//         }
//     });
//     return providerInfo.providerUserID;
// };

// function getStaffID(firstName, lastName){

//     var staffId =0;
//     staffId = findStaffId(firstName, lastName);
//     if(staffId == 0){
//         staffId = findProviderID(firstName, lastName);
//     }
//     return staffId;

// }

function createData(element) {

    var dataObj = {};
    dataObj.staffId = element.ID;
    dataObj.accessLevelObject = {};
    dataObj.accessLevelObject.sch = element.sch;
    dataObj.accessLevelObject.enc = element.enc;
    dataObj.accessLevelObject.chk = element.chk;
    dataObj.accessLevelObject.acc = element.acc
    dataObj.accessLevelObject.clm = element.clm;
    dataObj.accessLevelObject.msg = element.msg;
    dataObj.accessLevelObject.tsk = element.tsk;
    dataObj.accessLevelObject.tls = element.tls;

    return dataObj;
}

function dataWrapper(data) {
    var accessLevelData = {
        "info": {
            "status": "200",
            "message": "OK"
        },
        "data": []
    };

    data.forEach(element => {
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

        accessLevelData['data'].push(createData(element));
        }

    });

    return accessLevelData;
}
// function that can be accessible outside this file 
module.exports = function accessLevels() {
csv()
    .fromFile(csvFilePath)
    .then((jsonObj) => {
        var formattedData = dataWrapper(jsonObj);
        fs.writeFile('../JSON/'+fileName+'.json', JSON.stringify(formattedData), 'utf8', function (err) {
            if (err) throw err;
            console.log('Access levels data created!');
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
            console.log('Access levels data created!');
        });
    });