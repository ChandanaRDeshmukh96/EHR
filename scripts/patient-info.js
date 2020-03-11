// to execute the function directlly, please type in ---> node -e "require('./patient-info.js')()"
// if the exported funtion has a name ---> node -e 'require("./patient-info")func_name()'

const bookName = "IEHR"
const fileName = "patient-info";
const csvFilePath = '../CSV/' + bookName + '/' + fileName + '.csv';
const csv = require('csvtojson');
const fs = require('fs');
var moment = require("moment");
// let patient = require('patient-info.json').data;

function dataWrapper(data) {
    var patientSurgicalHistoryData = {
        "info": {
            "status": "200",
            "message": "OK"
        },
        "data": []
    };
    var id = 0;
    data.forEach(element => {
        var flag = 0;
        var props = Object.keys(element);
        for (var j = 0; j < props.length; j++) {
            if (element[props[j]] != "") {
                flag = 1;
                break;
            }
        }
        if (flag == 1) {
            var patientsData = {};
            // console.log(element);
            patientsData.firstName = element.firstName;
            patientsData.middleName = element.middleName;
            patientsData.lastName = element.lastName;
            patientsData.dob = moment(element.dob, "mm/dd/yyyy").format("MM/DD/YYYY");
            patientsData.gender = element.gender;
            patientsData.maritalStatus = element.maritalStatus;
            patientsData.studentStatus = element.studentStatus;
            patientsData.employmentStatus = element.employmentStatus;
            patientsData.Employer = element.Employer;
            patientsData.email = element.email;
            patientsData.ssn = element.ssn;
            patientsData.preferredLanguage = element.preferredLanguage;
            patientsData.race = element.race;
            patientsData.ethnicity = element.ethnicity;
            patientsData.religion = element.religion;
            patientsData.homePhone = element.homePhone;
            patientsData.workPhone = element.workPhone;
            patientsData.Address = {};
            patientsData.Address.street = element.Address__ + ", " + element.Address__street;
            patientsData.Address.city = element.Address__city;
            patientsData.Address.state = element.Address__state === "OH" ? "Ohio" : element.Address__state;
            patientsData.Address.zipCode = element.Address__zipCode;
            patientsData.contact = {};
            patientsData.contact.cell = element.contact__cell;
            patientsData.chartNumber = element.chartNumber;
            patientsData.id = id++;
            patientsData.patientProfileImage = element.patientProfileImage;

            patientSurgicalHistoryData.data.push(patientsData);
        }
    });
    return patientSurgicalHistoryData;
}

// this is the main function. 
// exporting this function to make it accessible elsewhere.

module.exports = function () {
    csv()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
            var formattedData = dataWrapper(jsonObj);
            fs.writeFile('../JSON/' + bookName + '/' + fileName + '.json', JSON.stringify(formattedData), 'utf8', function (err) {
                if (err) throw err;
                console.log('Patient data created!');
            });
        });
};