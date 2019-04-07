const csvFilePath = '../CSV/patient-notes.csv';
const csv = require('csvtojson');
const fs = require('fs');
let patient = require('../../src/ehr/asset/data/en-us/PMEHR/feature/patient-info.json').data;

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
    dataObj.noteTitle=element.noteTitle;
    dataObj.note=element.note;

    return dataObj;
}

function createSurgicalHistory(data) {
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

csv()
    .fromFile(csvFilePath)
    .then((jsonObj) => {
        var formattedData = createSurgicalHistory(jsonObj);
        fs.writeFile('../JSON/patient-notes.json', JSON.stringify(formattedData), 'utf8', function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
    });