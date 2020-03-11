// If you want to execute single files, please refer to "patient-info.js"

// importing all functions from different files
// files having the name "patient-info" ('-' separated) is to be imported by the name "patientInfo" (camelCasing)

var accessLevels = require('./access-levels.js');
var allergyForm = require('./allergy-form.js');
var cptCode = require('./cpt-codes.js');
var icdCode = require('./ICD-code.js');
var allProcedure = require('./allProcedure.js');
var diagnosis = require('./diagnosis.js');
var familyInfo = require('./family-info.js');
var familyMedicalHistory = require('./family-medical-history.js');
var immunization = require('./immunization.js');
var prescription = require('./prescription.js');
var patientMedicalHistory = require('./patient-medical-history.js');
var problemList = require('./problem-list.js');
var providerNote = require('./provider-note.js');
var recallList = require('./recall-list.js');
var referringProvider = require('./referring-provider.js');
var socialHistory = require('./social-history.js');
var surgicalHistory = require('./surgical-history.js');
var task = require('./task.js');
var medicationList = require('./medication-list.js');
var patientVital = require('./patient-vital.js');
var referringLabs = require('./referring-labs.js');
var imagingReport = require('./imaging-report.js');
var patientForms = require('./patient-forms.js');
var patientLetters = require('./patient-letter.js');
var patientNotes = require('./patient-notes.js');
var patientReport = require('./patient-report.js');


// grouping similar data into one function
function staffAndPatient() {
    // executing and creating JSON file for all data
    console.log("\n\ncreating staff and patient data ...\n\n");
    var patientInfo = require('./patient-info.js');
    patientInfo();
    var providerInfo = require('./provider-info.js');
    providerInfo();
    var medicalStaffInfo = require('./medical-staff-info.js');
    medicalStaffInfo();

};
// staffAndPatient();
// patientInfo();   

function insurance() {
    console.log("\n\ncreating insurance data...\n\n");

    var p1 = new Promise(function (resolve, reject) {
        setTimeout(() => {
            var insuranceInfo = require('./insurance-info.js');
            insuranceInfo();
        }, 100, "insInfo");
    });
    var p2 = new Promise(function (resolve, reject) {
        setTimeout(() => {
            var groupInsuranceInfo = require('./group-insurance-info.js');
            groupInsuranceInfo();
        }, 100, "grpInsInfo");
    });

    Promise.all([p1, p2]).then(function (values) {
        var insuranceProviderInfo = require('./insurance-provider-info.js');
        insuranceProviderInfo();
        var insuranceCarrierCpt = require('./insurance-carrier-cpt.js');
        insuranceCarrierCpt();
    });
};

function blockTimeAndAppointments() {
    console.log("\n\ncreating block time and appointments data...\n\n");
    var appointments = require('./appointments.js');
    appointments();
    var blockTime = require('./block-time.js');
    blockTime();
};

function soapNotesCodes() {
    console.log("\n\ncreating ICD and CPT codes list of codes...\n\n");
    icdCode();
    cptCode();
    diagnosis();
    prescription();
    allProcedure();
    providerNote();
}

function toolData() {
    console.log("\n\ncreating tool data...\n\n");
    accessLevels();
    referringLabs();
    recallList();
    referringProvider();
    task();
};

function patientChartData() {
    console.log("\n\ncreating patient-chart data...\n\n");
    allergyForm();
    familyInfo();
    familyMedicalHistory();
    immunization();
    patientMedicalHistory();
    problemList();
    socialHistory();
    surgicalHistory();
    medicationList();
    patientVital();
    imagingReport();
    patientForms();
    patientLetters();
    patientNotes();
    patientReport();
}

module.exports = function () {
    staffAndPatient();
    setTimeout(insurance, 3000);
    setTimeout(blockTimeAndAppointments, 6000);
    setTimeout(soapNotesCodes, 9000);
    setTimeout(toolData, 12000);
    setTimeout(patientChartData, 15000);
}
// insurance();
// blockTimeAndAppointments();
// toolData();
// patientChartData();


/* basic functionality to reduce manual time is implemented.
  to improve this functionality these steps can be added -->
  -> check if the fucntion is getting executed twice. i.e., does export func export whole doc or only the func?
  -> use promises to create sections of data one after the other
  -> use delay time to display messages properly so that the user gets to know what is happening
  -> group the sections properly for better results (group all dependecies together.
    ex1: insurance data is interdependent group them together.
    ex2: patientChart data is dependent on patient data group them differently and create patient data first.)
  -> to automate the changes in Execl online, look for some webhooks. Webhook must trigger the execution of this file which generates all data.
*/