var moment = require("moment");
const fileName = "form-attachment";
const csvFilePath = '../CSV/IEHR/patient-forms.csv';
const csv = require('csvtojson');
const fs = require('fs');
let patient = require('../JSON/patient-info.json').data;
var id = 0;

function generateFormAttachmentId(){
    id++;
    if(id<10){
        return "FAT0"+id;
    }else{
        return "FAT"+id;
    }
};

function createPatientData(element) {

    var dataObj = {};
    dataObj.id = generateFormAttachmentId();
    dataObj.label = element.formName;
    dataObj.value = element.url;

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
            patientSurgicalHistoryData['data'].push(createPatientData(element))
    }

    });

    return patientSurgicalHistoryData;
}
// function that can be accessible outside this file 
module.exports = function () {
    csv()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
            var formattedData = dataWrapper(jsonObj);
            fs.writeFile('../JSON/'+fileName+'.json', JSON.stringify(formattedData), 'utf8', function (err) {
                if (err) throw err;
                console.log('form attachment data created!');
            });
        });
    };
