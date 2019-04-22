const fileName = "ICD-code";
const csvFilePath = '../CSV/IEHR/'+fileName+'.csv';
const csv = require('csvtojson');
const fs = require('fs');
let patient = require('../JSON/patient-info.json').data;
let provider = require('../JSON/provider-info.json').data;
let id = 0;

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

function dataWrapper(data) {
    var icdCodeData = {
        "info": {
            "status": "200",
            "message": "OK"
        },
        "data": {}
    };

    data.forEach(element => { 
        var flag = 0;
        var props=Object.keys(element);
        for(var j=0; j<props.length; j++){
            if(element[props[j]]!=""){
                flag=1;
                break;
            }
        }
        if(flag == 1){   
        if(isEmpty(icdCodeData['data'][element.edition])){
            icdCodeData['data'][element.edition] = {};
            icdCodeData['data'][element.edition]["000.00"]={};
            icdCodeData['data'][element.edition]["000.00"].description = "Placeholder";
            icdCodeData['data'][element.edition]["000.00"].cost = "0";
        }
            icdCodeData['data'][element.edition][element.code]={};
            icdCodeData['data'][element.edition][element.code].description = element.description;
            icdCodeData['data'][element.edition][element.code].cost = "0";
        
    }
});
    return icdCodeData;
}
// function that can be accessible outside this file 
module.exports = function accessLevels() {
csv()
    .fromFile(csvFilePath)
    .then((jsonObj) => {
        var formattedData = dataWrapper(jsonObj);
        fs.writeFile('../JSON/'+fileName+'.json', JSON.stringify(formattedData), 'utf8', function (err) {
            if (err) throw err;
            console.log('ICD code data Saved!');
        });
    });
}
