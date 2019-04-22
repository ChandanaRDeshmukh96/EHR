const fileName = "insurance-provider-info";
const csvFilePath = '../CSV/IEHR/'+fileName+'.csv';
const csv = require('csvtojson');
const fs = require('fs');
var moment = require("moment");
let patient = require('../JSON/patient-info.json').data;
let provider = require('../JSON/provider-info.json').data;
var id=0;

function findChartNo(firstName, lastName) {
    var chartNumber;
    patient.forEach((item) => {
        if (firstName == item.firstName && lastName == item.lastName) {
            chartNumber = item.chartNumber;
        }
    });
    return chartNumber;
};
function generateInsuranceProviderID(){
    ++id;
    if(id >= 100){
        return "ip"+id;
    }
    else if(id>=10){
        return "ip0"+id;
    }else{
        return "ip00"+id;
    }
};

function getFaxFormat(fax){
    var formattedFax = "";
    while(fax.indexOf('-')!== -1){
        var i = fax.indexOf('-');
        fax= fax.slice(0,i)+fax.slice(i+1);
    }
    formattedFax='-'+fax.slice(0,3)+'-'+fax.slice(3);
    return formattedFax;
};

function createInsuranceProviderInfoData(element) {
    var dataObj = {};
    dataObj.insuranceProviderId = generateInsuranceProviderID();
    dataObj.insuranceProvider = element.insuranceProvider;
    dataObj.insurancePlan = element.insurancePlan;
    dataObj.isThePlanActive = "Yes";
    dataObj.patientResponsibility = "Copay";
    dataObj.copay = element.copay? parseInt(element.copay) : 0;
    dataObj.coinsurance = element.coinsurance ? element.coinsurance : 0;
    dataObj.deductibleMet = "Yes";
    dataObj.deductible = 2000;
    dataObj.effectiveStartDate = moment(element.effectiveStartDate).format("MM/DD/YYYY");
    dataObj.effectiveEndDate = moment(element.effectiveEndDate).format("MM/DD/YYYY");
    dataObj.selectedCoverage = 200;
    dataObj.syncEnable = true;
    dataObj.address={};
            dataObj.address.street=element.Address__street;
            dataObj.address.city=element.Address__city;
            dataObj.address.state=element.Address__state === "OH" ? "Ohio" : element.Address__state;
            dataObj.address.zip=element.Address__zipCode;
            dataObj.contact={};
            dataObj.contact.primaryContactName = element.primaryContactName;
            dataObj.contact.phone = element.phone;
            dataObj.contact.phone1 = element.phone1;
            dataObj.contact.fax = getFaxFormat(element.fax);
            dataObj.contact.website = element.website;
            dataObj.contact.email = element.email;
            dataObj.payerId = element.payerId;

    return dataObj;
}

function dataWrapper(data) {
    var insuranceProviderData = {
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
            insuranceProviderData['data'].push(createInsuranceProviderInfoData(element));  
        }

    });
    return insuranceProviderData;
}
// function that can be accessible outside this file 
module.exports = function accessLevels() {
    csv()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
            var formattedData = dataWrapper(jsonObj);
            fs.writeFile('../JSON/'+fileName+'.json', JSON.stringify(formattedData), 'utf8', function (err) {
                if (err) throw err;
                console.log('insurance provider info data created!');
            });
        });
    };
    