// there is no CSV named group insurance info. this JSON is derived by insurance info csv

const fileName = "group-insurance-info";
const csvFilePath = '../CSV/IEHR/insurance-info.csv';
const csv = require('csvtojson');
const fs = require('fs');
var moment = require("moment");
let patient = require('../JSON/patient-info.json').data;
let provider = require('../JSON/provider-info.json').data;
let insuranceInfo = require('../JSON/insurance-info.json').data;
let insuranceProviderInfo = require('../JSON/insurance-provider-info.json').data;

function findChartNo(firstName, lastName) {
    var chartNumber;
    patient.forEach((item) => {
        if (firstName == item.firstName && lastName == item.lastName) {
            chartNumber = item.chartNumber;
        }
    });
    return chartNumber;
};
function getUniqueKey2(element) {
    var name = element.patientName.split(" ");
    var chartNumber = findChartNo(name[0], name[1]);
    var key =0;
    insuranceInfo.forEach((data) => {
        if(data.chartNumber === chartNumber){
            data.insuranceData.forEach((insData) =>{

                if(insData.insuranceType === element.insuranceType){
                    key = insData.uniqueKey2;
                }
            });
        }
    });
    return key;
};
function getInsuranceProviderId(element) {
    var id = 0;
    insuranceProviderInfo.forEach((data)=>{
        if(data.insuranceProvider === element.insuranceProvider){
            id = data.insuranceProviderId;
        }
    });
    return id;
};
function getGuarantorArray(element) {
    var name = element.guarantorName.split(" ");
    var chartNumber = findChartNo(name[0], name[1]);
    var guarantorArr = [];
    var arrayObj = {};
    arrayObj.patientInfo ={};
    arrayObj.patientInfo.chartNumber = chartNumber;
    arrayObj.patientInfo.relationship = element.guarantorRelationship;
    arrayObj.patientInfo.groupInsId = element.guarantorGroupInsId;
    guarantorArr.push(arrayObj);
    return guarantorArr;
};

// function getDependentArray(element){
//     var name = element.dependentName.split(" ");
//     var chartNumber = findChartNo(name[0], name[1]);
//     var dependentArr = [];
//     var arrayObj = {};
//     arrayObj.patientInfo ={};
//     arrayObj.patientInfo.chartNumber = chartNumber;
//     arrayObj.patientInfo.relationship = element.dependentRelationship;
//     arrayObj.patientInfo.groupInsId = element.dependentGroupInsID;
//     guarantorArr.push(arrayObj);
//     return dependentArr;
// };
function createGroupInsuranceData(element) {
    var dataObj = {};
    dataObj.uniqueKey2 = getUniqueKey2(element);
    dataObj.insuranceId = element.insuranceId;
    dataObj.insuranceProviderId = getInsuranceProviderId(element);
    dataObj.insuranceProvider = element.insuranceProvider;
    dataObj.insurancePlan = element.insurancePlan;
    dataObj.isThePlanActive = element.isThePlanActive;
    dataObj.patientResponsibility = element.patientResponsibility;
    dataObj.copay = element.copay? parseInt(element.copay) : 0;
    dataObj.coinsurance = element.coinsurance ? element.coinsurance : 0;
    dataObj.deductibleMet = element.deductibleMet;
    dataObj.deductibleMetYtd = 0;
    dataObj.deductible = parseInt(element.deductible);
    dataObj.effectiveStartDate = moment(element.effectiveStartDate).format("MM/DD/YYYY");
    dataObj.effectiveEndDate = moment(element.effectiveEndDate).format("MM/DD/YYYY");
    dataObj.selectedCoverage = 200;
    // if(element.hasDependents){
    //     dataObj.dependentArr = getDependentArray(element);
    // }
    dataObj.dependentArr = [];
    if(element.isGuarantor === ("No" || "no")){
        dataObj.guarantorArr = getGuarantorArray(element);
    }else{
        dataObj.guarantorArr = [];
    }
    return dataObj;
}

function dataWrapper(data) {
    var patientGroupInsuranceInfoData = {
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
                patientGroupInsuranceInfoData['data'].push(createGroupInsuranceData(element));  
        }

    });
    return patientGroupInsuranceInfoData;
}

// function that can be accessible outside this file 
module.exports = function () {
    csv()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
            var formattedData = dataWrapper(jsonObj);
            fs.writeFile('../JSON/'+fileName+'.json', JSON.stringify(formattedData), 'utf8', function (err) {
                if (err) throw err;
                console.log('group insurance data created!');
            });
        });
    };
    