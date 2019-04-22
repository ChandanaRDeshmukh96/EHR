const fileName = "referring-labs";
const csvFilePath = '../CSV/IEHR/'+fileName+'.csv';
const csv = require('csvtojson');
const fs = require('fs');
// let patient = require('patient-info.json').data;
let id = 0;

function generateRPId(){
    ++id;
    if(id<10){
        return "TMP0"+id;
    }else{
        return "TMP"+id;
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
            dataObj.id=generateRPId();
            dataObj.title=element.title;
            dataObj.value=element.value;
            dataObj.address={};
            dataObj.address.street=element.Address__street;
            dataObj.address.city=element.Address__city;
            dataObj.address.state=element.Address__state === "OH" ? "Ohio" : element.Address__state;
            dataObj.address.zipCode=element.Address__zipCode;
            dataObj.address.locationID="";
            dataObj.contact = {};
            dataObj.contact.phone1 = element.phone1;
            dataObj.contact.phone2 = element.phone2;
            dataObj.contact.primaryContactName = "";
            dataObj.contact.email = element.email;
            dataObj.contact.fax = getFaxFormat(element.fax);
            dataObj.contact.website = element.website;

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
                console.log('referring-labs data created!');
            });
        });
    };
  
