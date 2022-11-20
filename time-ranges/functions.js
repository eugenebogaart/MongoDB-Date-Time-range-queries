var functions = {
    
    today: function () {
        return { 
            $match: {
                "$expr": {
                    $let: {
                        vars: {
                                "date_begin": { $dateTrunc: { date: "$$NOW", unit: "day", binSize: 1}}
                        },
                        in: {
                            $let: {
                                vars: {
                                "date_end": { $dateAdd: { startDate: "$$date_begin", unit: "day", amount: 1}},
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
    thisweek: function  () {
        thisweek = functions.today()
        thisweek["$match"]["$expr"]["$let"]["vars"]["date_begin"]["$dateTrunc"]["unit"] = "week"
        thisweek["$match"]["$expr"]["$let"]["in"]["$let"]["vars"]["date_end"]["$dateAdd"]["unit"] = "week"
        return thisweek 
    },
    thismonth: function  () {
        thismonth = functions.today()
        thismonth["$match"]["$expr"]["$let"]["vars"]["date_begin"]["$dateTrunc"]["unit"] = "month"
        thismonth["$match"]["$expr"]["$let"]["in"]["$let"]["vars"]["date_end"]["$dateAdd"]["unit"] = "month"
        return thismonth
    },
    thisquarter: function () {
        thisquarter = functions.today()
        thisquarter["$match"]["$expr"]["$let"]["vars"]["date_begin"]["$dateTrunc"]["unit"] = "quarter"
        thisquarter["$match"]["$expr"]["$let"]["in"]["$let"]["vars"]["date_end"]["$dateAdd"]["unit"] = "quarter"
        return thisquarter
    },   
    thishalfyear: function() {
        thishalfyear = functions.today()
        thishalfyear["$match"]["$expr"]["$let"]["vars"]["date_begin"]["$dateTrunc"]["unit"] = "quarter"
        thishalfyear["$match"]["$expr"]["$let"]["vars"]["date_begin"]["$dateTrunc"]["binSize"] = 2
        thishalfyear["$match"]["$expr"]["$let"]["in"]["$let"]["vars"]["date_end"]["$dateAdd"]["unit"] = "quarter"
        thishalfyear["$match"]["$expr"]["$let"]["in"]["$let"]["vars"]["date_end"]["$dateAdd"]["amount"] = 2
        return thishalfyear
    },
    thisyear: function() {
        thisyear = functions.today()
        thisyear["$match"]["$expr"]["$let"]["vars"]["date_begin"]["$dateTrunc"]["unit"] = "year"
        thisyear["$match"]["$expr"]["$let"]["in"]["$let"]["vars"]["date_end"]["$dateAdd"]["unit"] = "year"
        return thisyear
    },
    yesterday: function() {
        return { 
            $match: {
                "$expr": {
                    $let: {
                        vars: {
                                "date_end": { $dateTrunc: { date: "$$NOW", unit: "day", binSize: 1}}
                        },
                        in: {
                            $let: {
                                vars: {
                                "date_begin": { $dateSubtract: { startDate: "$$date_end", unit: "day", amount: 1}},
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
    lastweek: function  () {
        lastweek = functions.yesterday()
        lastweek["$match"]["$expr"]["$let"]["vars"]["date_end"]["$dateTrunc"]["unit"] = "week"
        lastweek["$match"]["$expr"]["$let"]["in"]["$let"]["vars"]["date_begin"]["$dateSubtract"]["unit"] = "week"
        return lastweek
    },
    lastmonth: function  () {
        lastmonth = functions.yesterday()
        lastmonth["$match"]["$expr"]["$let"]["vars"]["date_end"]["$dateTrunc"]["unit"] = "month"
        lastmonth["$match"]["$expr"]["$let"]["in"]["$let"]["vars"]["date_begin"]["$dateSubtract"]["unit"] = "month"
        return lastweek
    },
    lastquarter: function  () {
        lastquarter = functions.yesterday()
        lastquarter["$match"]["$expr"]["$let"]["vars"]["date_end"]["$dateTrunc"]["unit"] = "quarter"
        lastquarter["$match"]["$expr"]["$let"]["in"]["$let"]["vars"]["date_begin"]["$dateSubtract"]["unit"] = "quarter"
        return lastquarter
    },
    lasthalfyear: function  () {
        lasthalfyear = functions.yesterday()
        lasthalfyear["$match"]["$expr"]["$let"]["vars"]["date_end"]["$dateTrunc"]["unit"] = "quarter"
        lasthalfyear["$match"]["$expr"]["$let"]["vars"]["date_end"]["$dateTrunc"]["binSize"] = 2
        lasthalfyear["$match"]["$expr"]["$let"]["in"]["$let"]["vars"]["date_begin"]["$dateSubtract"]["unit"] = "quarter"
        lasthalfyear["$match"]["$expr"]["$let"]["in"]["$let"]["vars"]["date_begin"]["$dateSubtract"]["amount"] = 2
        return lasthalfyear
    },
    lastyear: function  () {
        lastyear = functions.yesterday()
        lastyear["$match"]["$expr"]["$let"]["vars"]["date_end"]["$dateTrunc"]["unit"] = "year"
        lastyear["$match"]["$expr"]["$let"]["in"]["$let"]["vars"]["date_begin"]["$dateSubtract"]["unit"] = "year"
        return lastyear
    }
}

module.exports = functions
