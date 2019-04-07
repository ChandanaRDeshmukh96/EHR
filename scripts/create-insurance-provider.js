const fileName = "insurance-provider";
const csvFilePath = '../CSV/IEHR/'+fileName+'.csv';
const csv = require('csvtojson');
const fs = require('fs');
var moment = require("moment");
var id=0;

function generateInsuranceProviderID(){
    ++id;
    if(id >= 100){
        return "ip"+id;
    }
    else if(id>=10){
        return "ip0"+id;
    }else{
        return "ip00"+id;
    }
};

function createInsuranceProviderInfoData(element) {
    var dataObj = {};
    dataObj.insuranceProviderId = generateInsuranceProviderID();
    dataObj.insuranceProvider = element.insuranceProvider;
    dataObj.insurancePlan = element.insurancePlan;
    dataObj.isThePlanActive = element.isThePlanActive;
    dataObj.patientResponsibility = element.patientResponsibility;
    dataObj.copay = element.copay? parseInt(element.copay) : 0;
    dataObj.coinsurance = element.coinsurance ? element.coinsurance : 0;
    dataObj.deductibleMet = element.deductibleMet;
    dataObj.deductibleMetYtd = 0;
    dataObj.deductible = parseInt(element.deductible);
    dataObj.effectiveStartDate = moment(element.effectiveStartDate).format("MM/DD/YYYY");
    dataObj.effectiveEndDate = moment(element.effectiveEndDate).format("MM/DD/YYYY");
    dataObj.selectedCoverage = 200;
    dataObj.syncEnable = true;
    dataObj.address={};
    dataObj.address.street=element.Address__street;
    dataObj.address.city=element.Address__city;
    dataObj.address.state=element.Address__state;
    dataObj.address.zipCode=element.Address__zipCode;
            dataObj.contact={};
            dataObj.contact.primaryContactName = element.primaryContactName;
            dataObj.contact.phone = element.phone;
            dataObj.contact.phone1 = element.phone1;
            dataObj.contact.fax = element.fax;
            dataObj.contact.website = element.website;
            dataObj.contact.email = element.email;
            dataObj.contact.payerId = element.payerId;
            // "isThePlanActive": "Yes",
            // "patientResponsibility": "Copay",
            // "copay": 0,
            // "coinsurance": 0,
            // "deductibleMet": "Yes",
            // "deductible": 2000,

    return dataObj;
}

function dataWrapper(data) {
    var insuranceProviderData = {
        "info": {
            "status": "200",
            "message": "OK"
        },
        "data": []
    };

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
            insuranceProviderData['data'].push(createInsuranceProviderInfoData(element));  
        }

    });
    return insuranceProviderData;
}

csv()
    .fromFile(csvFilePath)
    .then((jsonObj) => {
        var formattedData = dataWrapper(jsonObj);
        fs.writeFile('./JSON/insurance-provider.json', JSON.stringify(formattedData), 'utf8', function (err) {
            if (err) throw err;
            console.log('Saved insurance-info!');
        });
    });