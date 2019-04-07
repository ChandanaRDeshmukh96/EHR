const fileName = "insurance-info";
const csvFilePath = '../CSV/IEHR/'+fileName+'.csv';
const csv = require('csvtojson');
const fs = require('fs');
let patient = require('../JSON/patient-info.json').data;
let provider = require('../JSON/provider-info.json').data;

var uk = 0;
var uk2 = 0;

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
function generateUniqueKey2() {
    ++uk2;
    if (uk2 >= 10) {
        return "uk20" + uk2;
    }
    else {
        return "uk200" + uk2;
    }
};
function generateUniqueKey() {
    ++uk;
    if (uk >= 10) {
        return "pi" + uk;
    }
    else {
        return "pi0" + uk;
    }
}

function checkforChartNum(patientInsuranceInfoData, chartNo) {
    for (var i = 0; i < patientInsuranceInfoData.data.length; i++) {
        if (patientInsuranceInfoData.data[i].chartNumber === chartNo) {
            return patientInsuranceInfoData.data[i].insuranceData;
        }
    } return 0;
}

function createInsuranceData(element) {
    var ins = {};
    ins.uniqueKey2 = generateUniqueKey2();
    ins.uniqueKey = generateUniqueKey();
    ins.insuranceType = element.insuranceType;
    ins.insuranceId = element.insuranceId;
    ins.groupInsId = element.groupInsId;
    ins.isGuarantor = element.isGuarantor;

    return ins;
}

function dataWrapper(data) {
    var patientInsuranceInfoData = {
        "info": {
            "status": "200",
            "message": "OK"
        },
        "data": []
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
            if (checkforChartNum(patientInsuranceInfoData, chartNumber) != 0) {
                var insArray = checkforChartNum(patientInsuranceInfoData, chartNumber);
                insArray.push(createInsuranceData(element));
            }
            else {
                dataObj = {};
                dataObj.chartNumber = chartNumber;
                dataObj.insuranceData = [];
                dataObj.insuranceData.push(createInsuranceData(element));
                patientInsuranceInfoData['data'].push(dataObj);
            }
        }
    });

    return patientInsuranceInfoData;
}

// function that can be accessible outside this file 
module.exports = function () {
    csv()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
            var formattedData = dataWrapper(jsonObj);
            fs.writeFile('../JSON/'+fileName+'.json', JSON.stringify(formattedData), 'utf8', function (err) {
                if (err) throw err;
                console.log('insurance data created!');
            });
        });
    };
    
