// icd and cpt codes creation is similar. 
// cpt codes have "type field extra when compared to ICD codes"
const fileName = "cpt-codes";
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
};

function getTypeCode(type){
    //to return the proper code for type; MED, treatment, etc
    switch(type){
        case "Medicine" : {
            return "MED";
            break;
        }
        case "Treatment (TX)" : {
            return "Tx";
            break;
        }
        case "Lab" : {
            return "Labs";
            break;
        }
        default : return type;
        break;

    }
}

function dataWrapper(data) {
    var cptCodeData = {
        "info": {
            "status": "200",
            "message": "OK"
        },
        "data": {}
    };

    data.forEach(element => { 
        var flag = 0;
        var props=Object.keys(element);
        // this condition is to remove empty rows in csv
        for(var j=0; j<props.length; j++){
            if(element[props[j]]!=""){
                flag=1;
                break;
            }
        }
        if(flag == 1){   
        // check if the edition is present, and add a place holder with cost 0.
        if(isEmpty(cptCodeData['data'][element.edition])){
            cptCodeData['data'][element.edition] = {};
            cptCodeData['data'][element.edition]["000.00"]={};
            cptCodeData['data'][element.edition]["000.00"].type = "Procedure";
            cptCodeData['data'][element.edition]["000.00"].description = "Placeholder";
            cptCodeData['data'][element.edition]["000.00"].cost = "0";
        }else{
            cptCodeData['data'][element.edition][element.code]={};
            cptCodeData['data'][element.edition][element.code].type = getTypeCode(element.type);
            cptCodeData['data'][element.edition][element.code].description = element.description;
            cptCodeData['data'][element.edition][element.code].cost = element.cost;
        }
    }
});
    return cptCodeData;
}


// fucntion that can be accessible outside this file 
module.exports = function () {
csv()
    .fromFile(csvFilePath)
    .then((jsonObj) => {
        var formattedData = dataWrapper(jsonObj);
        fs.writeFile('../JSON/'+fileName+'.json', JSON.stringify(formattedData), 'utf8', function (err) {
            if (err) throw err;
            console.log('cpt-codes created!');
        });
    });
};
