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

    getServices()
    {
        return this.data.getBarbers();
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