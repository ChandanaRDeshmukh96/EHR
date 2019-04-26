const fileName = "provider-info";
const csvFilePath = '../CSV/IEHR/'+fileName+'.csv';
const csv = require('csvtojson');
const fs = require('fs');
var moment = require("moment");
// let patient = require('patient-info.json').data;

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
            var providerData = {};
            providerData.providerUserID=element.providerUserID;
            providerData.salutation=element.salutation;
            providerData.firstName=element.firstName;
            providerData.middleName=element.middleName;
            providerData.lastName=element.lastName;
            providerData.gender=element.gender;
            providerData.speciality=element.speciality;
            providerData.credentials=element.credentials;
            providerData.dob=moment(element.dob).format("MM/DD/YYYY");
            providerData.phone=element.phone;
            providerData.cell=element.cell;
            providerData.email=element.email;
            providerData.address={};
            providerData.address.street=element.Address__+", "+ element.Address__street;
            providerData.address.city=element.Address__city;
            providerData.address.state=element.Address__state === "OH" ? "Ohio" : element.Address__state;
            providerData.address.zipCode=element.Address__zipCode;
            providerData.npiNumber=element.npiNumber;
            providerData.smlNumber=element.smlNumber;
            providerData.deaNumber=element.deaNumber;
            providerData.availablityStart="12:00:00:am";
            providerData.availablityEnd="12:00:00:pm";
            providerData.providerNumber=id++;
            providerData.ssn=element.ssn;
            providerData.practiceLicenseNumber=element.practiceLicenseNumber;
            providerData.practiceLicenseExpirationDate=element.practiceLicenseExpirationDate;
            providerData.stateIssuingLicense=element.stateIssuingLicense == "OH" ? "Ohio" : element.stateIssuingLicense;
            providerData.secondaryspeciality=element.secondaryspeciality;
            providerData.suffix="";
            providerData.primaryPhoneType="Home";
            providerData.alternatePhoneType="Cell";


            wrapperData.data.push(providerData);
        }
    });
    return wrapperData;
}

module.exports = function providerInfo(){
    csv()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
            var formattedData = dataWrapper(jsonObj);
            fs.writeFile('../JSON/'+fileName+'.json', JSON.stringify(formattedData), 'utf8', function (err) {
                if (err) throw err;
                console.log('Provider data created!');
            });
        });
}

  
