const calcAge = (age) => {
    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - age;
    return birthYear;
  };
  
  module.exports = calcAge;
  