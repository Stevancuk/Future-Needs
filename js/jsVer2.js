"use strict";

const monthNames = {
  0 : "January",
  1 : "February",
  2 : "March",
  3 : "April",
  4 : "May",
  5 : "Jun",
  6 : "July",
  7 : "August",
  8 : "September",
  9 : "October",
  10 : "November",
  11 : "December",
}

let userInputs = {};
let allResults = {};

//#######################
//##### Employment ######
//#######################
let currentEmployment;
function calcEmployment() {
  //Set it to 0 after retirement
  if( currentYear > userInputs['retirementYear']){
    allResults[currentYear][currentMonth]['employment'] = 0;
  }else if(userInputs['retirementYear'] == currentYear && currentMonth >= userInputs['retirementMonth']){
    allResults[currentYear][currentMonth]['employment'] = 0;
  }else{
    //for first year and first month take the user input
    if (currentYear == userInputs['startingYear'] && currentMonth == userInputs['startingMonth']) {
      allResults[currentYear][currentMonth]['employment'] = userInputs['income'] / 12;
    }else{
      allResults[currentYear][currentMonth]['employment'] = currentEmployment;
      //add expected increase each january
      if(currentMonth == 0) {
        allResults[currentYear][currentMonth]['employment'] *= (100 + userInputs['income_increase']) / 100;
      }
      //add LUMP SUM(s)
      if(userInputs['incomeLump1Year'] == currentYear && userInputs['incomeLump1Month'] == currentMonth) {
        allResults[currentYear][currentMonth]['employment'] += userInputs['income_lump_sum1'] / 12;
      }
    }
  }
  currentEmployment = allResults[currentYear][currentMonth]['employment'];
}

//############################
//##### Self Employment ######
//############################
let currentSelfEmployment;
function calcSelfEmploy() {
  //Set it to 0 after retirement
  if( currentYear > userInputs['selfRetirementYear']){
    allResults[currentYear][currentMonth]['selfEmployment'] = 0;
  }else if(userInputs['selfRetirementYear'] == currentYear && currentMonth >= userInputs['selfRetirementMonth']){
    allResults[currentYear][currentMonth]['selfEmployment'] = 0;
  }else{
    //for first year and first month take the user input
    if (currentYear == userInputs['startingYear'] && currentMonth == userInputs['startingMonth']) {
      allResults[currentYear][currentMonth]['selfEmployment'] = userInputs['selfEmployIncome'] / 12;
    }else{
      allResults[currentYear][currentMonth]['selfEmployment'] = currentSelfEmployment;
      //add expected increase each january
      if(currentMonth == 0) {
        allResults[currentYear][currentMonth]['selfEmployment'] *= (100 + userInputs['selfEmployIncome_increase']) / 100;
      }
      //add LUMP SUM(s)
      if(userInputs['selfIncomeLump1Year'] == currentYear && userInputs['selfIncomeLump1Month'] == currentMonth) {
        allResults[currentYear][currentMonth]['selfEmployment'] += userInputs['selfEmployIncome_lump_sum1'] / 12;
      }
    }
  }
  currentSelfEmployment = allResults[currentYear][currentMonth]['selfEmployment'];
}













function drawResultsTable() {
  let htmlForOutput = `<div id="resultsWrapper">`;

  htmlForOutput += `<div class="resYandM">`;
    htmlForOutput += `<div class="resYears"> Results  </div>`;   
    htmlForOutput += `<div class="resYears">`;   
      htmlForOutput += `<div class="resYandM">`;    
        htmlForOutput += `<div class="resBold"> Employmnet  </div> `;    
        htmlForOutput += `<div class="resBold"> Self Employ </div>`;    
      htmlForOutput += `</div>`;
    htmlForOutput += `</div>`;
  htmlForOutput += `</div>`;

    $.each(allResults, function(index, value) {
      htmlForOutput += `<div class="resYandM">`;
        htmlForOutput += `<div class="resYears"> ${index}  </div>`;   

        htmlForOutput += `<div class="resYandM">`;
        $.each(value, function(index2, value2) {
          htmlForOutput += `<div class="resYandM">`;
            htmlForOutput += `<div class="resMonths"> ${monthNames[index2]}  </div>`;
            htmlForOutput += `<div class="resMonths"> ${value2.employment.toFixed(2)}  </div>`;
            htmlForOutput += `<div class="resMonths"> ${value2.selfEmployment.toFixed(2)}  </div>`;
          htmlForOutput += `</div>`;
        });
        htmlForOutput += `</div>`;
      htmlForOutput += `</div>`;
    })





  htmlForOutput += `</div>`;

  $('#absResults').html(htmlForOutput);
}


let currentYear, currentMonth;
function calculateMain() {
  // add years
  for (var i = 0; i < 3; i++) {
    currentYear = userInputs['startingYear'] + i;
    allResults[currentYear] = {};
    for (var j = 0; j < 12; j++) {
      currentMonth = j;
      if (i == 0) {
        currentMonth = j + userInputs['startingMonth'];
      }
      allResults[currentYear][currentMonth] = {};
      calcEmployment();
      calcSelfEmploy();



      drawResultsTable();



      if(i == 0){
        if(j + currentMonth >= 11) {
          j = 12;
        }
      }
    }
  }
  console.log(allResults);
}

// ### User Inputs ###

let startingDate;
function readAllUserInputs() {
  //read all inputs
  $.each($('input[type="number"]'), function(index, value){
    userInputs[ $(this)[0]['id'] ] = parseFloat( $(this).val() );
  })  
  $.each($('input:not([type="number"])'), function(index, value){
    userInputs[ $(this)[0]['id'] ] = $(this).val();
  })  

  userInputs['startingDate'] = new Date();
  userInputs['startingYear'] = userInputs['startingDate'].getFullYear();
  userInputs['startingMonth'] = userInputs['startingDate'].getMonth();
  userInputs['startingDay'] = userInputs['startingDate'].getDate();

  //Income lump sums
  let incomeLump1Year = new Date(userInputs['income_lump_date1']);
  userInputs['incomeLump1Year'] = incomeLump1Year.getFullYear();
  userInputs['incomeLump1Month'] = incomeLump1Year.getMonth();

  //retirement
  let retire_date = new Date(userInputs['retire_date']);
  userInputs['retirementYear'] = retire_date.getFullYear();
  userInputs['retirementMonth'] = retire_date.getMonth();

  //self Retirement
  let retire_self_date = new Date(userInputs['retire_self_date']);
  userInputs['selfRetirementYear'] = retire_self_date.getFullYear();
  userInputs['selfRetirementMonth'] = retire_self_date.getMonth();

  //self employ lump sums
  let selfIncomeLump1Year = new Date(userInputs['selfEmployIncome_lump_date1']);
  userInputs['selfIncomeLump1Year'] = selfIncomeLump1Year.getFullYear();
  userInputs['selfIncomeLump1Month'] = selfIncomeLump1Year.getMonth();
  console.log(userInputs);
}


// ######################
// ### Click Handlers ###
// ######################

$('input').on("change", function(){
  readAllUserInputs();
  calculateMain();
})

$('#showHideTable').on("click", function(){
  $('#resultsWrapper').toggle("display");
})


$(function(){
  readAllUserInputs();
  calculateMain();

  //var pageTitle = $(document).find("title").text();

  //Temp for 'next next next' through pages
  // if(pageTitle == "Clean Questionnaire") {
  //   $('#next_buttons_subb_2_button').on("click", function(e) {
  //     e.preventDefault();
  //     window.location = "indexVideo.html";
  //   })
  // }




  // Warning Duplicate IDs
  $('[id]').each(function(){
    var ids = $('[id="'+this.id+'"]');
    if(ids.length>1 && ids[0]==this)
      console.warn('Multiple IDs #'+this.id);
  });

  $('[name]').each(function(){
    var names = $('[name="'+this.name+'"]');
    if(names.length>1 && names[0]==this)
      console.warn('Multiple names #'+this.name);
  });

})