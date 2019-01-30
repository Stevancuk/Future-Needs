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

//Takes yearly value of adequate calculated earnings and filling status and returns calculated taxes using Taxable Income table
function useTableTaxableIncome(status, money) {
  let taxCalculated = 0;
  let moneyRemaining = money;
  for (var i = 6; i > 0; i--) {
    if(moneyRemaining > taxableIncomeTable[status][`step${i}`].max) {    
      taxCalculated += ( moneyRemaining - taxableIncomeTable[status][`step${i}`].max ) * taxableIncomeTable[status][`step${i+1}`].perc;
      moneyRemaining = taxableIncomeTable[status][`step${i}`].max;
    }
  }
  taxCalculated += moneyRemaining * taxableIncomeTable[status].step1.perc;

  return taxCalculated;
}

function useTableLTCG(status, money) {
	let taxCalculated = 0;
	let moneyRemaining = money;
	for (var i = 3; i > 0; i--) {
  	if(moneyRemaining > investmentIncomeTable[status][`step${i}`].max) {    
  	  taxCalculated += ( moneyRemaining - investmentIncomeTable[status][`step${i}`].max ) * investmentIncomeTable[status][`step${i+1}`].perc;
  	  moneyRemaining = investmentIncomeTable[status][`step${i}`].max;
  	}
	}
	taxCalculated += moneyRemaining * investmentIncomeTable[status].step1.perc;

	return taxCalculated;  
}

let userInputs = {};
let allResults = {};

function addsLumpsSums(userSelectedNumberOfLumps, yearAndMonthIDs, valuesIDs, objectPropertyName, yearly = 'true' ) {
  for (var i = 0; i < 5; i++) {
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
//##### PRE-TAX ######
//#####################
let currentPreTaxSum;
function calcPreTax() {

  //for first year and first month take the user input for Value of clients Pre-tax
  if (currentYear == userInputs['startingYear'] && currentMonth == userInputs['startingMonth']) {
    allResults[currentYear][currentMonth]['preTaxSum'] = userInputs['preTax_sum'];
  }else{
    if ( (currentYear < userInputs['retirementYear']) || (currentYear == userInputs['retirementYear'] && currentMonth < userInputs['retirementMonth']) ) {
      allResults[currentYear][currentMonth]['preTaxSum'] = currentPreTaxSum * ( 1 + userInputs['preTax_beforeRetirement_perc'] / 100 / 12 );
    }else{
      allResults[currentYear][currentMonth]['preTaxSum'] = currentPreTaxSum * ( 1 + userInputs['preTax_afterRetirement_perc'] / 100 / 12 );
    }
  }

  if ( (currentYear < userInputs['retirementYear']) || (currentYear == userInputs['retirementYear'] && currentMonth < userInputs['retirementMonth']) ) {
    //Monthly contribution to PRE TAX, user+employer
    allResults[currentYear][currentMonth]['preTaxMonthly'] = allResults[currentYear][currentMonth]['employment'] * userInputs['preTax_income_perc'] / 100;
    //Add emplyer contribution
    allResults[currentYear][currentMonth]['preTaxMonthly'] *= 1 + (userInputs['preTax_employMatch_perc'] / 100);
    //Add self employment
    allResults[currentYear][currentMonth]['preTaxMonthly'] += allResults[currentYear][currentMonth]['selfEmployment'] * userInputs['preTax_income_perc'] / 100;
    //Add monthly value to sum value
    allResults[currentYear][currentMonth]['preTaxSum'] += allResults[currentYear][currentMonth]['preTaxMonthly'];
  }else{
    allResults[currentYear][currentMonth]['preTaxMonthly'] = 0;
  }
  currentPreTaxSum = allResults[currentYear][currentMonth]['preTaxSum'];

  //Decrease income for the monthly value of pre-tax
  allResults[currentYear][currentMonth]['employment'] = allResults[currentYear][currentMonth]['employment'] * ( 1 - userInputs['preTax_income_perc'] / 100 );
  //Decrease self employment income for the monthly value of pre-tax
  allResults[currentYear][currentMonth]['selfEmployment'] = allResults[currentYear][currentMonth]['selfEmployment'] * ( 1 - userInputs['preTax_income_perc'] / 100 );
}

//#####################
//##### POST-TAX ######
//#####################
let currentPostTaxSum;
function calcPostTax() {

  //for first year and first month take the user input for Value of clients Post-tax
  if (currentYear == userInputs['startingYear'] && currentMonth == userInputs['startingMonth']) {
    allResults[currentYear][currentMonth]['postTaxSum'] = userInputs['postTax_sum'];
  }else{
    if ( (currentYear < userInputs['retirementYear']) || (currentYear == userInputs['retirementYear'] && currentMonth < userInputs['retirementMonth']) ) {
      allResults[currentYear][currentMonth]['postTaxSum'] = currentPostTaxSum * ( 1 + userInputs['postTax_beforeRetirement_perc'] / 100 / 12 );
    }else{
      allResults[currentYear][currentMonth]['postTaxSum'] = currentPostTaxSum * ( 1 + userInputs['postTax_afterRetirement_perc'] / 100 / 12 );
    }
  }

  if ( (currentYear < userInputs['retirementYear']) || (currentYear == userInputs['retirementYear'] && currentMonth < userInputs['retirementMonth']) ) {
    //Monthly contribution to POST TAX, user+employer
    allResults[currentYear][currentMonth]['postTaxMonthly'] = allResults[currentYear][currentMonth]['employment'] * userInputs['postTax_income_perc'] / 100;
    //Add emplyer contribution
    allResults[currentYear][currentMonth]['postTaxMonthly'] *= 1 + (userInputs['postTax_employMatch_perc'] / 100);
    //Add self employment
    allResults[currentYear][currentMonth]['postTaxMonthly'] += allResults[currentYear][currentMonth]['selfEmployment'] * userInputs['postTax_income_perc'] / 100;
    //Add monthly value to sum value
    allResults[currentYear][currentMonth]['postTaxSum'] += allResults[currentYear][currentMonth]['postTaxMonthly'];
  }else{
    allResults[currentYear][currentMonth]['postTaxMonthly'] = 0;
  }
  currentPostTaxSum = allResults[currentYear][currentMonth]['postTaxSum'];
}


//#####################
//##### Expenses ######
//#####################
let currentExpensesWithoutPostTax;
function calcExpenses() {
  //for first year and first month take the user input
  if (currentYear == userInputs['startingYear'] && currentMonth == userInputs['startingMonth']) {
    allResults[currentYear][currentMonth]['expensesWithoutPostTax'] = userInputs['expenses_sum'];
  }else{
    allResults[currentYear][currentMonth]['expensesWithoutPostTax'] = currentExpensesWithoutPostTax * ( 1 + userInputs['expenses_perc'] / 12 / 100 );
  }

  //add LUMP SUM(s)
  let userSelectedNumberOfLumps = parseInt( userInputs['expenses_timesChange'] );
  let yearAndMonthIDs = 'expensesLump';
  let valuesIDs = 'expenses_changeSum';
  let objectPropertyName = 'expensesWithoutPostTax';
  addsLumpsSums(userSelectedNumberOfLumps, yearAndMonthIDs, valuesIDs, objectPropertyName, false );

  currentExpensesWithoutPostTax = allResults[currentYear][currentMonth]['expensesWithoutPostTax'];
  //ADD POST-TAX 
  allResults[currentYear][currentMonth]['expenses'] = currentExpensesWithoutPostTax + allResults[currentYear][currentMonth]['postTaxMonthly'];

}

//#################
//###Yearly sums###
//#################

function calcYearlySums() {
  
  allResults[currentYear][currentMonth]['thisYearEmployment'] = 0;
  allResults[currentYear][currentMonth]['thisYearInceomeFromSelfEmployment'] = 0;
  allResults[currentYear][currentMonth]['thisYearAlimony'] = 0;
  allResults[currentYear][currentMonth]['thisYearChildSupport'] = 0;
  allResults[currentYear][currentMonth]['thisYearInceomeFromInvestment'] = 0;
  allResults[currentYear][currentMonth]['thisYearNonFinancial'] = 0;
  allResults[currentYear][currentMonth]['thisYearSocialSecurity'] = 0;
  allResults[currentYear][currentMonth]['thisYearInceomeFromEmployPlusSelfEmplPlusSpousMaintain'] = 0;
  allResults[currentYear][currentMonth]['thisYearPension'] = 0;
  allResults[currentYear][currentMonth]['thisYearExpenses'] = 0;

  $.each(allResults[currentYear], function(index, value) {
    allResults[currentYear][currentMonth]['thisYearEmployment'] += value.employment;
    allResults[currentYear][currentMonth]['thisYearInceomeFromSelfEmployment'] += value.selfEmployment;
    allResults[currentYear][currentMonth]['thisYearAlimony'] += value.spousalMaintenance;
    allResults[currentYear][currentMonth]['thisYearChildSupport'] += value.childSupport;
    allResults[currentYear][currentMonth]['thisYearInceomeFromInvestment'] += value.nonRetireAssetsMonthly;
    allResults[currentYear][currentMonth]['thisYearNonFinancial'] += value.nonFinanAssetsMonthly;
    allResults[currentYear][currentMonth]['thisYearSocialSecurity'] += value.socialSecurity;
    allResults[currentYear][currentMonth]['thisYearInceomeFromEmployPlusSelfEmplPlusSpousMaintain'] += value.employment + value.selfEmployment + value.spousalMaintenance;
    // if ( (currentYear > userInputs['pensionStartingYear']) || (currentYear == userInputs['pensionStartingYear'] && index >= userInputs['pensionStartingMonth']) ) {
      allResults[currentYear][currentMonth]['thisYearPension'] += value.pension;
    // }
    allResults[currentYear][currentMonth]['thisYearExpenses'] += value.expenses;

  })
}

//################################################
//###Total Income (excluding Investment Income)###
//################################################
function calcTotalIncomeExcludingInvestmentIncome() {

  allResults[currentYear][currentMonth]['thisYearIncomeExcludingInvest'] = allResults[currentYear][currentMonth]['thisYearInceomeFromEmployPlusSelfEmplPlusSpousMaintain'];

  if(userInputs.filling_status == "MFJ") {
    if(allResults[currentYear][currentMonth]['thisYearInceomeFromInvestment'] > 44000) {
      allResults[currentYear][currentMonth]['thisYearIncomeExcludingInvest'] += allResults[currentYear][currentMonth]['thisYearSocialSecurity'] * 0.85;
    }else if(allResults[currentYear][currentMonth]['thisYearInceomeFromInvestment'] > 32000) {
      allResults[currentYear][currentMonth]['thisYearIncomeExcludingInvest'] += allResults[currentYear][currentMonth]['thisYearSocialSecurity'] * 0.50;
    }
  }else{
    if(allResults[currentYear][currentMonth]['thisYearInceomeFromInvestment'] > 34000) {
      allResults[currentYear][currentMonth]['thisYearIncomeExcludingInvest'] += allResults[currentYear][currentMonth]['thisYearSocialSecurity'] * 0.85;
    }else if(allResults[currentYear][currentMonth]['thisYearInceomeFromInvestment'] > 25000) {
      allResults[currentYear][currentMonth]['thisYearIncomeExcludingInvest'] += allResults[currentYear][currentMonth]['thisYearSocialSecurity'] * 0.50;
    }
  }
}

//########################
//###Standard Deduction###
//########################
function calcStandardDeduction() {
  allResults[currentYear][currentMonth]['standardDeduction'] =  standardDeductionTable.standard[userInputs.filling_status];
}

//########################################################
//###Total Taxable Income (excluding Investment Income)###
//########################################################
function calcTotalTaxableIncomeExcludingInvest() {
  if(allResults[currentYear][currentMonth]['thisYearIncomeExcludingInvest'] - allResults[currentYear][currentMonth]['standardDeduction'] < 0) {
    allResults[currentYear][currentMonth]['totalTaxIncExclInv'] = 0;
  }else{
    allResults[currentYear][currentMonth]['totalTaxIncExclInv'] = allResults[currentYear][currentMonth]['thisYearIncomeExcludingInvest'] - allResults[currentYear][currentMonth]['standardDeduction'];
  }
}

//####################################
//###Total Tax (with capital gains)###
//####################################
function calcTotalTax() {

    //Tax table
    allResults[currentYear][currentMonth]['taxTablePart'] = useTableTaxableIncome(userInputs.filling_status, allResults[currentYear][currentMonth]['totalTaxIncExclInv']);
    allResults[currentYear][currentMonth]['LTCGTablePart'] = useTableLTCG(userInputs.filling_status, allResults[currentYear][currentMonth]['thisYearInceomeFromInvestment']);

    allResults[currentYear][currentMonth]['totalTax'] = allResults[currentYear][currentMonth]['thisYearInceomeFromSelfEmployment'] * 0.0765 * 2 + 
                                allResults[currentYear][currentMonth]['taxTablePart'] + allResults[currentYear][currentMonth]['LTCGTablePart'];

}

//####################################
//##########Surplus/Shortfall#########
//####################################   

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// If There is shortfall
// and that shortfall is covered from pre-tax/post-tax/non-retirement financial assets
// there'll be a new loop that will decrease the gross value in the following months of current year
// that ammont will be increased by the same perc that was used in monthly calculation of those 3 values


function calcSurplusShortfall() {

  let monthlyTax = allResults[currentYear][currentMonth]['totalTax'];
  let currentSurpluses = 0; //These fonds are 'temp' during one year
  let currentShortfall = 0; //This variable is here only for calculations in one month
  let postTaxFondsUsedThisMonth, preTaxFondsUsedThisMonth, nonRetireFondsUsedThisMonth;

  $.each(allResults[currentYear], function(index2, value2) {
    value2['thisMonthTax'] = monthlyTax / 12;

    value2['thisMonthPlusSide'] = value2['employment'] + value2['selfEmployment'] + value2['spousalMaintenance'] +
                       value2['childSupport'] + value2['nonFinanAssetsMonthly'] + value2['nonRetireAssetsMonthly'] +
                       value2['socialSecurity'] + value2['pension'];
    value2['thisMonthMinusSide'] = value2['thisMonthTax'] + value2['expenses'];
    value2['surplusShortfall'] = value2['thisMonthPlusSide'] - value2['thisMonthMinusSide'];

    //If there is a Surplus add it to Non-retirement financial assets
    //It's stored on a special place during the year...
    if( value2['surplusShortfall'] >= 0) {
      currentSurpluses += value2['surplusShortfall'];
      currentShortfall = 0;
    }else{
      //if there is a shortfall
      currentShortfall = -1 * value2['surplusShortfall'];
      console.log(currentShortfall);
      //check first if there are funds from earlier months surpluses in this year
      if(currentSurpluses > 0) {
        //if there are enough fonds here, cover all lose from these fonds
        if ( currentSurpluses >= currentShortfall ) {
          currentSurpluses -= currentShortfall;
          currentShortfall = 0;
        }else{
          //when there are not enough fonds in this years 'savings', first empty those fonds
          currentShortfall = currentShortfall - currentSurpluses;
          currentSurpluses = 0;
        }
      }
      //Then go to post-tax, pre-tax first after retirement
      //or go to non-retirement financial assets before retirement
      console.log(value2['postTaxSum']);
      if ( (currentYear > userInputs['retirementYear']) || (userInputs['retirementYear'] == currentYear && index2 >= userInputs['retirementMonth']) ) {
        //if there are fonds in post-tax
        if(value2['postTaxSum'] > 0) {
          //check if there are enough fonds in post-tax to cover shortfall in whole
          if(value2['postTaxSum'] >= currentShortfall) {
            value2['postTaxSum'] -= currentShortfall;
            //TRACK NOW MUCH FONDS ARE USED TO FIX VALUES IN FOLOWING MONTHS OF THIS YEAR!!!!!
            postTaxFondsUsedThisMonth = currentShortfall;
            currentShortfall = 0;
          }else{
            // when post tax can only partially cover shortfall
            postTaxFondsUsedThisMonth = value2['postTaxSum'];
            currentShortfall -= postTaxFondsUsedThisMonth;
            value2['postTaxSum'] = 0;
          }
          //lower post tax gross value for folowing months of this year
          let tempTrackPostTaxUsed = postTaxFondsUsedThisMonth;
          for (var i = parseInt(index2) + 1; i < 12; i++) {
            console.log(allResults[currentYear][i]['postTaxSum']);
            //check if it's before or after retirement
            if ( (currentYear < userInputs['retirementYear']) || (currentYear == userInputs['retirementYear'] && i < userInputs['retirementMonth']) ) {
              tempTrackPostTaxUsed *= ( 1 + (i - index2) * userInputs['postTax_beforeRetirement_perc'] / 100 / 12 )
            }else{
              tempTrackPostTaxUsed *= ( 1 + (i - index2) * userInputs['postTax_afterRetirement_perc'] / 100 / 12 );
            }
            allResults[currentYear][i]['postTaxSum'] -= tempTrackPostTaxUsed;
            console.log(allResults[currentYear][i]['postTaxSum']);
          }
        }


        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // THIS WAS NOT GOOD!!!!!!!!!!!!!!!!!!!!!!!!
        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!





        // //lower post tax gross value for folowing months of this year
        //   for (var i = parseInt(index2) + 1; i < 12; i++) {
        //     allResults[currentYear][i]['postTaxSum'] -= postTaxFondsUsedThisMonth * ( 1 + (i - index2) * userInputs['postTax_afterRetirement_perc'] / 100 / 12 );
        //   }


















        //Try to take rest fonds out of pre-tax
        if(value2['preTaxSum'] > 0) {
          //check if there are enough fonds in pre-tax to cover shortfall in whole
          if(value2['preTaxSum'] >= currentShortfall) {
            value2['preTaxSum'] -= currentShortfall;
            //TRACK NOW MUCH FONDS ARE USED TO FIX VALUES IN FOLOWING MONTHS OF THIS YEAR!!!!!
            preTaxFondsUsedThisMonth = currentShortfall;
            currentShortfall = 0;
          }else{
            // when pre tax can only partially cover shortfall
            preTaxFondsUsedThisMonth = value2['preTaxSum'];
            currentShortfall -= preTaxFondsUsedThisMonth;
            value2['preTaxSum'] = 0;
          }
          //lower pre tax gross value for folowing months of this year
          for (var i = parseInt(index2) + 1; i < 12; i++) {
            //check if it's before or after retirement
            if ( (currentYear < userInputs['retirementYear']) || (currentYear == userInputs['retirementYear'] && currentMonth < userInputs['retirementMonth']) ) {
              allResults[currentYear][i]['preTaxSum'] -= preTaxFondsUsedThisMonth * ( 1 + (i - index2) * userInputs['preTax_beforeRetirement_perc'] / 100 / 12 );
            }else{
              allResults[currentYear][i]['preTaxSum'] -= preTaxFondsUsedThisMonth * ( 1 + (i - index2) * userInputs['preTax_afterRetirement_perc'] / 100 / 12 );
            }
          }
        }
      }

      //Take the rest out of non-retirement finan. assets
      value2['nonRetireAssetsValue'] -= currentShortfall;
      nonRetireFondsUsedThisMonth = currentShortfall;
      currentShortfall = 0;

      //lower non Retire gross value for folowing months of this year
      for (var i = parseInt(index2) + 1; i < 12; i++) {
        allResults[currentYear][i]['nonRetireAssetsValue'] -= nonRetireFondsUsedThisMonth * ( 1 + (i - index2) * userInputs['nonRetireFinanAssets_perc'] / 100 / 12 );
      }


      // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      // THIS DOESN'T WORK AS IT SHOULD
      // IT'S REDUCING THE VALUE OF FOLLOWING MONTHS MORE THEN IT SHOULD
      // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!



      //I GUESS WE CAN STOP HERE AND LET THESE FONDS GO TO NEGATIVE IF NEEDED (THAT WOULD REPRESENT SOME KIND OF LOANS...)
      //NEGATIVE VALUE WILL EVEN BE INCREASED BY THE SAME PERC USER ENTERED.
    }
    value2['thisYearTempSurpluses'] = currentSurpluses;

  })
  //at the end of the last month add currentSurpluses to Non-retirement financial assets
  // currentNonRetireAssetsValue += currentSurpluses;    NOT GOOD
  currentNonRetireAssetsValue = allResults[currentYear][currentMonth]['nonRetireAssetsValue'] + currentSurpluses;  //this looks better
  console.log(allResults);
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
        htmlForOutput += `<div class="resBold"> Fin-Ass Monthly </div>`;    
        htmlForOutput += `<div class="resBold"> Soc. Security </div>`; 
        htmlForOutput += `<div class="resBold"> Pension </div>`;    
        htmlForOutput += `<div class="resBold"> Non-Fin-Ass Val </div>`;    
        htmlForOutput += `<div class="resBold"> Non-Fin Monthly </div>`;    
        htmlForOutput += `<div class="resBold"> Fin-Ass Val </div>`;    
        htmlForOutput += `<div class="resBold"> Post-tax Monthly </div>`;    
        htmlForOutput += `<div class="resBold"> Post-tax Sum </div>`;    
        htmlForOutput += `<div class="resBold"> Pre-tax Monthly </div>`;    
        htmlForOutput += `<div class="resBold"> Pre-tax Sum</div>`;    
        htmlForOutput += `<div class="resBold"> Expenses </div>`;    
        htmlForOutput += `<div class="resBold allIncomesGreen"> ALL INCOME </div>`;    
        htmlForOutput += `<div class="resBold allExpensesRed"> TAX + Expenses </div>`;    
        htmlForOutput += `<div class="resBold allIncomesGreen"> Surplus/Shortfall </div>`;    
        htmlForOutput += `<div class="resBold allIncomesGreen"> TempSurplus </div>`;    
        htmlForOutput += `<div class="resBold allIncomesGreen"> year Income </div>`;    
        htmlForOutput += `<div class="resBold allIncomesGreen"> Self Employ </div>`;    
        htmlForOutput += `<div class="resBold allIncomesGreen"> Alimony </div>`; 
        htmlForOutput += `<div class="resBold allIncomesGreen"> Child Supp </div>`; 
        htmlForOutput += `<div class="resBold allIncomesGreen"> Fin-Ass Monthly </div>`; 
        htmlForOutput += `<div class="resBold allIncomesGreen"> Soc. Security </div>`; 
        htmlForOutput += `<div class="resBold allIncomesGreen"> Pension </div>`; 
        htmlForOutput += `<div class="resBold gryBck"> Non-Fin-Ass Val </div>`; 
        htmlForOutput += `<div class="resBold gryBck"> Pre tax </div>`; 
        htmlForOutput += `<div class="resBold gryBck"> Post tax </div>`; 

        htmlForOutput += `<div class="resBold gryBck"> TotIncExclInvInc </div>`;    
        htmlForOutput += `<div class="resBold gryBck"> Standard deduc </div>`;    
        htmlForOutput += `<div class="resBold gryBck"> TotTaxIncExcInv </div>`;    
        htmlForOutput += `<div class="resBold allExpensesRed"> Total Tax </div>`;    
        htmlForOutput += `<div class="resBold allExpensesRed"> Expenses </div>`;    
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
            htmlForOutput += `<div class="resMonths"> ${value2.nonRetireAssetsMonthly.toFixed(2)}  </div>`;
            htmlForOutput += `<div class="resMonths"> ${value2.socialSecurity.toFixed(2)}  </div>`; 
            htmlForOutput += `<div class="resMonths"> ${value2.pension.toFixed(2)}  </div>`;
            htmlForOutput += `<div class="resMonths"> ${value2.nonFinanAssetsValue.toFixed(2)}  </div>`;
            htmlForOutput += `<div class="resMonths"> ${value2.nonFinanAssetsMonthly.toFixed(2)}  </div>`;
            htmlForOutput += `<div class="resMonths"> ${value2.nonRetireAssetsValue.toFixed(2)}  </div>`;
            htmlForOutput += `<div class="resMonths"> ${value2.postTaxMonthly.toFixed(2)}  </div>`;
            htmlForOutput += `<div class="resMonths"> ${value2.postTaxSum.toFixed(2)}  </div>`;
            htmlForOutput += `<div class="resMonths"> ${value2.preTaxMonthly.toFixed(2)}  </div>`;
            htmlForOutput += `<div class="resMonths"> ${value2.preTaxSum.toFixed(2)}  </div>`;
            htmlForOutput += `<div class="resMonths"> ${value2.expenses.toFixed(2)}  </div>`;
            htmlForOutput += `<div class="resMonths"> ${value2.thisMonthPlusSide.toFixed(2)}  </div>`;
            htmlForOutput += `<div class="resMonths"> ${value2.thisMonthMinusSide.toFixed(2)}  </div>`;
            htmlForOutput += `<div class="resMonths"> ${value2.surplusShortfall.toFixed(2)}  </div>`;
            htmlForOutput += `<div class="resMonths"> ${value2.thisYearTempSurpluses.toFixed(2)}  </div>`;
            if(index2 == 11) {
              htmlForOutput += `<div class="resMonths allIncomesGreen resultWide"> ${value2.thisYearEmployment.toFixed(2)}  </div>`;
              htmlForOutput += `<div class="resMonths allIncomesGreen resultWide"> ${value2.thisYearInceomeFromSelfEmployment.toFixed(2)}  </div>`;
              htmlForOutput += `<div class="resMonths allIncomesGreen resultWide"> ${value2.thisYearAlimony.toFixed(2)}  </div>`;
              htmlForOutput += `<div class="resMonths allIncomesGreen resultWide"> ${value2.thisYearChildSupport.toFixed(2)}  </div>`;
              htmlForOutput += `<div class="resMonths allIncomesGreen resultWide"> ${value2.thisYearInceomeFromInvestment.toFixed(2)}  </div>`;
              htmlForOutput += `<div class="resMonths allIncomesGreen resultWide"> ${value2.thisYearSocialSecurity.toFixed(2)}  </div>`;
              htmlForOutput += `<div class="resMonths allIncomesGreen resultWide"> ${value2.thisYearPension.toFixed(2)}  </div>`;
              htmlForOutput += `<div class="resMonths gryBck resultWide"> ${value2.thisYearNonFinancial.toFixed(2)}  </div>`;
              htmlForOutput += `<div class="resMonths gryBck resultWide"> Pre tax </div>`;
              htmlForOutput += `<div class="resMonths gryBck resultWide"> Post tax </div>`;

              htmlForOutput += `<div class="resMonths gryBck resultWide"> ${value2.thisYearIncomeExcludingInvest.toFixed(2)}  </div>`;
              htmlForOutput += `<div class="resMonths gryBck resultWide"> ${value2.standardDeduction.toFixed(2)}  </div>`;
              htmlForOutput += `<div class="resMonths gryBck resultWide"> ${value2.totalTaxIncExclInv.toFixed(2)}  </div>`;
              htmlForOutput += `<div class="resMonths allExpensesRed resultWide"> ${value2.totalTax.toFixed(2)}  </div>`;              
              htmlForOutput += `<div class="resMonths allExpensesRed resultWide"> ${value2.thisYearExpenses.toFixed(2)}  </div>`;
            }else{
              htmlForOutput += `<div class="resMonths gryBck"> / </div>`;
              htmlForOutput += `<div class="resMonths gryBck"> / </div>`;
              htmlForOutput += `<div class="resMonths gryBck"> / </div>`;
              htmlForOutput += `<div class="resMonths gryBck"> / </div>`;
              htmlForOutput += `<div class="resMonths gryBck"> / </div>`;
              htmlForOutput += `<div class="resMonths gryBck"> / </div>`;
              htmlForOutput += `<div class="resMonths gryBck"> / </div>`;
              htmlForOutput += `<div class="resMonths gryBck"> / </div>`;
              htmlForOutput += `<div class="resMonths gryBck"> / </div>`;
              htmlForOutput += `<div class="resMonths gryBck"> / </div>`;
              htmlForOutput += `<div class="resMonths gryBck"> / </div>`;
              htmlForOutput += `<div class="resMonths gryBck"> / </div>`;
              htmlForOutput += `<div class="resMonths gryBck"> / </div>`;
              htmlForOutput += `<div class="resMonths gryBck"> / </div>`;
              htmlForOutput += `<div class="resMonths gryBck"> / </div>`;
            }           
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
  for (var i = 0; i < 2; i++) {
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
      //Post-tax is calculated first because idea is to have the same ammmount in pre-tax and post-tax contributions if user inputs same perc for contributions
      //That is: DON'T lower the income for pre-tax contributions and calc post-tax contribuutions out of the rest
      calcPostTax();
      //Pre-tax contributions lower the income and self-employment income
      calcPreTax();
      calcSpousalMaintenance();
      calcChildSupport();
      calcNonFinanAssets();
      calcSocialSecurity();
      calcPension();
      calcNonRetireAssets();
      calcExpenses();

      //Calculate every December 
      if(currentMonth == 11) {
        calcYearlySums();
        calcTotalIncomeExcludingInvestmentIncome();
        calcStandardDeduction();
        calcTotalTaxableIncomeExcludingInvest();
        calcTotalTax();

        calcSurplusShortfall();
      }

      if(i == 0){
        if(j + userInputs['startingMonth'] >= 11) {
          j = 12;
        }
      }
    }
  }
      drawResultsTable();
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
 
  //retirement
  const retire_date = new Date(userInputs['retire_date']);
  userInputs['retirementYear'] = retire_date.getFullYear();
  userInputs['retirementMonth'] = retire_date.getMonth();

  //self Retirement
  const retire_self_date = new Date(userInputs['retire_self_date']);
  userInputs['selfRetirementYear'] = retire_self_date.getFullYear();
  userInputs['selfRetirementMonth'] = retire_self_date.getMonth();

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