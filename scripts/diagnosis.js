// This JSON is coming from ICD code and not direct CSV.
// this creates a list of codes that includes 000.00 that is a placeholder. please remove that entry from the json after exec of this script file.
const fileName = "diagnosis";
const csv = require('csvtojson');
const fs = require('fs');
var moment = require("moment");
let ICD = require('../JSON/ICD-code.json').data;

var id=0;

function createAllProcedureData() {
    var diagnosisData = {
        "info": {
            "status": "200",
            "message": "OK"
        },
        "data": []
    };

    for(var edition in ICD){
        // console.log(cpt[edition]);
        edition1 = ICD[edition];
            var allcodes=Object.keys(edition1);
            allcodes.forEach((codeValue)=>{
                diagnosisData.data.push(codeValue);
            });   
    }
    return diagnosisData;
}

// function that can be accessible outside this file 
module.exports = function accessLevels() {
        fs.writeFile('../JSON/'+fileName+'.json', JSON.stringify(createAllProcedureData()), 'utf8', function (err) {
            if (err) throw err;
            console.log('Saved daignosis data!');
        });
    }
// redefineing the same piece of code so that this file can be solely executed.

    fs.writeFile('../JSON/'+fileName+'.json', JSON.stringify(createAllProcedureData()), 'utf8', function (err) {
        if (err) throw err;
        console.log('Saved daignosis data!');
    });
