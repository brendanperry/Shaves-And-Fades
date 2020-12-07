// this class should mimic the real database for testing

let barbers = [
    {
        name: "Mixio Gaytan",
        username: "Mixio",
        password: "password",
        id: Date.now().toString(),
        services: [
            {
                name: "Regular Haircut",
                cost: 17.00,
                length: 45
            },
            {
                name: "Zero Fade/Taper",
                cost: 20.00,
                length: 45
            },
            {
                name: "Resting Facial",
                cost: 13.00,
                length: 30
            },
            {
                name: "Beard Trim",
                cost: 12.00,
                length: 30
            }
        ],
        daysWorking: [
            {
                date: "2020-11-02",
                hours: [
                    {
                        startTime: "2020-11-02 8:00",
                        endTime: "2020-11-02 12:00"
                    },
                    {
                        startTime: "2020-11-02 13:00",
                        endTime: "2020-11-02 18:00"
                    }
                ]
            },
            {
                date: "2020-11-03",
                hours: [
                    {
                        startTime: "2020-11-03 8:00:00",
                        endTime: "2020-11-03 12:00"
                    },
                    {
                        startTime: "2020-11-03 13:00",
                        endTime: "2020-11-03 17:00"
                    }
                ]
            },
            {
                date: "2020-11-04",
                hours: [
                    {
                        startTime: "2020-11-03 11:00",
                        endTime: "2020-11-03 14:00"
                    }
                ]
            }
        ]
    },
    {
        name: "David Nakasen",
        username: "David",
        password: "password",
        id: Date.now().toString(),
        services: [
            {
                name: "Regular Haircut",
                cost: 17.00,
                length: 45
            },
            {
                name: "Zero Fade/Taper",
                cost: 20.00,
                length: 45
            },
            {
                name: "Resting Facial",
                cost: 13.00,
                length: 30
            }
        ],
        daysWorking: [
            {
                date: "2020-11-02",
                hours: [
                    {
                        startTime: "2020-11-02 8:00",
                        endTime: "2020-11-02 12:00"
                    },
                    {
                        startTime: "2020-11-02 13:00",
                        endTime: "2020-11-02 18:00"
                    }
                ]
            },
            {
                date: "2020-11-03",
                hours: [
                    {
                        startTime: "2020-11-03 8:00:00",
                        endTime: "2020-11-03 12:00"
                    },
                    {
                        startTime: "2020-11-03 13:00",
                        endTime: "2020-11-03 17:00"
                    }
                ]
            },
            {
                date: "2020-11-04",
                hours: [
                    {
                        startTime: "2020-11-03 11:00",
                        endTime: "2020-11-03 14:00"
                    }
                ]
            }
        ]
    },
    {
        name: "Jeffrey Ortega",
        username: "Jeff",
        password: "password",
        id: Date.now().toString(),
        services: [
            {
                name: "Regular Haircut",
                cost: 17.00,
                length: 45
            },
            {
                name: "Zero Fade/Taper",
                cost: 20.00,
                length: 45
            },
            {
                name: "Resting Facial",
                cost: 13.00,
                length: 30
            }
        ],
        daysWorking: [
            {
                date: "2020-11-02",
                hours: [
                    {
                        startTime: "2020-11-02 8:00",
                        endTime: "2020-11-02 12:00"
                    },
                    {
                        startTime: "2020-11-02 13:00",
                        endTime: "2020-11-02 18:00"
                    }
                ]
            },
            {
                date: "2020-11-03",
                hours: [
                    {
                        startTime: "2020-11-03 8:00",
                        endTime: "2020-11-03 12:00"
                    },
                    {
                        startTime: "2020-11-03 13:00",
                        endTime: "2020-11-03 17:00"
                    }
                ]
            }
        ]
    }
]

module.exports = barbers;