// This JSON is coming from CPT code and not direct CSV.
const fileName = "allProcedure";
const csv = require('csvtojson');
const fs = require('fs');
var moment = require("moment");
let cpt = require('../JSON/cpt-codes.json').data;

var id = 0;

function createAllProcedureData() {
    var allProcedureData = {
        "info": {
            "status": "200",
            "message": "OK"
        },
        "data": {
            "prescription": [],
            "injection": [],
            "imaging": [],
            "immunization": [],
            "labs": [],
            "procedure": [],
            "e/m": [],
            "px": [],
            "med": [],
            "imm": [],
            "treatment": [],
            "surgery": []
        }
    };

    for (var edition in cpt) {
        // console.log(cpt[edition]);
        edition1 = cpt[edition];
        var allcodes = Object.keys(edition1);
        allcodes.forEach((codeValue) => {

            switch (edition1[codeValue].type) {
                case "prescription": {
                    allProcedureData.data.prescription.push(codeValue);
                    break;
                }
                case "MED": {
                    allProcedureData.data.injection.push(codeValue);
                    break;
                }
                case "Imaging": {
                    allProcedureData.data.imaging.push(codeValue);
                    break;
                }
                case "IMM": {
                    allProcedureData.data.immunization.push(codeValue);
                    break;
                }
                case "Labs": {
                    // console.log(codeValue);
                    allProcedureData.data.labs.push(codeValue);
                    break;
                }
                case "Procedure": {
                    allProcedureData.data.procedure.push(codeValue);
                    break;
                }
                case "E/M": {
                    allProcedureData.data["e/m"].push(codeValue);
                    break;
                }
                case "px": {
                    allProcedureData.data.px.push(codeValue);
                    break;
                }
                case "med": {
                    allProcedureData.data.med.push(codeValue);
                    break;
                }
                case "imm": {
                    allProcedureData.data.imm.push(codeValue);
                    break;
                }
                case "Tx": {
                    allProcedureData.data.treatment.push(codeValue);
                    break;
                }
                case "Surgery": {
                    allProcedureData.data.surgery.push(codeValue);
                    break;
                }
            }
        });


    }
    return allProcedureData;
}
// function that can be accessible outside this file 
module.exports = function accessLevels() {
    fs.writeFile('../JSON/'+fileName+'.json', JSON.stringify(createAllProcedureData()), 'utf8', function (err) {
        if (err) throw err;
        console.log('Saved all Procedure info!');
    });
};
