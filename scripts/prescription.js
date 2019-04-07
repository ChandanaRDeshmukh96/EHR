const fileName = "prescription";
const csvFilePath = '../CSV/IEHR/'+fileName+'.csv';
const csv = require('csvtojson');
const fs = require('fs');
let patient = require('../JSON/patient-info.json').data;
let provider = require('../JSON/provider-info.json').data;
var moment = require("moment");


function generatePrescriptionId(id){
    if(id<10){
        return "PRI0"+id;
    }else {
        return "PRI"+id;
    }
};

function createPrescriptionData(element) {

    var dataObj = {};
    dataObj.id = generatePrescriptionId();
    dataObj.additionalDetails="";
    dataObj.value=element.name;
    dataObj.description=element.description;
    dataObj.Manufacturer=element.Manufacturer;
    dataObj.dosage1=element.dosage1;
    dataObj.dosage2=element.dosage2;
    dataObj.dosage3=element.dosage3;
    dataObj.dosage4=element.dosage4;
    return dataObj;
}

function dataWrapper(data) {
    var prescriptionData = {
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
            prescriptionData['data'].push(createPrescriptionData(element));
        }
    });

    return prescriptionData;
}

module.exports = function accessLevels() {
    csv()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
            var formattedData = dataWrapper(jsonObj);
            fs.writeFile('../JSON/'+fileName+'.json', JSON.stringify(formattedData), 'utf8', function (err) {
                if (err) throw err;
                console.log('prescription data created!');
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
                console.log('prescription data created!');
            });
        });