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

//Standard deduction table
const standardDeductionTable = {
  "standard" : {
    "single" : 12000,
    "MFJ" : 24000,
    "MFS" : 12000,
    "HOH" : 18000    
  },
  "additional" : {
    "single" : 1600,
    "MFJ" : 2600,
    "MFS" : 1300,
    "HOH" : 1600    
  }
}

//Taxable Income table
const taxableIncomeTable = {
  "single" : {
    "step1" : {
      "perc" : 0.1,
      "max" : 9526
    },
    "step2" : {
      "perc" : 0.12,
      "max" : 38701
    },
    "step3" : {
      "perc" : 0.22,
      "max" : 82501
    },
    "step4" : {
      "perc" : 0.24,
      "max" : 157501
    },
    "step5" : {
      "perc" : 0.32,
      "max" : 200001
    },
    "step6" : {
      "perc" : 0.35,
      "max" : 500001
    },
    "step7" : {
      "perc" : 0.37
    }
  },
  "MFJ" : {
    "step1" : {
      "perc" : 0.1,
      "max" : 19050
    },
    "step2" : {
      "perc" : 0.12,
      "max" : 77400
    },
    "step3" : {
      "perc" : 0.22,
      "max" : 165000
    },
    "step4" : {
      "perc" : 0.24,
      "max" : 315000
    },
    "step5" : {
      "perc" : 0.32,
      "max" : 400000
    },
    "step6" : {
      "perc" : 0.35,
      "max" : 600001
    },
    "step7" : {
      "perc" : 0.37
    }
  },
  "MFS" : {
    "step1" : {
      "perc" : 0.1,
      "max" : 9526
    },
    "step2" : {
      "perc" : 0.12,
      "max" : 38701
    },
    "step3" : {
      "perc" : 0.22,
      "max" : 82501
    },
    "step4" : {
      "perc" : 0.24,
      "max" : 157501
    },
    "step5" : {
      "perc" : 0.32,
      "max" : 200001
    },
    "step6" : {
      "perc" : 0.35,
      "max" : 300001
    },
    "step7" : {
      "perc" : 0.37
    }
  },
  "HOH" : {
    "step1" : {
      "perc" : 0.1,
      "max" : 13600
    },
    "step2" : {
      "perc" : 0.12,
      "max" : 51800
    },
    "step3" : {
      "perc" : 0.22,
      "max" : 82501
    },
    "step4" : {
      "perc" : 0.24,
      "max" : 157501
    },
    "step5" : {
      "perc" : 0.32,
      "max" : 200001
    },
    "step6" : {
      "perc" : 0.35,
      "max" : 500001
    },
    "step7" : {
      "perc" : 0.37
    }
  }
}

//Investment Income table
// THIS ONE DOES NOT HAVE STEPS LIKE LAST ONE ??? BUT SINGLE PERC TO APPLY TO WHOLE SUM ?????
const investmentIncomeTable = {
  "single" : {
    "step1" : {
      "perc" : 0,
      "max" : 38601
    },
    "step2" : {
      "perc" : 0.15,
      "max" : 425801
    },
    "step3" : {
      "perc" : 0.20
    }
  },
  "MFJ" : {
    "step1" : {
      "perc" : 0,
      "max" : 77201
    },
    "step2" : {
      "perc" : 0.15,
      "max" : 425801
    },
    "step3" : {
      "perc" : 0.20
    }
  },
  "MFS" : {
    "step1" : {
      "perc" : 0,
      "max" : 38601
    },
    "step2" : {
      "perc" : 0.15,
      "max" : 479001
    },
    "step3" : {
      "perc" : 0.20
    }
  },
  "HOH" : {
    "step1" : {
      "perc" : 0,
      "max" : 51701
    },
    "step2" : {
      "perc" : 0.15,
      "max" : 452401
    },
    "step3" : {
      "perc" : 0.20
    }
  }
}










let userInputs = {};
let allResults = {};

function addsLumpsSums(userSelectedNumberOfLumps, yearAndMonthIDs, valuesIDs, objectPropertyName, yearly = 'true' ) {
  for (var i = 0; i < 5; i++) {
    // console.log(userSelectedNumberOfLumps);
    // console.log(yearAndMonthIDs);
    // console.log(valuesIDs);
    // console.log(objectPropertyName);
    if(userSelectedNumberOfLumps >= (i+1) && userInputs[`${yearAndMonthIDs}${i+1}Year`] == currentYear && userInputs[`${yearAndMonthIDs}${i+1}Month`] == currentMonth) {
      if(yearly){
        allResults[currentYear][currentMonth][objectPropertyName] += userInputs[`${valuesIDs}${i+1}`] / 12;
      }else{
        allResults[currentYear][currentMonth][objectPropertyName] += userInputs[`${valuesIDs}${i+1}`];        
      }
    }
  }
}

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
    }
    //add LUMP SUM(s)
    let userSelectedNumberOfLumps = parseInt( userInputs['income_lump_number'] );
    let yearAndMonthIDs = 'incomeLump';
    let valuesIDs = 'income_lump_sum';
    let objectPropertyName = 'employment';
    addsLumpsSums(userSelectedNumberOfLumps, yearAndMonthIDs, valuesIDs, objectPropertyName );
    // if ( userInputs['income_lump_number'] == '1' || userInputs['income_lump_number'] == '2' || userInputs['income_lump_number'] == '3' || userInputs['income_lump_number'] == '4' || userInputs['income_lump_number'] == '5' ) {
    //   if(userInputs['incomeLump1Year'] == currentYear && userInputs['incomeLump1Month'] == currentMonth) {
    //     allResults[currentYear][currentMonth]['employment'] += userInputs['income_lump_sum1'] / 12;
    //   }
    // }
    // if ( userInputs['income_lump_number'] == '2' || userInputs['income_lump_number'] == '3' || userInputs['income_lump_number'] == '4' || userInputs['income_lump_number'] == '5' ) {
    //   if(userInputs['incomeLump2Year'] == currentYear && userInputs['incomeLump2Month'] == currentMonth) {
    //     allResults[currentYear][currentMonth]['employment'] += userInputs['income_lump_sum2'] / 12;
    //   }
    // }
    // if ( userInputs['income_lump_number'] == '3' || userInputs['income_lump_number'] == '4' || userInputs['income_lump_number'] == '5' ) {
    //   if(userInputs['incomeLump3Year'] == currentYear && userInputs['incomeLump3Month'] == currentMonth) {
    //     allResults[currentYear][currentMonth]['employment'] += userInputs['income_lump_sum3'] / 12;
    //   }
    // }
    // if ( userInputs['income_lump_number'] == '4' || userInputs['income_lump_number'] == '5' ) {
    //   if(userInputs['incomeLump4Year'] == currentYear && userInputs['incomeLump4Month'] == currentMonth) {
    //     allResults[currentYear][currentMonth]['employment'] += userInputs['income_lump_sum4'] / 12;
    //   }
    // }
    // if ( userInputs['income_lump_number'] == '5' ) {
    //   if(userInputs['incomeLump5Year'] == currentYear && userInputs['incomeLump5Month'] == currentMonth) {
    //     allResults[currentYear][currentMonth]['employment'] += userInputs['income_lump_sum5'] / 12;
    //   }
    // }
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
    }
    //add LUMP SUM(s)
    let userSelectedNumberOfLumps = parseInt( userInputs['selfEmployIncome_lump_number'] );
    let yearAndMonthIDs = 'selfIncomeLump';
    let valuesIDs = 'selfEmployIncome_lump_sum';
    let objectPropertyName = 'selfEmployment';
    addsLumpsSums(userSelectedNumberOfLumps, yearAndMonthIDs, valuesIDs, objectPropertyName );
    // if ( userInputs['selfEmployIncome_lump_number'] == '1' || userInputs['selfEmployIncome_lump_number'] == '2' || userInputs['selfEmployIncome_lump_number'] == '3' ) {        
    //   if(userInputs['selfIncomeLump1Year'] == currentYear && userInputs['selfIncomeLump1Month'] == currentMonth) {
    //     allResults[currentYear][currentMonth]['selfEmployment'] += userInputs['selfEmployIncome_lump_sum1'] / 12;
    //   }
    // }
    // if ( userInputs['selfEmployIncome_lump_number'] == '2' || userInputs['selfEmployIncome_lump_number'] == '3' ) {        
    //   if(userInputs['selfIncomeLump2Year'] == currentYear && userInputs['selfIncomeLump2Month'] == currentMonth) {
    //     allResults[currentYear][currentMonth]['selfEmployment'] += userInputs['selfEmployIncome_lump_sum2'] / 12;
    //   }
    // }
    // if ( userInputs['selfEmployIncome_lump_number'] == '3' ) {        
    //   if(userInputs['selfIncomeLump3Year'] == currentYear && userInputs['selfIncomeLump3Month'] == currentMonth) {
    //     allResults[currentYear][currentMonth]['selfEmployment'] += userInputs['selfEmployIncome_lump_sum3'] / 12;
    //   }
    // }
  }
  currentSelfEmployment = allResults[currentYear][currentMonth]['selfEmployment'];
}

//########################################
//##### Spousal Maintenance/Alimony ######
//########################################
let currentSpousalMaintenance;
function calcSpousalMaintenance() {
  if (currentYear == userInputs['startingYear'] && currentMonth == userInputs['startingMonth']) {
    allResults[currentYear][currentMonth]['spousalMaintenance'] = userInputs['alimony'];
  }else{
    allResults[currentYear][currentMonth]['spousalMaintenance'] = currentSpousalMaintenance;
  }
  //add LUMP SUM(s)
  let userSelectedNumberOfLumps = parseInt( userInputs['alimony_timesChange'] );
  let yearAndMonthIDs = 'spousalMaintenanceLump';
  let valuesIDs = 'alimony_changeSum';
  let objectPropertyName = 'spousalMaintenance';
  addsLumpsSums(userSelectedNumberOfLumps, yearAndMonthIDs, valuesIDs, objectPropertyName, false );
  // if ( userInputs['alimony_timesChange'] == '1' || userInputs['alimony_timesChange'] == '2' || userInputs['alimony_timesChange'] == '3' ) {
  //   if (userInputs['spousalMaintenanceLump1Year'] == currentYear && userInputs['spousalMaintenanceLump1Month'] == currentMonth) {
  //     allResults[currentYear][currentMonth]['spousalMaintenance'] += userInputs['alimony_changeSum1'];
  //   }
  // }
  // if ( userInputs['alimony_timesChange'] == '2' || userInputs['alimony_timesChange'] == '3' ) {
  //   if (userInputs['spousalMaintenanceLump2Year'] == currentYear && userInputs['spousalMaintenanceLump2Month'] == currentMonth) {
  //     allResults[currentYear][currentMonth]['spousalMaintenance'] += userInputs['alimony_changeSum2'];
  //   }
  // }
  // if ( userInputs['alimony_timesChange'] == '3' ) {
  //   if (userInputs['spousalMaintenanceLump3Year'] == currentYear && userInputs['spousalMaintenanceLump3Month'] == currentMonth) {
  //     allResults[currentYear][currentMonth]['spousalMaintenance'] += userInputs['alimony_changeSum3'];
  //   }
  // }
  //NO TAXES FOR NOW

  currentSpousalMaintenance = allResults[currentYear][currentMonth]['spousalMaintenance'];
}

//##########################
//##### Child Support ######
//##########################
let currentChildSupport;
function calcChildSupport() {
  if (currentYear == userInputs['startingYear'] && currentMonth == userInputs['startingMonth']) {
    allResults[currentYear][currentMonth]['childSupport'] = userInputs['childSupp_value'];
  }else{
    allResults[currentYear][currentMonth]['childSupport'] = currentChildSupport;
  }

  //Lump Sums
  let userSelectedNumberOfLumps = parseInt( userInputs['childSupp_timesChange'] );
  let yearAndMonthIDs = 'childSupportLump';
  let valuesIDs = 'childSupp_changeSum';
  let objectPropertyName = 'childSupport';
  addsLumpsSums(userSelectedNumberOfLumps, yearAndMonthIDs, valuesIDs, objectPropertyName, false );
  // if ( userInputs['childSupp_timesChange'] == '1' || userInputs['childSupp_timesChange'] == '2' || userInputs['childSupp_timesChange'] == '3' ) {
  //   if (userInputs['childSupportLump1Year'] == currentYear && userInputs['childSupportLump1Month'] == currentMonth) {
  //     allResults[currentYear][currentMonth]['childSupport'] += userInputs['childSupp_changeSum1'];
  //   }
  // }
  // if ( userInputs['childSupp_timesChange'] == '2' || userInputs['childSupp_timesChange'] == '3' ) {
  //   if (userInputs['childSupportLump2Year'] == currentYear && userInputs['childSupportLump2Month'] == currentMonth) {
  //     allResults[currentYear][currentMonth]['childSupport'] += userInputs['childSupp_changeSum2'];
  //   }
  // }
  // if ( userInputs['childSupp_timesChange'] == '3' ) {
  //   if (userInputs['childSupportLump3Year'] == currentYear && userInputs['childSupportLump3Month'] == currentMonth) {
  //     allResults[currentYear][currentMonth]['childSupport'] += userInputs['childSupp_changeSum3'];
  //   }
  // }

  currentChildSupport = allResults[currentYear][currentMonth]['childSupport'];
}

//############################################
//##### Non-retirement financial assets ######
//############################################

let currentNonRetireAssetsValue, currentNonRetireAssetsMonthly;
function calcNonRetireAssets() {
  if (currentYear == userInputs['startingYear'] && currentMonth == userInputs['startingMonth']) {
    //Value of the Asset
    allResults[currentYear][currentMonth]['nonRetireAssetsValue'] = userInputs['nonRetireFinanAssets_sum'];
    // Monthly income
    allResults[currentYear][currentMonth]['nonRetireAssetsMonthly'] = userInputs['netIncome_sum'];
  }else{
    //Value increase/decrease monthly
    allResults[currentYear][currentMonth]['nonRetireAssetsValue'] = currentNonRetireAssetsValue * ( 1 + userInputs['nonRetireFinanAssets_perc'] / 100 / 12 );
    // if Monthly income increase/decrease same as Value of the Asset
    if ( userInputs['nonRetire_netIncome_yesNo'] == 'Yes') {
      allResults[currentYear][currentMonth]['nonRetireAssetsMonthly'] = currentNonRetireAssetsMonthly * ( 1 + userInputs['nonRetireFinanAssets_perc'] / 100 / 12 );
    }else{
      allResults[currentYear][currentMonth]['nonRetireAssetsMonthly'] = currentNonRetireAssetsMonthly * ( 1 + userInputs['nonRetire_netIncome_perc'] / 100 / 12 );
    }      
  }
  currentNonRetireAssetsValue = allResults[currentYear][currentMonth]['nonRetireAssetsValue']
  currentNonRetireAssetsMonthly = allResults[currentYear][currentMonth]['nonRetireAssetsMonthly'];
}

//#################################
//##### NON-FINANCIAL ASSETS ######
//#################################

let currentNonFinanAssetsValue, currentNonFinanAssetsMonthly;
function calcNonFinanAssets() {
  if (currentYear == userInputs['startingYear'] && currentMonth == userInputs['startingMonth']) {
    //Value of the Asset
    allResults[currentYear][currentMonth]['nonFinanAssetsValue'] = userInputs['nonFinanAssets_sum'];
    // Monthly income
    allResults[currentYear][currentMonth]['nonFinanAssetsMonthly'] = userInputs['nonFinanIncome_sum'];
  }else{
    //Value increase/decrease monthly
    allResults[currentYear][currentMonth]['nonFinanAssetsValue'] = currentNonFinanAssetsValue * ( 1 + userInputs['nonFinanAssets_perc'] / 100 / 12 );

    // if Monthly income increase/decrease same as Value of the Asset
    if ( userInputs['nonFinanIncome_netIncome_yesNo'] == 'Yes') {
      allResults[currentYear][currentMonth]['nonFinanAssetsMonthly'] = currentNonFinanAssetsMonthly * ( 1 + userInputs['nonFinanAssets_perc'] / 100 / 12 );
    }else{
      allResults[currentYear][currentMonth]['nonFinanAssetsMonthly'] = currentNonFinanAssetsMonthly * ( 1 + userInputs['nonFinanIncome_netIncome_perc'] / 100 / 12 );
    }
  }

  currentNonFinanAssetsValue = allResults[currentYear][currentMonth]['nonFinanAssetsValue']
  currentNonFinanAssetsMonthly = allResults[currentYear][currentMonth]['nonFinanAssetsMonthly'];
}

//############################
//##### SOCIAL SECURITY ######
//############################

let currentSocialSecurity;
function calcSocialSecurity() {
  //Make a default value of 0 for starting month
  if (currentYear == userInputs['startingYear'] && currentMonth == userInputs['startingMonth']) {
    allResults[currentYear][currentMonth]['socialSecurity'] = 0;
    currentSocialSecurity = allResults[currentYear][currentMonth]['socialSecurity'];
  }
  //At the user input date assign a value from user input
  if (currentYear == userInputs['socialSecStartingYear'] && currentMonth == userInputs['socialSecStartingMonth']) {
    allResults[currentYear][currentMonth]['socialSecurity'] = userInputs['socialSecurity_sum'];
  //Add or don't add percentage
  }else if( userInputs['socialSecurity_increasePerc_yesNo'] == 'Yes'){
    allResults[currentYear][currentMonth]['socialSecurity'] = currentSocialSecurity * (1 + userInputs['socialSecurity_costOfLivingIncrease_perc'] / 12 / 100);
  }else{
    allResults[currentYear][currentMonth]['socialSecurity'] = currentSocialSecurity;
  }
  currentSocialSecurity = allResults[currentYear][currentMonth]['socialSecurity'];
}

//####################
//##### PENSION ######
//####################

let currentPension;
function calcPension() {
  if ( userInputs['pension1_yesNo'] == 'Yes' ) {
    //Make a default value of 0 for starting month
    if (currentYear == userInputs['startingYear'] && currentMonth == userInputs['startingMonth']) {
      allResults[currentYear][currentMonth]['pension'] = 0;
      currentPension = allResults[currentYear][currentMonth]['pension'];
    }
    //At the user input date assign a value from user input
    if (currentYear == userInputs['pensionStartingYear'] && currentMonth == userInputs['pensionStartingMonth']) {
      allResults[currentYear][currentMonth]['pension'] = userInputs['pension1_sum'];
    }else{
      allResults[currentYear][currentMonth]['pension'] = currentPension * (1 + userInputs['pension1_CostOfLivingIncrease'] / 12 / 100);
    }
  }else{
    allResults[currentYear][currentMonth]['pension'] = 0;    
  }
  currentPension = allResults[currentYear][currentMonth]['pension'];
}

//#####################
//##### Expenses ######
//#####################
let currentExpenses;
function calcExpenses() {
  //for first year and first month take the user input
  if (currentYear == userInputs['startingYear'] && currentMonth == userInputs['startingMonth']) {
    allResults[currentYear][currentMonth]['expenses'] = userInputs['expenses_sum'];
  }else{
    allResults[currentYear][currentMonth]['expenses'] = currentExpenses * ( 1 + userInputs['expenses_perc'] / 12 / 100 );
  }

  //add LUMP SUM(s)
  let userSelectedNumberOfLumps = parseInt( userInputs['expenses_timesChange'] );
  let yearAndMonthIDs = 'expensesLump';
  let valuesIDs = 'expenses_changeSum';
  let objectPropertyName = 'expenses';
  addsLumpsSums(userSelectedNumberOfLumps, yearAndMonthIDs, valuesIDs, objectPropertyName, false );
  // if ( userInputs['expenses_timesChange'] == '1' || userInputs['expenses_timesChange'] == '2' || userInputs['expenses_timesChange'] == '3' ) {
  //   if(userInputs['expensesLump1Year'] == currentYear && userInputs['expensesLump1Month'] == currentMonth) {
  //     allResults[currentYear][currentMonth]['expenses'] += userInputs['expenses_changeSum1'];
  //   }
  // }
  // if ( userInputs['expenses_timesChange'] == '2' || userInputs['expenses_timesChange'] == '3' ) {
  //   if(userInputs['expensesLump2Year'] == currentYear && userInputs['expensesLump2Month'] == currentMonth) {
  //     allResults[currentYear][currentMonth]['expenses'] += userInputs['expenses_changeSum2'];
  //   }
  // }
  // if ( userInputs['expenses_timesChange'] == '3' ) {
  //   if(userInputs['expensesLump3Year'] == currentYear && userInputs['expensesLump3Month'] == currentMonth) {
  //     allResults[currentYear][currentMonth]['expenses'] += userInputs['expenses_changeSum3'];
  //   }
  // }

  currentExpenses = allResults[currentYear][currentMonth]['expenses'];
}







function drawResultsTable() {
  let htmlForOutput = `<div id="resultsWrapper">`;

  htmlForOutput += `<div class="resYandM">`;
    htmlForOutput += `<div class="resYears"> Results  </div>`;   
    htmlForOutput += `<div class="resYears"> Months  </div>`;   
    htmlForOutput += `<div class="resYears">`;   
      htmlForOutput += `<div class="resYandM">`;    
        htmlForOutput += `<div class="resBold"> Employmnet  </div> `;    
        htmlForOutput += `<div class="resBold"> Self Employ </div>`;    
        htmlForOutput += `<div class="resBold"> Alimony </div>`;    
        htmlForOutput += `<div class="resBold"> Child Supp </div>`;    
        htmlForOutput += `<div class="resBold"> Fin-Ass Val </div>`;    
        htmlForOutput += `<div class="resBold"> Fin-Ass Monthly </div>`;    
        htmlForOutput += `<div class="resBold"> Non-Fin-Ass Val </div>`;    
        htmlForOutput += `<div class="resBold"> Non-Fin Monthly </div>`;    
        htmlForOutput += `<div class="resBold"> Soc. Security </div>`;    
        htmlForOutput += `<div class="resBold"> Pension </div>`;    
        htmlForOutput += `<div class="resBold"> Expenses </div>`;    
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
            htmlForOutput += `<div class="resMonths"> ${value2.spousalMaintenance.toFixed(2)}  </div>`;
            htmlForOutput += `<div class="resMonths"> ${value2.childSupport.toFixed(2)}  </div>`;
            htmlForOutput += `<div class="resMonths"> ${value2.nonRetireAssetsValue.toFixed(2)}  </div>`;
            htmlForOutput += `<div class="resMonths"> ${value2.nonRetireAssetsMonthly.toFixed(2)}  </div>`;
            htmlForOutput += `<div class="resMonths"> ${value2.nonFinanAssetsValue.toFixed(2)}  </div>`;
            htmlForOutput += `<div class="resMonths"> ${value2.nonFinanAssetsMonthly.toFixed(2)}  </div>`;
            htmlForOutput += `<div class="resMonths"> ${value2.socialSecurity.toFixed(2)}  </div>`;
            htmlForOutput += `<div class="resMonths"> ${value2.pension.toFixed(2)}  </div>`;
            htmlForOutput += `<div class="resMonths"> ${value2.expenses.toFixed(2)}  </div>`;
          htmlForOutput += `</div>`;
        });
        htmlForOutput += `</div>`;
      htmlForOutput += `</div>`;
    })
  htmlForOutput += `</div>`;

  $('#absResults').html(htmlForOutput);
}





//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// I'll need to rework this to be yearly, not monthly!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!



//################################################
//###Total Income (excluding Investment Income)###
//################################################
function calcTotalIncomeExcludingInvestmentIncome() {
  allResults[currentYear][currentMonth]['incomeExcludingInvest'] = allResults[currentYear][currentMonth]['employment'] + allResults[currentYear][currentMonth]['selfEmployment'] + 
                                                                   allResults[currentYear][currentMonth]['spousalMaintenance'];

  if(userInputs.filling_status == "MFJ") {
    if(allResults[currentYear][currentMonth]['nonRetireAssetsMonthly'] > 44000) {
      allResults[currentYear][currentMonth]['incomeExcludingInvest'] += allResults[currentYear][currentMonth]['socialSecurity'] * 0.85;
    }else if(allResults[currentYear][currentMonth]['nonRetireAssetsMonthly'] > 32000) {
      allResults[currentYear][currentMonth]['incomeExcludingInvest'] += allResults[currentYear][currentMonth]['socialSecurity'] * 0.50;
    }
  }else{
    if(allResults[currentYear][currentMonth]['nonRetireAssetsMonthly'] > 34000) {
      allResults[currentYear][currentMonth]['incomeExcludingInvest'] += allResults[currentYear][currentMonth]['socialSecurity'] * 0.85;
    }else if(allResults[currentYear][currentMonth]['nonRetireAssetsMonthly'] > 25000) {
      allResults[currentYear][currentMonth]['incomeExcludingInvest'] += allResults[currentYear][currentMonth]['socialSecurity'] * 0.50;
    }
  }
}

//########################
//###Standard Deduction###
//########################
function calcStandardDeduction() {
  allResults[currentYear][currentMonth]['standardDeduction'] =  standardDeductionTable.standard[userInputs.filling_status] / 12;
}

//########################################################
//###Total Taxable Income (excluding Investment Income)###
//########################################################
function calcTotalTaxableIncomeExcludingInvest() {
  if(allResults[currentYear][currentMonth]['incomeExcludingInvest'] - allResults[currentYear][currentMonth]['standardDeduction'] < 0) {
    allResults[currentYear][currentMonth]['totalTaxIncExclInv'] = 0;
  }else{
    allResults[currentYear][currentMonth]['totalTaxIncExclInv'] = allResults[currentYear][currentMonth]['incomeExcludingInvest'] - allResults[currentYear][currentMonth]['standardDeduction'];
  }
}

//####################################
//###Total Tax (with capital gains)###
//####################################
function calcTotalTax() {
    allResults[currentYear][currentMonth]['totalTax'] = allResults[currentYear][currentMonth]['selfEmployment'] * 0.0765 * 2;


}







let currentYear, currentMonth;
function calculateMain() {
  // add years
  for (var i = 0; i < 3; i++) {
    currentYear = userInputs['startingYear'] + i;
    allResults[currentYear] = {};
    //For each month
    for (var j = 0; j < 12; j++) {
      currentMonth = j;
      //For starting year
      if (i == 0) {
        currentMonth = j + userInputs['startingMonth'];
      }
      allResults[currentYear][currentMonth] = {};
      calcEmployment();
      calcSelfEmploy();
      calcSpousalMaintenance();
      calcChildSupport();
      calcNonRetireAssets();
      calcNonFinanAssets();
      calcSocialSecurity();
      calcPension();

      calcExpenses();

      calcTotalIncomeExcludingInvestmentIncome();
      calcStandardDeduction();
      calcTotalTaxableIncomeExcludingInvest();







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

//Income lump sums
const allLumpSums = {
  "income_lump_date" : "incomeLump",
  "selfEmployIncome_lump_date" : "selfIncomeLump",
  "alimony_changeDate" : "spousalMaintenanceLump",
  "childSupp_changeDate" : "childSupportLump",
  "expenses_changeDate" : "expensesLump",
}
//Adds years-months of each lump sums to userInputs global variable 
function addAllYearsAndMonthsForLumpSums() {
  $.each(allLumpSums, function(index, value){
    for (var i = 0; i < 5; i++) {
      let date = new Date( userInputs[`${index}${i+1}`] );
      userInputs[`${value}${i+1}Year`] = date.getFullYear();
      userInputs[`${value}${i+1}Month`] = date.getMonth();
    }
  })
}

// ### User Inputs ###

let startingDate;
function readAllUserInputs() {
  //read all inputs
  $.each($('input[type="number"]'), function(index, value){
    userInputs[ $(this)[0]['id'] ] = parseFloat( $(this).val() );
  })  
  $.each($('input:not([type="number"]), select'), function(index, value){
    userInputs[ $(this)[0]['id'] ] = $(this).val();
  })   

  //Current Date
  userInputs['startingDate'] = new Date();
  userInputs['startingYear'] = userInputs['startingDate'].getFullYear();
  userInputs['startingMonth'] = userInputs['startingDate'].getMonth();
  userInputs['startingDay'] = userInputs['startingDate'].getDate();

  addAllYearsAndMonthsForLumpSums();


  // const incomeLump1Date = new Date(userInputs['income_lump_date1']);
  // userInputs['incomeLump1Year'] = incomeLump1Date.getFullYear();
  // userInputs['incomeLump1Month'] = incomeLump1Date.getMonth();
  // const incomeLump2Year = new Date(userInputs['income_lump_date2']);
  // userInputs['incomeLump2Year'] = incomeLump2Year.getFullYear();
  // userInputs['incomeLump2Month'] = incomeLump2Year.getMonth();
  // const incomeLump3Year = new Date(userInputs['income_lump_date3']);
  // userInputs['incomeLump3Year'] = incomeLump3Year.getFullYear();
  // userInputs['incomeLump3Month'] = incomeLump3Year.getMonth();

  // //self employ lump sums
  // const selfIncomeLump1Date = new Date(userInputs['selfEmployIncome_lump_date1']);
  // userInputs['selfIncomeLump1Year'] = selfIncomeLump1Date.getFullYear();
  // userInputs['selfIncomeLump1Month'] = selfIncomeLump1Date.getMonth();
  // const selfIncomeLump2Date = new Date(userInputs['selfEmployIncome_lump_date2']);
  // userInputs['selfIncomeLump2Year'] = selfIncomeLump2Date.getFullYear();
  // userInputs['selfIncomeLump2Month'] = selfIncomeLump2Date.getMonth();
  // const selfIncomeLump3Date = new Date(userInputs['selfEmployIncome_lump_date3']);
  // userInputs['selfIncomeLump3Year'] = selfIncomeLump3Date.getFullYear();
  // userInputs['selfIncomeLump3Month'] = selfIncomeLump3Date.getMonth();

  // //Spousal Maintenance/Alimony lump sums
  // const spousalMaintenanceLump1Date = new Date(userInputs['alimony_changeDate1']);
  // userInputs['spousalMaintenanceLump1Year'] = spousalMaintenanceLump1Date.getFullYear();
  // userInputs['spousalMaintenanceLump1Month'] = spousalMaintenanceLump1Date.getMonth();
  // const spousalMaintenanceLump2Date = new Date(userInputs['alimony_changeDate2']);
  // userInputs['spousalMaintenanceLump2Year'] = spousalMaintenanceLump2Date.getFullYear();
  // userInputs['spousalMaintenanceLump2Month'] = spousalMaintenanceLump2Date.getMonth();
  // const spousalMaintenanceLump3Date = new Date(userInputs['alimony_changeDate3']);
  // userInputs['spousalMaintenanceLump3Year'] = spousalMaintenanceLump3Date.getFullYear();
  // userInputs['spousalMaintenanceLump3Month'] = spousalMaintenanceLump3Date.getMonth();

  // //Child Support
  // const childSupportLump1Date = new Date(userInputs['childSupp_changeDate1']);
  // userInputs['childSupportLump1Year'] = childSupportLump1Date.getFullYear();
  // userInputs['childSupportLump1Month'] = childSupportLump1Date.getMonth();
  // const childSupportLump2Date = new Date(userInputs['childSupp_changeDate2']);
  // userInputs['childSupportLump2Year'] = childSupportLump2Date.getFullYear();
  // userInputs['childSupportLump2Month'] = childSupportLump2Date.getMonth();
  // const childSupportLump3Date = new Date(userInputs['childSupp_changeDate3']);
  // userInputs['childSupportLump3Year'] = childSupportLump3Date.getFullYear();
  // userInputs['childSupportLump3Month'] = childSupportLump3Date.getMonth();

  //retirement
  const retire_date = new Date(userInputs['retire_date']);
  userInputs['retirementYear'] = retire_date.getFullYear();
  userInputs['retirementMonth'] = retire_date.getMonth();

  //self Retirement
  const retire_self_date = new Date(userInputs['retire_self_date']);
  userInputs['selfRetirementYear'] = retire_self_date.getFullYear();
  userInputs['selfRetirementMonth'] = retire_self_date.getMonth();

  // //expenses lump sums
  // const expensesLump1Date = new Date(userInputs['expenses_changeDate1']);
  // userInputs['expensesLump1Year'] = expensesLump1Date.getFullYear();
  // userInputs['expensesLump1Month'] = expensesLump1Date.getMonth();
  // const expensesLump2Date = new Date(userInputs['expenses_changeDate2']);
  // userInputs['expensesLump2Year'] = expensesLump2Date.getFullYear();
  // userInputs['expensesLump2Month'] = expensesLump2Date.getMonth();
  // const expensesLump3Date = new Date(userInputs['expenses_changeDate3']);
  // userInputs['expensesLump3Year'] = expensesLump3Date.getFullYear();
  // userInputs['expensesLump3Month'] = expensesLump3Date.getMonth();


  //Social Security Starting Date
  const socialSecStartingDate = new Date(userInputs['socialSecurity_startDate']);
  userInputs['socialSecStartingYear'] = socialSecStartingDate.getFullYear();
  userInputs['socialSecStartingMonth'] = socialSecStartingDate.getMonth();

  //Pension Starting Date
  const pensionStartingDate = new Date(userInputs['pension1_startDate']);
  userInputs['pensionStartingYear'] = pensionStartingDate.getFullYear();
  userInputs['pensionStartingMonth'] = pensionStartingDate.getMonth();




  console.log(userInputs);
}


// ######################
// ### Event Handlers ###
// ######################

//Temp Table Results
$('#showHideTable').on("click", function(){
  $('#absResults').toggle("display");
})

//Show hide Lump Sum wrappers for Employment

// ****************************************!!!!!!!!!!!!!
// ********* Make function for these drop downs*********
// ****************************************!!!!!!!!!!!!!



$('#income_lump_number').on("change", function(){
  switch ( $(this).val() ) {
    case '0':
        $('#income_lump1_wrapper, #income_lump2_wrapper, #income_lump3_wrapper, #income_lump4_wrapper, #income_lump5_wrapper').css("display", "none");
        break;
    case '1':
        $('#income_lump2_wrapper, #income_lump3_wrapper, #income_lump4_wrapper, #income_lump5_wrapper').css("display", "none");
        $('#income_lump1_wrapper').css("display", "block");
        break;
    case '2':
        $('#income_lump3_wrapper, #income_lump4_wrapper, #income_lump5_wrapper').css("display", "none");
        $('#income_lump1_wrapper, #income_lump2_wrapper').css("display", "block");
        break;
    case '3':
        $('#income_lump4_wrapper, #income_lump5_wrapper').css("display", "none");
        $('#income_lump1_wrapper, #income_lump2_wrapper, #income_lump3_wrapper').css("display", "block");
        break;
    case '4':
        $('#income_lump5_wrapper').css("display", "none");
        $('#income_lump1_wrapper, #income_lump2_wrapper, #income_lump3_wrapper#, income_lump4_wrapper').css("display", "block");
        break;
    case '5':
        $('#income_lump1_wrapper, #income_lump2_wrapper, #income_lump3_wrapper, #income_lump4_wrapper, #income_lump5_wrapper').css("display", "block");
        break;        
  }
})
//Show hide Lump Sum wrappers for Self-Employment
$('#selfEmployIncome_lump_number').on("change", function(){
  switch ( $(this).val() ) {
    case '0':
        $('#selfEmploy_lump1_wrapper, #selfEmploy_lump2_wrapper, #selfEmploy_lump3_wrapper').css("display", "none");
        break;
    case '1':
        $('#selfEmploy_lump2_wrapper, #selfEmploy_lump3_wrapper').css("display", "none");
        $('#selfEmploy_lump1_wrapper').css("display", "block");
        break;
    case '2':
        $('#selfEmploy_lump3_wrapper').css("display", "none");
        $('#selfEmploy_lump1_wrapper, #selfEmploy_lump2_wrapper').css("display", "block");
        break;
    case '3':
        $('#selfEmploy_lump1_wrapper, #selfEmploy_lump2_wrapper, #selfEmploy_lump3_wrapper').css("display", "block");
        break;
  }
})
//Show hide Lump Sum wrappers for Alimony
$('#alimony_timesChange').on("change", function(){
  switch ( $(this).val() ) {
    case '0':
        $('#alimony_lump1_wrapper, #alimony_lump2_wrapper, #alimony_lump3_wrapper').css("display", "none");
        break;
    case '1':
        $('#alimony_lump2_wrapper, #alimony_lump3_wrapper').css("display", "none");
        $('#alimony_lump1_wrapper').css("display", "block");
        break;
    case '2':
        $('#alimony_lump3_wrapper').css("display", "none");
        $('#alimony_lump1_wrapper, #alimony_lump2_wrapper').css("display", "block");
        break;
    case '3':
        $('#alimony_lump1_wrapper, #alimony_lump2_wrapper, #alimony_lump3_wrapper').css("display", "block");
        break;
  }
})


$('input, select').on("change", function(){
  readAllUserInputs();
  calculateMain();
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