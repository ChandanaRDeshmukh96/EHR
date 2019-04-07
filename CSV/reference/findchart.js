const csvFilePath = '../CSV/findChartNumber.csv';
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
function createSurgicalHistory(data) {
    var patientsData="patientName"+","+"chartNo"+"\n";
    data.forEach(element => {
        if (element.patientName != "") {
            // i = 1;
            var name = element.patientName.split(" ");
            chartNo = findChartNo(name[0], name[1]);
            if (chartNo) {
                // patientsData[chartNo] = [];
                // var patientData = createPatientData(element, i);
                // continue;
                var patientData= element.patientName+","+chartNo+"\n";
            }
            else {
                console.log(element);
                var patientData= element.patientName+","+""+"\n";
            }
        }
        else {
            var patientData =""+","+""+"\n";

        }
            patientsData+=patientData;

    });
    // patientSurgicalHistoryData['data'] = patientsData;
    console.log(patientsData)
    return patientsData;
}

csv()
    .fromFile(csvFilePath)
    .then((jsonObj) => {
        var formattedData = createSurgicalHistory(jsonObj);
        fs.writeFile('../CSV/chartNo.csv', JSON.stringify(formattedData), 'utf8', function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
    });