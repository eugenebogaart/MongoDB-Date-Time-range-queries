var functions = {
    
    current: function (unit) {
        return { 
            $match: {
                "$expr": {
                    $let: {
                        vars: {
                                "date_begin": { $dateTrunc: { date: "$$NOW", unit: unit, binSize: 1}}
                        },
                        in: {
                            $let: {
                                vars: {
                                "date_end": { $dateAdd: { startDate: "$$date_begin", unit: unit, amount: 1}},
                                },
                                in: {
                                '$and': [ { '$gte': [ '$ts', '$$date_begin' ] },{ '$lt': [ '$ts', '$$date_end' ] }]
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    today: function  () {
        return functions.current("day")
    },
    thisweek: function  () {
        return functions.current("week")
    },
    thismonth: function  () {
        return functions.current("month")
    },
    thisquarter: function  () {
        return functions.current("quarter")
    },  
    thishalfyear: function() {
        thishalfyear = functions.current("quarter")
        thishalfyear["$match"]["$expr"]["$let"]["vars"]["date_begin"]["$dateTrunc"]["binSize"] = 2
        thishalfyear["$match"]["$expr"]["$let"]["in"]["$let"]["vars"]["date_end"]["$dateAdd"]["amount"] = 2
        return thishalfyear
    },
    thisyear: function() {
        return functions.current("year")
    },

    past: function(unit) {
        return { 
            $match: {
                "$expr": {
                    $let: {
                        vars: {
                                "date_end": { $dateTrunc: { date: "$$NOW", unit: unit, binSize: 1}}
                        },
                        in: {
                            $let: {
                                vars: {
                                "date_begin": { $dateSubtract: { startDate: "$$date_end", unit: unit, amount: 1}},
                                },
                                in: {
                                '$and': [ { '$gte': [ '$ts', '$$date_begin' ] },{ '$lt': [ '$ts', '$$date_end' ] }]
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    yesterday: function  () {
        return functions.past("day")
    },
    lastweek: function  () {
        return functions.past("week")
    },
    lastmonth: function  () {
        return functions.past("month")
    },
    lastquarter: function  () {
        return functions.past("quarter")
    }, 
    lasthalfyear: function  () {
        lasthalfyear = functions.past("quarter")
        lasthalfyear["$match"]["$expr"]["$let"]["vars"]["date_end"]["$dateTrunc"]["binSize"] = 2
        lasthalfyear["$match"]["$expr"]["$let"]["in"]["$let"]["vars"]["date_begin"]["$dateSubtract"]["amount"] = 2
        return this.lasthalfyear
    }, 
    lastyear: function  () {
        return functions.past("year")
    },
    trailing: function (unit) {
        return {
           $match: {
              "$expr": {
                 $let: {
                    vars: {
                       "date_begin": { $dateSubtract: { startDate: "$$NOW", unit: unit, amount: 1}},
                    },
                    in: {
                       '$and': [ { '$gte': [ '$ts', '$$date_begin' ] },{ '$lt': [ '$ts', '$$NOW' ] }]
                    }
                 }
              }
           }   
        }
     },
     lastminute: function() {
        return functions.trailing("minute")
     },
     last60minutes: function() {
        return functions.trailing("hour")
     },
     last24hours: function() {
        return functions.trailing("day")
     },
     last7days: function() {
        return functions.trailing("week")
     },
     last30days: function() {
        return functions.trailing("month")
     },
     last90days: function() {
        return functions.trailing("quarter")
     },
     last365days: function() {
        return functions.trailing("year")
     },
}

module.exports = functions
