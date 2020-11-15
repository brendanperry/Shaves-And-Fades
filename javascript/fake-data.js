// this class should mimic the real database for testing

let barbers = [
    {
        name: "Mixio Gaytan",
        services: [
            {
                name: "Regular Haircut",
                cost: 17.00
            },
            {
                name: "Zero Fade/Taper",
                cost: 20.00
            },
            {
                name: "Resting Facial",
                cost: 13.00
            }
        ],
        daysWorking: [
            {
                date: "11-02-2020",
                hours: [
                    {
                        startTime: "8:00",
                        endTime: "12:00"
                    },
                    {
                        startTime: "13:00",
                        endTime: "18:00"
                    }
                ]
            },
            {
                date: "11-03-2020",
                hours: [
                    {
                        startTime: "8:00",
                        endTime: "12:00"
                    },
                    {
                        startTime: "13:00",
                        endTime: "17:00"
                    }
                ]
            }
        ]
    },
    {
        name: "David Nakasen",
        services: [
            {
                name: "Regular Haircut",
                cost: 17.00
            },
            {
                name: "Zero Fade/Taper",
                cost: 20.00
            },
            {
                name: "Resting Facial",
                cost: 13.00
            }
        ],
        daysWorking: [
            {
                date: "11-02-2020",
                hours: [
                    {
                        startTime: "8:00",
                        endTime: "12:00"
                    },
                    {
                        startTime: "13:00",
                        endTime: "18:00"
                    }
                ]
            },
            {
                date: "11-03-2020",
                hours: [
                    {
                        startTime: "8:00",
                        endTime: "12:00"
                    },
                    {
                        startTime: "13:00",
                        endTime: "17:00"
                    }
                ]
            }
        ]
    },
    {
        name: "Jeffrey Ortega",
        services: [
            {
                name: "Regular Haircut",
                cost: 17.00
            },
            {
                name: "Zero Fade/Taper",
                cost: 20.00
            },
            {
                name: "Resting Facial",
                cost: 13.00
            }
        ],
        daysWorking: [
            {
                date: "11-02-2020",
                hours: [
                    {
                        startTime: "8:00",
                        endTime: "12:00"
                    },
                    {
                        startTime: "13:00",
                        endTime: "18:00"
                    }
                ]
            },
            {
                date: "11-03-2020",
                hours: [
                    {
                        startTime: "8:00",
                        endTime: "12:00"
                    },
                    {
                        startTime: "13:00",
                        endTime: "17:00"
                    }
                ]
            }
        ]
    }
]

// let services = [
//     {
//         name: "Regular Haircut",
//         cost: 17
//     },
//     {
//         name: "Zero Fade/Taper",
//         cost: 20
//     },
//     {
//         name: "Resting Facial",
//         cost: 13
//     }
// ]

module.exports = 
{
    getBarbers: function() 
    {
        return barbers;
    },

    // getServices: function() 
    // {
    //     return services;
    // },
}