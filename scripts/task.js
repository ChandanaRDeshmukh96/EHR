const fileName = "task";
const csvFilePath = '../CSV/IEHR/'+fileName+'.csv';
const csv = require('csvtojson');
const fs = require('fs');
let patient = require('../JSON/patient-info.json').data;
let provider = require('../JSON/provider-info.json').data;
var moment = require("moment");
let id = 0;

function findChartNo(firstName, lastName) {
    var chartNumber = 0;
    // console.log("firstname, lastname", firstName, lastName)
    patient.forEach((item) => {
        if (firstName == item.firstName && lastName == item.lastName) {
            chartNumber = item.chartNumber;
        }
    });
    return chartNumber;
}

function findProviderId(lastname){
    console.log(lastname);
    var providerInfo = 0;
  
    provider.forEach((item) => {
        if (item.lastName==lastname){
          providerInfo=item;
        }
    });
    return providerInfo;
  };

function findLink(link){
    name = link.split(" ");
    var linkNo = "";
    linkNo = findChartNo(name[0], name[1]);
    if (!linkNo){
        if (name[0]!=""){
            linkNo = findProviderId(name[0]);
        }else{
            linkNo = findProviderId(name[1]);
        }
    }
    return linkNo;
}

function generateTaskId(){
    ++id;
    if(id>=100){
        return "TSK"+id;
    }else if(id>=10){
        return "TSK0"+id;
    }else{
        return "TSK00"+id;
    }
};

function createTaskData(element) {

    var dataObj = {};
    dataObj.id = generateTaskId();
    dataObj.task=element.task;
    dataObj.assignedTo=element.assignedTo;
    dataObj.createdBy=element.createdBy;
    dataObj.dueDate=moment(element.dueDate).format("MM/DD/YYYY");
    dataObj.completedStatus=element.completedStatus;
    dataObj.linkedToChart=element.linkedToChart == "NA" ? "" : findLink(element.linkedToChart);
    return dataObj;
}

function dataWrapper(data) {
    var taskData = {
        "info": {
            "status": "200",
            "message": "OK"
        },
        "data": []
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
        taskData['data'].push(createTaskData(element));
        }
    });
    return taskData;
}

// function that can be accessible outside this file 
module.exports = function accessLevels() {
    csv()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
            var formattedData = dataWrapper(jsonObj);
            fs.writeFile('../JSON/'+fileName+'.json', JSON.stringify(formattedData), 'utf8', function (err) {
                if (err) throw err;
                console.log('task data created!');
            });
        });
    };
    
    
    // redefineing the same piece of code so that this file can be solely executed.
    csv()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
            var formattedData = dataWrapper(jsonObj);
            fs.writeFile('../JSON/'+fileName+'.json', JSON.stringify(formattedData), 'utf8', function (err) {
                if (err) throw err;
                console.log('task data created!');
            });
        });