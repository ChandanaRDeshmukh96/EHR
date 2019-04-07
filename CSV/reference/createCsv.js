const csv1 = require("csvtojson");
const JSONToCSV = require("json2csv").parse;
const FileSystem = require("fs");
var chilkat = require('chilkat_node10_win32');
var csvFilePath = "../CSV/PMEHR.csv";
let patient = require('../../src/ehr/asset/data/en-us/PMEHR/feature/patient-info.json').data;
let savePath = "../CSV/PMEHR-temp.csv"

function findChartNo(firstName, lastName) {
    var chartNumber;
    // console.log("firstname, lastname", firstName, lastName)
    patient.forEach((item) => {
        if (firstName == item.firstName && lastName == item.lastName) {
            chartNumber = item.chartNumber;
        }
    });
    // console.log(chartNumber);
    return chartNumber;
}

var csv = new chilkat.Csv();
csv.HasColumnNames = true;
var success;
success = csv.LoadFile(csvFilePath);
if (success !== true) {
    console.log("failure" + csv.LastErrorText);
    return;
}
else {
    console.log("loaded" + success);
}


    for (var i = 2; i < csv.NumRows; i++) {

        var name = csv.GetCell(i,0);
        name = name.split(" ");
        // console.log("name"+name);
        if(name!=""){
            var fname=name[0];
            var lname=name[1];
            var chartNo = findChartNo(fname, lname);
        // console.log("chartno"+chartNo);
            // if(!chartNo){
            //     csv.SetCell(i,1,"patient not found");
            // }
                csv.SetCell(i,1,chartNo);
                
            
        }
}
     
var csvDoc;
csvDoc = csv.SaveToString();

success = csv.SaveFile(savePath);
if (success !== true) {
    console.log(csv.LastErrorText);
}
