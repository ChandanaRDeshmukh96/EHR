const fileName = "msg-template";
const csvFilePath = '../CSV/IEHR/'+fileName+'.csv';
const csv = require('csvtojson');
const fs = require('fs');
// let patient = require('patient-info.json').data;
let id = 0;

function generateTMPId(){
    ++id;
    if(id<10){
        return "TMP0"+id;
    }else{
        return "TMP"+id;
    }
};

function dataWrapper(data) {
    var wrapperData = {
        "info": {
            "status": "200",
            "message": "OK"
        },
        "data": []
    };
    var id =1;
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
        // console.log(element);
            var dataObj = {};
            dataObj.id=generateTMPId();
            dataObj.tempName=element.tempName;
            dataObj.template=element.template;

            wrapperData.data.push(dataObj);
        }
    });
    return wrapperData;
}

    
// function that can be accessible outside this file 
module.exports = function () {
    csv()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
            var formattedData = dataWrapper(jsonObj);
            fs.writeFile('../JSON/'+fileName+'.json', JSON.stringify(formattedData), 'utf8', function (err) {
                if (err) throw err;
                console.log('message template data created!');
            });
        });
    };
  
