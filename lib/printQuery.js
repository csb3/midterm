const printQuery = function(queryString, queryParams) {
  let newString = queryString;
  let varCount = 0;
  while (newString.includes('$')) {
    varCount++;
    if (typeof(queryParams[varCount - 1]) === 'number') {
      newString = newString.replace(`$${varCount}`, queryParams[varCount - 1]);
    } else {
      newString = newString.replace(`$${varCount}`, `'${queryParams[varCount - 1]}'`);
    }
    if (varCount > 100) {
      console.log('FAILSAFE: TERMINATED. Counted more than 100 variables, suspect endless loop.');
      break;
    }
  }
  // PRINT THE QUERY
  console.log('------------------------ QUERY START');
  console.log(newString.split('  ').join('')); // REMOVE EXTRA SPACES
  console.log('------------------------ QUERY END');
};

module.exports = printQuery;
