
# Common used MongoDB date/time range queries

## Summary
Date/Time ranges relative to the current time are common queries if you need to report data in a monitoring tool or dashboard.

Common data/time range queries could be divided into 3 groups

### Current

| Current        | Description (sample relative to 2022-11-21T09:34:07.000Z ($$NOW)|
|----------------|---------------------------------------------------------|
| Today          | From Today's time 2022-11-21T00:00:00.000Z to +24 hours |
| This Week      | From Monday at time 2022-11-21T00:00:00.000Z to +7 days |
| This Month     | From the first day of this month at:time 2022-11-21T00:00:00.000Z to end of month |
| This Quarter   | From the first day of current quarter at: 2022-10-01T00:00:00.000Z to end of quarter |
| This Half Year | From the first day of this half year at: 2022-07-01T00:00:00.000Z to end of half year |
| This Year      | From the first day of this year at: 2022-01-01T00:00:00.000Z to end of year |
|                

### Past
|  Past          | Description (sample relative to 2022-11-21T09:34:07.000Z  ($$NOW) |
|----------------|-----------------------------------|
| Yesterday      | From Yesterday 's time 2022-11-20T00:00:00.000Z to +24 hours        |
| Last Week      | From last week Monday at time 2022-11-14T00:00:00.000Z to +7 days  |
| Last Month     | From the first day of last month at:time 2022-10-21T00:00:00.000Z to end of last month |
| Last Quarter   | From the first day of last quarter at: 2022-07-01T00:00:00.000Z to end of that quarter |
| Last Half Year | From the first day of last half year at: 2022-01-01T00:00:00.000Z to end of that half year |
| Last Year      | From the first day of last year at: 2021-01-01T00:00:00.000Z to end of that year       |


### Trailing
| Trailing       | Description (sample relative to 2022-11-21T09:34:07.000Z  ($$NOW) |
|----------------|----------------------------------|
| Last minute    | From minus 60 seconds to $$NOW |
| Last hour      | From minus 60 minutes to $$NOW |
| Last 24 hours  | From minus 12 hours to $$NOW |
| Last 7 days    | From minus 7 days to $$NOW |
| Last 30 days   | From minus 30/31 days to $$NOW |
| Last 90 days   | From minus 90 days to $$NOW |
| Last 365 days  | From minus 365/6 days to $$NOW |

### More
The above lists are far from complete, but with the samples below it is very simple to extend it to your needs.

## The details

MongoDB provides 2 types of queries. The common CRUD operations, with Find, Insert, Update and Delete. And the aggregation framework for complex queries, such as $match, $group, $project, $unwind, etc.
The MongoDB documentation provides details information on the [aggregation framework](https://www.mongodb.com/docs/manual/aggregation/)

A basic aggregation query on timestamp (ts for short), looks like:
```javascript
range = { $match: { "ts": {$gte: ISODate("2022-11-01T00:00:00.000Z") , $lt: ISODate("2022-12-01T00:00:00.000Z")}}}
db.simple.aggregate([range])
```

In order to do something against the current date we need to use the predefined variable $$NOW, but evaluting expressions requires a different syntax.  

```javascript
range = { $match: {
         $expr: {
            $and: [ { $gte: [ "$ts",  ISODate("2022-10-01T00:00:00.000Z") ]},
                    { $lt:  [ "$ts",  "$$NOW" ]}
                  ]
            }
        }
}
```
If the date range is all data of today, thn the lower bound is at midnight. We need an MongoDB Aggregation operator to calculate mightnight relative to $$NOW. [$dateTrunc](https://www.mongodb.com/docs/manual/reference/operator/aggregation/dateTrunc/)  
```javascript
range = { $match: {
            $expr: { $gte: [ "$ts", {$dateTrunc: { date: "$$NOW", unit: "day", binSize: 1}}]}
            }
        }
```
If your data also contains future time stamps then we need to set an upperbound as well, this is a bit more complex because there is no dateRoundup function in MongoDB, but with function [$dateAdd](https://www.mongodb.com/docs/manual/reference/operator/aggregation/dateAdd/) 
we add 1 full day to the already calculated lower bound.  

```javascript
range = { $match: {
         $expr: {
            $and: [ { $gte: [ "$ts",  {$dateTrunc: { date: "$$NOW", unit: "day", binSize: 1}}]},
                    { $lt:  [ "$ts",  {$dateAdd: { 
                                        startDate: {$dateTrunc: { 
                                                        date: "$$NOW", 
                                                        unit: "day", 
                                                        binSize: 1
                                                        }
                                                    }, 
                                        unit: 
                                        "day", 
                                        amount: 1
                                        }
                                    } 
                            ]
                    }
                  ]
            }
        }
}
```

As you may notice, there is some repeating code here which we can factor out with the use of [$let](https://www.mongodb.com/docs/manual/reference/operator/aggregation/let/)  The end result:
```javascript
today = { $match: {
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
}}
```

This aggregation pipeline stage can be adapted to do queries for "This Week", "This Month", etc by changing the "unit" attribute.
A quick hack 
```javascript
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
    }
}
```

See code repository for more variations of this code
