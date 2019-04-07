const csvFilePath = '../CSV/blockTimeOfficeHoursPMEHR.csv';
const csv = require('csvtojson');
const fs = require('fs');
let provider = require('../../src/ehr/asset/data/en-us/PMEHR/feature/provider-info.json').data;

function findProviderUserID(lastName) {
    var providerInfo;
    // console.log("firstname, lastname", firstName, lastName)
    provider.forEach((item) => {
        // console.log(item.lastName);
        if (lastName == item.lastName) {
            // console.log(item);
           providerInfo = item;
        }
    });
    // console.log(providerInfo);
    return providerInfo;
    
}
function getDayOfWeek(dow){
    return [1,2,3,4,5];
}
function createProviderOfficeHoursData(ID, providerInfo,details) {
    var dataObj = {};
    var dow ="";
    dataObj.ID = ID;
    dataObj.start = details.start;
    dataObj.end = details.end;
    dataObj.duration= details.duration;
    dataObj.startTime = details.startTime;
    dataObj.endTime = details.endTime;
    dataObj.dow= getDayOfWeek(dow);
    dataObj.allDay = false;
    dataObj.description = details.description;
    dataObj.repeat= "everyday";
    dataObj.reason = "Closed";
    dataObj.providerInfo = {};
    dataObj.providerInfo.providerUserID=providerInfo.providerUserID;
    dataObj.providerInfo.salutation=providerInfo.salutation;
    dataObj.providerInfo.firstName=providerInfo.firstName;
    dataObj.providerInfo.lastName=providerInfo.lastName;
    dataObj.type="Break entry";

    return dataObj;
}

function createOfficeHours(data) {
    var blockTimeData = {
        "info": {
            "status": "200",
            "message": "OK"
        },
        "data": []
    };
    var id=6;
    data.forEach((provider) =>{
        var details={};
        var providerInfo=findProviderUserID(provider.providerName);
        var breakInfo=provider.officeHours.split("lunch between");
        var closed=breakInfo[0].split('-');
        var lunch=breakInfo[1].split('-');
        var blockTime=[];
        blockTime[0]={};
        blockTime[0].start="00:00"
        blockTime[0].end=closed[0].split("am")[0];
        blockTime[1]={};
        blockTime[1].start=closed[1].split("pm")[0];
        blockTime[1].end="24:00";
        blockTime[2]={};
        blockTime[2].start=lunch[0];
        blockTime[2].end=lunch[1];
        blockTime.forEach((Break)=>{
            details.start=Break.start;
            details.end=Break.end;
            details.duration="";
            details.startTime="";
            details.endTime="";
            details.description="closed";
            var providerOfficeHour=createProviderOfficeHoursData('bt'+id, providerInfo,details);
            id++;
            blockTimeData.data.push(providerOfficeHour);
        });
    });
    // console.log(moment().format('LT'));
    return blockTimeData;
}
csv()
    .fromFile(csvFilePath)
    .then((jsonObj) => {
        var formattedData = createOfficeHours(jsonObj);
        fs.writeFile('../JSON/blockTimeOfficeHoursPMEHR.json', JSON.stringify(formattedData), 'utf8', function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
    });