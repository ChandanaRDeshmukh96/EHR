const fileName = "appointments";
const csvFilePath = '../CSV/IEHR/' + fileName + '.csv';
const csv = require('csvtojson');
const fs = require('fs');
let patient = require('../JSON/patient-info.json').data;
let provider = require('../JSON/provider-info.json').data;
var moment = require("moment");
let aptId = 0;

function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key))
      return false;
  }
  return true;
};


function getDayOfWeek(repeat){
  var dow = repeat.toLowerCase().split("every")[1];

  switch(dow.trim()){
    case "monday" : return [1];
    case "tuesday" : return [2];
    case "wednesday" : return [3];
    case "thursday" : return [4];
    case "friday" : return [5];
    case "saturday" : return [6];
    case "sunday" : return [0];
    case "day" : return [1,2,3,4,5,6,0];
  }
}

function getStartDate(startDate, repeat){
  if(repeat.toLowerCase() == "never"){
    return startDate;
  }
  var startday =  moment(startDate, "ddd MMM D YYYY HH:mm").day();
  var currentday = parseInt(getDayOfWeek(repeat));
  currentday = currentday<startday ? currentday+7 : currentday;
  startDate = moment(startDate, "ddd MMM D YYYY HH:mm").day(currentday).format("ddd MMM D YYYY HH:mm");
  return startDate;
}


function findChartNo(firstName, lastName) {
  var chartNumber;
  patient.forEach((item) => {
    if (firstName == item.firstName && lastName == item.lastName) {
      chartNumber = item.chartNumber;
    }
  });
  return chartNumber;
};

function findProviderInfo(lastname) {
  // console.log(lastname);
  var providerInfo = {};

  provider.forEach((item) => {
    if (item.lastName == lastname) {
      providerInfo = item;
    }
  });
  return providerInfo;
};

function generateAptId(id) {
  ++aptId;
  if (aptId < 10) {
    return "ar0" + aptId;
  }
  return "ar" + aptId;
};

function getDow(repeat) {
  if(repeat){
    if (repeat.indexOf(" ")!=-1){
      repeat = repeat.split(" ")[1];
    }
  }
  switch (repeat) {
    case "Monday": {
      return [1];
      break;
    };
    case "Tuesday": {
      return [2];
      break;
    };
    case "Wednesday": {
      return [3];
      break;
    };
    case "Thursday": {
      return [4];
      break;
    };
    case "Friday": {
      return [5];
      break;
    };
    case "Saturday": {
      return [6];
      break;
    };
    case "Sunday": {
      return [0];
      break;
    };
    case "Everyday": {
      return [1, 2, 3, 4, 5];
      break;
    };
    case "Never":{
      return [];
      break;
    }


  }
};

function createCheckedInWaitingObjRepeat(element) {
  console.log(element.patientName + " " + element.selectedRepeat);
  var checkInObj = {};
  checkInObj.appointmentID = generateAptId();
    var rangeDeviationAptID = checkInObj.appointmentID + "_01032022";
    checkInObj.startTime = getStartDate("Mon Jan 03 2022 " + moment(element.startTime, "hh:mm a").format("HH:mm"), element.selectedRepeat);
    checkInObj.rangeStart = getStartDate("Mon Jan 03 2022 " + moment(element.startTime, "hh:mm a").format("HH:mm"), element.selectedRepeat);
    checkInObj.endTime = getStartDate("Mon Jan 03 2022 " + moment(element.startTime, "hh:mm a").add(parseInt(element.duration), "minutes").format("HH:mm"),element.selectedRepeat);
    checkInObj.start = moment(element.startTime, "hh:mm a").format("HH:mm");
    checkInObj.end = moment(element.startTime, "hh:mm a").add(parseInt(element.duration), "minutes").format("HH:mm")
    checkInObj.duration = moment(element.duration, "mm").format("HH:mm");
    checkInObj.reasonForVisit = element.reasonForVisit;
    checkInObj.allDay = false;
    checkInObj.selectedRepeat = element.selectedRepeat;
    checkInObj.rangeDeviation = {};
    checkInObj.rangeDeviation[rangeDeviationAptID] = {};
    
    checkInObj.rangeDeviation[rangeDeviationAptID].appointmentType = element.appointmentType;
    checkInObj.rangeDeviation[rangeDeviationAptID].checkInTime = moment(element.startTime, "hh:mm a").format("HH:mm");
    checkInObj.rangeDeviation[rangeDeviationAptID].providerInfo = {};
    checkInObj.rangeDeviation[rangeDeviationAptID].providerInfo.providerUserID = findProviderInfo(element.providerName).providerUserID;
    checkInObj.rangeDeviation[rangeDeviationAptID].reasonForVisit = element.reasonForVisit;
    console.log(checkInObj.rangeDeviation[rangeDeviationAptID]);
    checkInObj.rangeDeviation[rangeDeviationAptID].status = "Checked in waiting";
    checkInObj._recurring = true;
    // checkInObj._recurring = false;
    checkInObj.dow = element.selectedRepeat ? getDow(element.selectedRepeat) :console.log(element);
    checkInObj.rangeEnd = getStartDate("Mon, Apr 04 2022 " + moment(element.startTime, "hh:mm a").add(parseInt(element.duration), "minutes").format("HH:mm"), element.selectedRepeat);
    checkInObj.status = element.selectedRepeat.toLowerCase() === "never" ? element.status : "Pending";
    checkInObj.appointmentType = element.appointmentType;
    checkInObj["contact-home"] = element["contact-home"];
    checkInObj.cell = element.cell;
    checkInObj.work = element.work;
    checkInObj.treatmentDate = moment("01/03/2022").add(3, "months").format("MM/DD/YYYY");
    checkInObj.treatmentTime = moment(element.startTime, "hh:mm a").format("HH:mm");
    checkInObj.providerInfo = {};
    checkInObj.providerInfo.providerUserID = findProviderInfo(element.providerName).providerUserID;
    checkInObj.patientInfo = {};
    var name = element.patientName.split(" ");
    checkInObj.patientInfo.chartNumber = findChartNo(name[0], name[1]);
    checkInObj.checkInData = {};
    checkInObj.checkInData.patientCondition = {};
    checkInObj.checkInData.patientCondition.employment = element.employment;
    checkInObj.checkInData.patientCondition.autoAccident = element.autoAccident;
    checkInObj.checkInData.patientCondition.state = "";
    checkInObj.checkInData.patientCondition.otherAccident = element.otherAccident;
    checkInObj.checkInData.currentIllnessDate = "";
    checkInObj.checkInData.lastIllnessDate = element.lastIllnessDate;
    checkInObj.checkInData.unableToWork = {};
    checkInObj.checkInData.unableToWork.from = "";
    checkInObj.checkInData.unableToWork.to = "";
    checkInObj.checkInData.otherDate = {};
    checkInObj.checkInData.otherDate.from = "";
    checkInObj.checkInData.otherDate.to = "";
    checkInObj.checkInData.referringProviderId = findProviderInfo(element.referringProvider);

  return checkInObj;

};

function createCheckedInWaitingObj(element) {

  var checkInObj = {};
  checkInObj.appointmentID = generateAptId();
  checkInObj.start = getStartDate(moment(element.aptDate).format("ddd MMM DD YYYY") + moment(element.startTime, "hh:mm a").format(" HH:mm"), element.selectedRepeat);
  checkInObj.end = moment(checkInObj.start).add(parseInt(element.duration), "minutes").format("ddd MMM DD YYYY HH:mm")
  checkInObj.rangeStart = checkInObj.start;
  checkInObj.duration = moment(element.duration, "mm").format("HH:mm");
  checkInObj.reasonForVisit = element.reasonForVisit;
  checkInObj.allDay = false;
  checkInObj.selectedRepeat = element.selectedRepeat;
  checkInObj.rangeEnd = checkInObj.end;
  checkInObj.patientInfo = {};
  var name = element.patientName.split(" ");
  checkInObj.patientInfo.chartNumber = findChartNo(name[0], name[1]);
  checkInObj.providerInfo = {};
  checkInObj.providerInfo.providerUserID = findProviderInfo(element.providerName).providerUserID;
  checkInObj.status = element.status;
  checkInObj.checkInTime = checkInObj.start;
  checkInObj.appointmentType = element.appointmentType;
  checkInObj.checkInData = {};
  checkInObj.checkInData.patientCondition = {};
  checkInObj.checkInData.patientCondition.employment = element.employment;
  checkInObj.checkInData.patientCondition.autoAccident = element.autoAccident;
  checkInObj.checkInData.patientCondition.state = "";
  checkInObj.checkInData.patientCondition.otherAccident = element.otherAccident;
  checkInObj.checkInData.currentIllnessDate = "";
  checkInObj.checkInData.lastIllnessDate = element.lastIllnessDate;
  checkInObj.checkInData.unableToWork = {};
  checkInObj.checkInData.unableToWork.from = "";
  checkInObj.checkInData.unableToWork.to = "";
  checkInObj.checkInData.otherDate = {};
  checkInObj.checkInData.otherDate.from = "";
  checkInObj.checkInData.otherDate.to = "";
  checkInObj.checkInData.referringProviderId = findProviderInfo(element.referringProvider);
  
  return checkInObj;

};

function createPendingObj(element) {
  // not required to check it it is repeat appointment coz "element.selectedRepeat" is doing it.
  var pendingObj = {};
  pendingObj.appointmentID = generateAptId();
  pendingObj.start = moment(element.startTime, "hh:mm a").format("HH:mm");
  pendingObj.end = moment(element.startTime, "hh:mm a").add(parseInt(element.duration), "minutes").format("HH:mm")
  pendingObj.startTime = moment(getStartDate("Mon, Jan 03 2022 " + moment(element.startTime, "hh:mm a").format("HH:mm"),element.selectedRepeat)).format("ddd, MMM DD, YYYY HH:mm");
  pendingObj.endTime = moment(getStartDate("Mon, Jan 03 2022 " + moment(element.startTime, "hh:mm a").add(parseInt(element.duration), "minutes").format("HH:mm"), element.selectedRepeat)).format("ddd, MMM DD, YYYY HH:mm");
  if(element.duration>=60){
    var h = parseInt(element.duration/60);
    var m = element%60;
    pendingObj.duration = moment(h+':'+m, 'h:mm').format("HH:mm");
  }else{
    pendingObj.duration = moment(element.duration, "mm").format("HH:mm");
  }
  pendingObj.reasonForVisit = element.reasonForVisit;
  pendingObj.allDay = false;
  pendingObj.selectedRepeat = element.selectedRepeat;
  pendingObj.rangeDeviation = {};
  pendingObj._recurring = true;
  pendingObj.dow = element.selectedRepeat ? getDow(element.selectedRepeat) :console.log(element);
  pendingObj.rangeStart = moment(getStartDate("Mon, Jan 03 2022 " + moment(element.startTime, "hh:mm a").format("HH:mm"),element.selectedRepeat)).format("ddd, MMM DD, YYYY HH:mm");
  pendingObj.rangeEnd = moment(getStartDate("Mon, Jan 03 2022 " + moment(element.startTime, "hh:mm a").add(parseInt(element.duration), "minutes").format("HH:mm"), element.selectedRepeat)).format("ddd, MMM DD, YYYY HH:mm");
  pendingObj.status = "Pending";
  pendingObj.appointmentType = element.appointmentType;
  pendingObj["contact-home"] = element["contact-home"];
  pendingObj.cell = element.cell;
  pendingObj.work = element.work;
  pendingObj.treatmentDate = moment("01/02/2022").add(3, "months").format("MM/DD/YYYY");
  pendingObj.treatmentTime = moment(element.startTime, "hh:mm a").format("HH:mm");
  pendingObj.providerInfo = {};
  pendingObj.providerInfo.providerUserID = findProviderInfo(element.providerName).providerUserID;
  pendingObj.patientInfo = {};
  var name = element.patientName.split(" ");
  pendingObj.patientInfo.chartNumber = findChartNo(name[0], name[1]);

  return pendingObj;

};

function createReadyForCheckoutObj(element) {
  var createReadyForCheckoutObj = {};
  createReadyForCheckoutObj.appointmentID = generateAptId();
  // console.log( moment(element.aptDate).format("MM/DD/YYYY"));
  var dateAndTime = element.aptDate != "" ? moment(element.aptDate).format("MM/DD/YYYY") + " " + moment(element.startTime, "hh:mm a").format("HH:mm") : moment(element.startTime, "hh:mm a").format("HH:mm");
  // console.log(dateAndTime);
  createReadyForCheckoutObj.start = moment(dateAndTime).format("ddd, MMM DD, YYYY HH:mm");
  createReadyForCheckoutObj.end = moment(dateAndTime).format("ddd, MMM DD, YYYY") + " " + moment(element.startTime, "HH:mm").add(parseInt(element.duration), "minutes").format("HH:mm");
  createReadyForCheckoutObj.duration = moment(element.duration, "mm").format("HH:mm");
  createReadyForCheckoutObj.reasonForVisit = element.reasonForVisit;
  createReadyForCheckoutObj.allDay = false;
  createReadyForCheckoutObj.selectedRepeat = element.selectedRepeat;
  createReadyForCheckoutObj.rangeEnd = moment(dateAndTime).add(parseInt(element.duration), "minutes").format("ddd, MMM DD, YYYY HH:mm");
  createReadyForCheckoutObj.status = "Ready for checkout";
  createReadyForCheckoutObj.appointmentType = element.appointmentType;
  createReadyForCheckoutObj["contact-home"] = element["contact-home"];
  createReadyForCheckoutObj.cell = element.cell;
  createReadyForCheckoutObj.work = element.work;
  createReadyForCheckoutObj.treatmentDate = moment(dateAndTime).format("MM/DD/YYYY");
  createReadyForCheckoutObj.treatmentTime = moment(dateAndTime).format("HH:mm");
  createReadyForCheckoutObj.providerInfo = {};
  createReadyForCheckoutObj.providerInfo.providerUserID = findProviderInfo(element.providerName).providerUserID;
  createReadyForCheckoutObj.patientInfo = {};
  var name = element.patientName.split(" ");
  createReadyForCheckoutObj.patientInfo.chartNumber = findChartNo(name[0], name[1]);
  createReadyForCheckoutObj.checkInData = {};
  createReadyForCheckoutObj.checkInData.patientCondition = {};
  createReadyForCheckoutObj.checkInData.patientCondition.employment = element.employment;
  createReadyForCheckoutObj.checkInData.patientCondition.autoAccident = element.autoAccident;
  createReadyForCheckoutObj.checkInData.patientCondition.state = "";
  createReadyForCheckoutObj.checkInData.patientCondition.otherAccident = element.otherAccident;
  createReadyForCheckoutObj.checkInData.currentIllnessDate = "";
  createReadyForCheckoutObj.checkInData.lastIllnessDate = element.lastIllnessDate;
  createReadyForCheckoutObj.checkInData.unableToWork = {};
  createReadyForCheckoutObj.checkInData.unableToWork.from = "";
  createReadyForCheckoutObj.checkInData.unableToWork.to = "";
  createReadyForCheckoutObj.checkInData.otherDate = {};
  createReadyForCheckoutObj.checkInData.otherDate.from = "";
  createReadyForCheckoutObj.checkInData.otherDate.to = "";
  createReadyForCheckoutObj.checkInData.referringProviderId = findProviderInfo(element.referringProvider);

  return createReadyForCheckoutObj;
};

function dataWrapper(data) {
  var appointmentData = {
    "info": {
      "status": "200",
      "message": "OK"
    },
    "data": []
  };
  data.forEach(element => {
    var flag = 0;
    var props = Object.keys(element);
    // for loop to eleminate empty entries
    for (j = 1; j < props.length; j++) {
      if (element[props[j]] != "") {
        flag = 1;
        break;
      }

    }

    if (flag) {
      var aptData = {};
      if (element.status.toLowerCase() == "checked in waiting") {
        if(element.selectedRepeat.toLowerCase() === "never"){
          aptData = createCheckedInWaitingObj(element);
          
        }
        else{
          aptData = createCheckedInWaitingObjRepeat(element);
        }
      } else if (element.status.toLowerCase() == "pending") {
        aptData = createPendingObj(element);
      } else if (element.status.toLowerCase() == "checked out") {
        aptData = createReadyForCheckoutObj(element);
      }
      if (!isEmpty(aptData)) {
        appointmentData['data'].push(aptData);
      }
    }

  });
  return appointmentData;
};

// function that can be accessible outside this file 
module.exports = function () {
  csv()
    .fromFile(csvFilePath)
    .then((jsonObj) => {
      var formattedData = dataWrapper(jsonObj);
      fs.writeFile('../JSON/' + fileName + '.json', JSON.stringify(formattedData), 'utf8', function (err) {
        if (err) throw err;
        console.log('Appointments data created!');
      });
    });
};
