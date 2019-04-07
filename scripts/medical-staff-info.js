const fileName = "medical-staff-info";
const csvFilePath = '../CSV/IEHR/'+fileName+'.csv';
const csv = require('csvtojson');
const fs = require('fs');
// let patient = require('patient-info.json').data;

function generateStaffId(id){
    if(id>100){
        return "S"+id;
    }else if(id>10){
        return "S0"+id;
    }else{
        return "S00"+id;
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
    // var staffData = {};
    var id =1;
    data.forEach(element => {
        // console.log(element);

        var flag = 0;
        var props=Object.keys(element);
        for(var j=0; j<props.length; j++){
            if(element[props[j]]!=""){
                flag=1;
                break;
            }
        }
        if(flag == 1){
            var staffData = {};
            staffData.staffId=element.staffId;
            staffData.firstName=element.firstName;
            staffData.middleName=element.middleName;
            staffData.lastName=element.lastName;
            staffData.suffix=element.suffix;
            staffData.dob=element.dob;
            staffData.gender=element.gender;
            staffData.address={};
            staffData.address.street=element.Address__street;
            staffData.address.city=element.Address__city;
            staffData.address.state=element.Address__state;
            staffData.address.zipCode=element.Address__zipCode;
            staffData.contact={};
            staffData.contact.primaryPhone = element.primaryPhone;
            staffData.contact.primaryPhoneType = element.primaryPhoneType;
            staffData.contact.alternatePhone = element.alternatePhone;
            staffData.contact.alternatePhoneType = element.alternatePhoneType;
            staffData.email=element.email;
            staffData.ssn=element.ssn;
            staffData.empStartDate=element.empStartDate;
            staffData.position=element.position;
            staffData.credentials=element.credentials;

            id=id+1;
            wrapperData.data.push(staffData);
        }
        });
    return wrapperData;
}
// function that can be accessible outside this file 
module.exports = function accessLevels() {
    csv()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
            var formattedData = dataWrapper(jsonObj);
            fs.writeFile('../JSON/'+fileName+'.json', JSON.stringify(formattedData), 'utf8', function (err) {
                if (err) throw err;
                console.log('medical staff data created!');
            });
        });
    };
