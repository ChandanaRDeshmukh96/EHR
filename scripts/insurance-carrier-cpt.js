const fileName = "insurance-carrier-cpt";
const csvFilePath = '../CSV/IEHR/'+fileName+'.csv';
const csv = require('csvtojson');
const fs = require('fs');
var moment = require("moment");
let patient = require('../JSON/patient-info.json').data;
let provider = require('../JSON/provider-info.json').data;
let insuranceInfo = require('../JSON/insurance-info.json').data;
let insuranceProviderInfo = require('../JSON/insurance-provider-info.json').data;

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
};

function getInsuranceProviderId(insuranceProvider) {
    var insuranceProviderID =0;
    insuranceProviderInfo.forEach((data) => {
        if(data.insuranceProvider === insuranceProvider){
            insuranceProviderID = data.insuranceProviderId;
        }
    });
    return insuranceProviderID;
};
function dataWrapper(data) {
    var insuranceCarrierCptData = {
        "info": {
            "status": "200",
            "message": "OK"
        },
        "data": {}
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
            if (!insuranceCarrierCptData['data'][element.edition]){
                insuranceCarrierCptData['data'][element.edition] = {};
            }
            insuranceCarrierCptData['data'][element.edition][element.code] = {};
                for(var j=2; j<props.length; j++){
                    var insProID = getInsuranceProviderId(props[j]);
                    insuranceCarrierCptData['data'][element.edition][element.code][insProID] = {};
                    insuranceCarrierCptData['data'][element.edition][element.code][insProID].copay = "Yes";
                    insuranceCarrierCptData['data'][element.edition][element.code][insProID].allowedAmount = element[props[j]];
                    }
                           
        }

    });
    return insuranceCarrierCptData;
}

// function that can be accessible outside this file 
module.exports = function accessLevels() {
    csv()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
            var formattedData = dataWrapper(jsonObj);
            fs.writeFile('../JSON/'+fileName+'.json', JSON.stringify(formattedData), 'utf8', function (err) {
                if (err) throw err;
                console.log('insurance carrier cpt data created!');
            });
        });
    };