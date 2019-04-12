const fileName = "provider-note";
const csvFilePath = '../CSV/IEHR/'+fileName+'.csv';
const csv = require('csvtojson');
const fs = require('fs');
let diagnosis = require('../JSON/ICD-code.json').data["ICD-10-CM"]; 
let procedure = require('../JSON/cpt-codes.json').data["2018"];
/* diagnosis = readJsonFile('../data/json/ICD-code.json');
procedure = readJsonFile('../data/json/cpt-codes.json'); */
// console.log("diagnosis");
// console.log(diagnosis);
let patient = require('../JSON/patient-info.json').data;

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

var soapnotesData= {
    "info": {
        "status": "200",
        "message": "OK"
    },
    "data": {}
};

function createDataArray(dataString, codeArray, key, type, additionalField) {

    // console.log("type=", type);
    // console.log(key);
    var dataArray = [], resultArray = [];
    if (dataString.indexOf(',') !== -1) {
        dataArray = dataString.trim().split(',');
    }
    else if(dataString!="")
  {
    dataArray[0]=dataString;
  }
    dataArray.forEach((item) => {
        if(item){
        var dataObj = {};
        dataObj.id = item.trim();
        // console.log(dataObj.id+",");
        if (diagnosis[dataObj.id]) { 
            // console.log(diagnosis[dataObj.id]);
            dataObj.value = diagnosis[dataObj.id]["description"] 
        }
        else if (procedure[dataObj.id]) { 
            dataObj.value = procedure[dataObj.id]["description"] 
        }
        

        if (type && type === 'procedure' || type === 'immunization') {
            dataObj.additionalField = additionalField ? additionalField : '';
        }
        
            resultArray.push(dataObj);
        }
    });
    
    return resultArray;
}
function createSoapNoteObject(data) {
    var dataObj = {};
    dataObj.apptId = data.apptId ? data.apptId : '';
    dataObj.chiefComplaint = data.chiefComplaint ? data.chiefComplaint : '';
    dataObj.presentIllness = data.presentIllness ? data.presentIllness : '';
    dataObj.reviewOfSystem = data.reviewOfSystem ? data.reviewOfSystem : '';
    dataObj.examination = data.examination ? data.examination : '';
    dataObj.diagnosis = data.diagnosis ? createDataArray(data.diagnosis, diagnosis, 'description', 'diagnosis') : [];
    dataObj.prescription = data.prescription ? createDataArray(data.prescription, '', '', 'prescription') : [];
    dataObj.labs = data.labs ? createDataArray(data.labs, procedure, 'description', 'labs') : [];
    dataObj.imaging = data.imaging ? createDataArray(data.imaging, '', '', 'imaging') : [];
    dataObj.immunization = data.immunization ? createDataArray(data.immunization, procedure, 'description', 'immunization', data.additionalFieldForImmunization) : [];
    dataObj.injection = data.injection ? createDataArray(data.injection, '', '', 'injection') : [];
    dataObj.procedure = data.procedure ? createDataArray(data.procedure, procedure, 'description', 'procedure', data.additionalFieldForProcedure) : [];
    dataObj.attachments = data.attachments ? createDataArray(data.attachments, '', '', 'attachments') : [];
    dataObj.followUpRequired = data.followUpRequired ? data.followUpRequired : 'No';
    dataObj.followUpTimeline = data.followUpTimeline ? data.followUpTimeline : 'No';
    dataObj.patientEducation = data.patientEducation ? data.patientEducation : '';
    dataObj.addendum = data.addendum ? createDataArray(data.addendum, '', '', 'addendum') : [];
    dataObj.referringProvider = data.referringProvider ? createDataArray(data.referringProvider, '', '', 'provider') : [];
    dataObj.referringLabs = data.referringLabs ? createDataArray(data.referringLabs, '', '', 'labs') : [];
    dataObj.referringPractice = data.referringPractice ? createDataArray(data.referringPractice, '', '', 'practice') : [];
    dataObj.SOAPNoteRecordedDate = data.SOAPNoteRecordedDate ? data.SOAPNoteRecordedDate : '';
    return dataObj;

}
function dataWrapper(data) {
    var soapNote={};
    var id= 0;
    data.forEach(element => {
        var flag = 0;
        var props=Object.keys(element);
        for(var j=0; j<props.length; j++){
            if(element[props[j]]!=""){
                flag=1;
                break;
            }
        }
        if(flag){
            id ++;
            // element.apptId="ar"+id<10?"0":""+id;
            var name=element.patientName.split(" ");
        element.chartNo=findChartNo(name[0],name[1]);
        if (!soapNote[element.chartNo]) {
            soapNote[element.chartNo] = [];
        }
        var soapNoteData = createSoapNoteObject(element);
        soapNote[element.chartNo].push(soapNoteData);
    }
        });
        soapnotesData.data=soapNote;
        
    return soapnotesData;
}

// function that can be accessible outside this file 
module.exports = function () {
    csv()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
            var formattedData = dataWrapper(jsonObj);
            fs.writeFile('../JSON/'+fileName+'.json', JSON.stringify(formattedData), 'utf8', function (err) {
                if (err) throw err;
                console.log('provider note data created!');
            });
        });
    };