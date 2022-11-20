
# Common used MongoDB date/time range queries

## Summary
Date/Time ranges relative to the current time are common queries if you need to report data in a monitoring tool or dashboard.
Common queries are:

| Current        |  Past          |
|----------------|----------------|
| Today          |  Yesterday     | 
| This Week      |  Last Week     | 
| This Month     | Last Month     | 
| This Quarter   | Last Quarter   |
| This Half Year | Last Half Year |
| THis Year      | Last Year      |


The above list is far from complete, but with the samples below it is very simple to extend it to your needs.

## The details

MongoDB provides 2 types of queries. The common CRUD operations, with Find, Insert, Update and Delete. And the aggregation framework for complex queries, such as $match, $group, $project, $unwind, etc.
The MongoDB documentation provides details information on the [aggregation framework](https://www.mongodb.com/docs/manual/aggregation/)

A basic aggregation query on timestamp (ts for short), looks like:
```python
range = { $match: { "ts": {$gte: ISODate("2022-11-01T00:00:00.000Z") , $lt: ISODate("2022-12-01T00:00:00.000Z")}}}
db.simple.aggregate([range])
```

In order to do something against the current date we need to use the predefined variable $$NOW, but evaluting expressions requires a different syntax.  

```python
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
```python
range = { $match: {
            $expr: { $gte: [ "$ts", {$dateTrunc: { date: "$$NOW", unit: "day", binSize: 1}}]}
            }
        }
```
If your data also contains future time stamps then we need to set an upperbound as well, this is a bit more complex because there is no dateRoundup function in MongoDB, but with function [$dateAdd](https://www.mongodb.com/docs/manual/reference/operator/aggregation/dateAdd/) 
we add 1 full day to the already calculated lower bound.  

```python
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
```python
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
```python
let thisweek = JSON.parse(JSON.stringify(today))
thisweek["$match"]["$expr"]["$let"]["vars"]["date_begin"]["$dateTrunc"]["unit"] = "week"
thisweek["$match"]["$expr"]["$let"]["in"]["$let"]["vars"]["date_end"]["$dateAdd"]["unit"] = "week"
let thismonth = JSON.parse(JSON.stringify(today))
thismonth["$match"]["$expr"]["$let"]["vars"]["date_begin"]["$dateTrunc"]["unit"] = "month"
thismonth["$match"]["$expr"]["$let"]["in"]["$let"]["vars"]["date_end"]["$dateAdd"]["unit"] = "month"
let thisquarter = JSON.parse(JSON.stringify(today))
thisquarter["$match"]["$expr"]["$let"]["vars"]["date_begin"]["$dateTrunc"]["unit"] = "quarter"
thisquarter["$match"]["$expr"]["$let"]["in"]["$let"]["vars"]["date_end"]["$dateAdd"]["unit"] = "quarter"
let thishalfyear = JSON.parse(JSON.stringify(today))
thishalfyear["$match"]["$expr"]["$let"]["vars"]["date_begin"]["$dateTrunc"]["unit"] = "quarter"
thishalfyear["$match"]["$expr"]["$let"]["vars"]["date_begin"]["$dateTrunc"]["binSize"] = 2
thishalfyear["$match"]["$expr"]["$let"]["in"]["$let"]["vars"]["date_end"]["$dateAdd"]["unit"] = "quarter"
thishalfyear["$match"]["$expr"]["$let"]["in"]["$let"]["vars"]["date_end"]["$dateAdd"]["amount"] = 2
let thisyear = JSON.parse(JSON.stringify(today))
thisyear["$match"]["$expr"]["$let"]["vars"]["date_begin"]["$dateTrunc"]["unit"] = "year"
thisyear["$match"]["$expr"]["$let"]["in"]["$let"]["vars"]["date_end"]["$dateAdd"]["unit"] = "year"
```

See code repository for more variations of this code
