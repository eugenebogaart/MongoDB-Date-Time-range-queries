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

console.log('LastMinute=' + JSON.stringify(ranges.lastminute(), undefined, 2))
console.log('Last60Minutes=' + JSON.stringify(ranges.last60minutes(), undefined, 2))
console.log('Last24hours=' + JSON.stringify(ranges.last24hours(), undefined, 2))
console.log('Last7days=' + JSON.stringify(ranges.last7days(), undefined, 2))
console.log('Last20days=' + JSON.stringify(ranges.last30days(), undefined, 2))
console.log('Last90days=' + JSON.stringify(ranges.last90days(), undefined, 2))
console.log('Last365days=' + JSON.stringify(ranges.last365days(), undefined, 2))