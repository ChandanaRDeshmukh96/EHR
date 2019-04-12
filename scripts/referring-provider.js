const fileName = "referring-provider";
const csvFilePath = '../CSV/IEHR/'+fileName+'.csv';
const csv = require('csvtojson');
const fs = require('fs');
// let patient = require('patient-info.json').data;
let id = 0;

function generateRPId(){
    ++id;
    if(id<10){
        return "rp0"+id;
    }else{
        return "rp"+id;
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
            var refferingProviderData = {};
            refferingProviderData.providerUserID=generateRPId();
            refferingProviderData.salutation="";
            refferingProviderData.firstName=element.firstName;
            refferingProviderData.middleName=element.middleName;
            refferingProviderData.lastName=element.lastName;
            refferingProviderData.gender="";
            refferingProviderData.speciality=element.speciality;
            refferingProviderData.secondarySpeciality = element.secondarySpeciality;
            refferingProviderData.credentials=element.credentials;
            refferingProviderData.dob="";
            refferingProviderData.fax=element.fax;
            refferingProviderData.phone=element.phone;
            refferingProviderData.cell="";
            refferingProviderData.email="";
            refferingProviderData.npiNumber=element.npiNumber;
            refferingProviderData.address={};
            refferingProviderData.address.street=element.Address__street;
            refferingProviderData.address.city=element.Address__city;
            refferingProviderData.address.state=element.Address__state;
            refferingProviderData.address.zipCode=element.Address__zipCode;
            refferingProviderData.ssn="";
            refferingProviderData.smlNumber="";
            refferingProviderData.deaNumber="";
            refferingProviderData.availablityStart="12:00:00:am";
            refferingProviderData.availablityEnd="12:00:00:pm";

            wrapperData.data.push(refferingProviderData);
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
                console.log('referring provider data created!');
            });
        });
    };