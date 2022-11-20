var ranges = require('./time-ranges/functions.js');

console.log('Today=' + JSON.stringify(ranges.today(), undefined, 2))
console.log('ThisWeek=' + JSON.stringify(ranges.thisweek(), undefined, 2))
console.log('ThisMonth=' + JSON.stringify(ranges.thismonth(), undefined, 2))
console.log('ThisQuarter=' + JSON.stringify(ranges.thisquarter(), undefined, 2))
console.log('ThisHalfyear=' + JSON.stringify(ranges.thishalfyear(), undefined, 2))
console.log('ThisYear=' + JSON.stringify(ranges.thisyear(), undefined, 2))

console.log('Yesterday=' + JSON.stringify(ranges.yesterday(), undefined, 2))
console.log('LastWeek=' + JSON.stringify(ranges.lastweek(), undefined, 2))
console.log('LastMonth=' + JSON.stringify(ranges.lastmonth(), undefined, 2))
console.log('LastQuarter=' + JSON.stringify(ranges.lastquarter(), undefined, 2))
console.log('LastHalfyear=' + JSON.stringify(ranges.lasthalfyear(), undefined, 2))
console.log('LastYear=' + JSON.stringify(ranges.lastyear(), undefined, 2))