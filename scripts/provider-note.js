// manual work to be done -> 
// there should be only placeholders in provider notes for checked in appointments.


const fileName = "provider-note";
const csvFilePath = '../CSV/IEHR/' + fileName + '.csv';
const csv = require('csvtojson');
const fs = require('fs');
let diagnosis = require('../JSON/ICD-code.json').data["ICD-10-CM"];
let procedure = require('../JSON/cpt-codes.json').data["2018"];
/* diagnosis = readJsonFile('../data/json/ICD-code.json');
procedure = readJsonFile('../data/json/cpt-codes.json'); */
// console.log("diagnosis");
// console.log(diagnosis);
let patient = require('../JSON/patient-info.json').data;
let appointments = require('../JSON/appointments.json').data;
var moment = require("moment");

function isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key))
        return false;
    }
    return true;
  };

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

var soapnotesData = {
    "info": {
        "status": "200",
        "message": "OK"
    },
    "data": {}
};

function findAptId(chartNo, aptDate) {
    var aptId = 0;
    var checkIn = false;
    // console.log("firstname, lastname", firstName, lastName)
    appointments.forEach((item) => {
        if (item.patientInfo.chartNumber == chartNo && moment(item.treatmentDate).format("MM/DD/YYYY") == moment(aptDate).format("MM/DD/YYYY")) {
            aptId = item.appointmentID;
            if(!isEmpty(item.rangeDeviation) && item.status === "Pending" || isEmpty(item.rangeDeviation) && item.status === "Checked in waiting"){
                checkIn = true;
            }
        }
    });
    return {aptId, checkIn};
}

function createDataArray(dataString, codeArray, key, type, additionalField, checkIn) {
    // console.log("type=", type);
    // console.log(key);
    var dataArray = [], resultArray = [];
    if (dataString.indexOf(',') !== -1) {
        dataArray = dataString.trim().split(',');
    }
    else if (dataString != "") {
        dataArray[0] = dataString;
    }
    dataArray.forEach((item) => {
        if (item) {
            var dataObj = {};
            // condition to check if an appointment is checked in. 
            // Checked in appointments should have placeholders and not actual CPT codes.
            if (!checkIn) {
                dataObj.id = item.trim();
                // console.log(dataObj.id+",");
                if (diagnosis[dataObj.id]) {
                    // console.log(diagnosis[dataObj.id]);
                    dataObj.value = diagnosis[dataObj.id]["description"]
                }
                else if (procedure[dataObj.id]) {
                    dataObj.value = procedure[dataObj.id]["description"]
                }
                if (type && type === 'prescription' || type === 'immunization') {
                    dataObj.additionalField = additionalField ? additionalField : '';
                }
            }else{
                dataObj.id = "000.00";
                dataObj.value = "Placeholder";
            }
            resultArray.push(dataObj);
        }
    });

    return resultArray;
}
function createSoapNoteObject(data, chartNo) {
    var dataObj = {};
    var aptInfo = findAptId(chartNo, data.aptDate);
    var aptId = aptInfo.aptId;
    var checkIn = aptInfo.checkIn;
    if (aptId) {
        dataObj.apptId = aptId;
        dataObj.chiefComplaint = data.chiefComplaint ? data.chiefComplaint : '';
        dataObj.presentIllness = data.presentIllness ? data.presentIllness : '';
        dataObj.reviewOfSystem = data.reviewOfSystem ? data.reviewOfSystem : '';
        dataObj.examination = data.examination ? data.examination : '';
        dataObj.diagnosis = data.diagnosis ? createDataArray(data.diagnosis, diagnosis, 'description', 'diagnosis') : [];
        dataObj.prescription = data.prescription ? createDataArray(data.prescription, procedure, 'description', 'prescription', data.additionalFieldForPrescription, checkIn) : [];
        dataObj.labs = data.labs ? createDataArray(data.labs, procedure, 'description', 'labs', '', checkIn) : [];
        dataObj.imaging = data.imaging ? createDataArray(data.imaging, '', '', 'imaging', '', checkIn) : [];
        dataObj.immunization = data.immunization ? createDataArray(data.immunization, procedure, 'description', 'immunization', data.additionalFieldForImmunization, checkIn) : [];
        dataObj.injection = data.injection ? createDataArray(data.injection, '', '', 'injection', '', checkIn) : [];
        dataObj.procedure = data.procedure ? createDataArray(data.procedure, procedure, 'description', 'procedure', data.additionalFieldForProcedure, checkIn) : [];
        dataObj.attachments = data.attachments ? createDataArray(data.attachments, '', '', 'attachments') : [];
        dataObj.followUpRequired = data.followUpRequired ? data.followUpRequired : 'No';
        if (data.followUpTimeline.indexOf("day") != -1) {
            dataObj.followUpTimeline = data.followUpTimeline.split(" ")[0] + " Day(s)";
        } else if (data.followUpTimeline.indexOf("week") != -1) {
            dataObj.followUpTimeline = data.followUpTimeline.split(" ")[0] + " Week(s)";
        } else if (data.followUpTimeline.indexOf("month") != -1) {
            dataObj.followUpTimeline = data.followUpTimeline.split(" ")[0] + " Month(s)";
        } else if (data.followUpTimeline.indexOf("year") != -1) {
            dataObj.followUpTimeline = data.followUpTimeline.split(" ")[0] + " Year(s)";
        } else {
            dataObj.followUpTimeline = "NA";
        }
        dataObj.patientEducation = data.patientEducation ? data.patientEducation : '';
        dataObj.addendum = data.addendum ? createDataArray(data.addendum, '', '', 'addendum') : [];
        dataObj.referringProvider = data.referringProvider ? createDataArray(data.referringProvider, '', '', 'provider') : [];
        dataObj.referringLabs = data.referringLabs ? createDataArray(data.referringLabs, '', '', 'labs') : [];
        dataObj.referringPractice = data.referringPractice ? createDataArray(data.referringPractice, '', '', 'practice') : [];
        dataObj.SOAPNoteRecordedDate = data.SOAPNoteRecordedDate ? data.SOAPNoteRecordedDate : '';
        return dataObj;
    } else {
        console.log(data);
    }
}
function dataWrapper(data) {
    var soapNote = {};
    var id = 0;
    data.forEach(element => {
        var flag = 0;
        var props = Object.keys(element);
        for (var j = 0; j < props.length; j++) {
            if (element[props[j]] != "") {
                flag = 1;
                break;
            }
        }
        if (flag) {
            id++;
            // element.apptId="ar"+id<10?"0":""+id;
            var name = element.patientName.split(" ");
            element.chartNo = findChartNo(name[0], name[1]);
            if (!soapNote[element.chartNo]) {
                soapNote[element.chartNo] = [];
            }
            var soapNoteData = createSoapNoteObject(element, element.chartNo);
            soapNote[element.chartNo].push(soapNoteData);
        }
    });
    soapnotesData.data = soapNote;

    return soapnotesData;
}

// function that can be accessible outside this file 
module.exports = function () {
    csv()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
            var formattedData = dataWrapper(jsonObj);
            fs.writeFile('../JSON/' + fileName + '.json', JSON.stringify(formattedData), 'utf8', function (err) {
                if (err) throw err;
                console.log('provider note data created!');
            });
        });
};