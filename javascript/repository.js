// this file is used for all data operations and SHOULD NOT access the database. It is takes a data source which can be either the real data or fake data

var fakeData = require('./fake-data');

class Repository 
{
    constructor(data = fakeData) 
    {
        this.data = data;
    }

    getBarbers()
    {
        return this.data.getBarbers();
    }

    getServices(barberName)
    {
        let barberData;
        let formattedServicesList = []

        let barbers = this.data.getBarbers();

        if (barbers != undefined || barbers != null)
        {
            barbers.forEach(barber => 
            {
                if (barber.name === barberName)
                {
                    barberData = barber.services;
                }
            });
            
            if (barberData != null || barberData != undefined)
            {
                barberData.forEach(service => {
                    let item = '$' + (service.cost / 1.0).toFixed(2) + ' - ' + service.name;
                    formattedServicesList.push(item);
                });
            }
        }

        return formattedServicesList;
    }

    getBarberNames()
    {
        let barbers = this.getBarbers();
        
        let barberNames = [];

        barbers.forEach(barber => {
            barberNames.push(barber.name)
        });

        return barberNames;
    }
}

module.exports = Repository;