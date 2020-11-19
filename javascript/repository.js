// this file is used for all data operations and SHOULD NOT access the database. It is takes a data source which can be either the real data or fake data

class Repository 
{
    constructor(data) 
    {
        this.barbers = data;
    }

    getBarbers()
    {
        return this.barbers;
    }

    getServiceNames(barberName)
    {
        let barberData;
        let formattedServicesList = []

        this.barbers.forEach(barber => 
        {
            console.log(barber.name);
            if (barber.name === barberName)
            {
                barberData = barber.services;
            }
        });

        if (barberData == null || barberData == undefined) return []
        
        barberData.forEach(service => {
            formattedServicesList.push(service.name);
        });

        return formattedServicesList;
    }

    getServiceCosts(barberName)
    {
        let barberData;
        let formattedServicesList = []

        this.barbers.forEach(barber => 
        {
            if (barber.name === barberName)
            {
                barberData = barber.services;
            }
        });

        if (barberData == null || barberData == undefined) return []
            
        barberData.forEach(service => {
            formattedServicesList.push(service.cost);
        });

        return formattedServicesList;
    }

    getServiceNamesWithCost(barberName)
    {
        let barberData;
        let formattedServicesList = []

        this.barbers.forEach(barber => 
        {
            if (barber.name === barberName)
            {
                barberData = barber.services;
            }
        });

        if (barberData == null || barberData == undefined) return []
        
        barberData.forEach(service => {
            let item = '$' + (service.cost / 1.0).toFixed(2) + ' - ' + service.name;
            formattedServicesList.push(item);
        });

        return formattedServicesList;
    }

    getBarberNames()
    {   
        let barberNames = [];

        this.barbers.forEach(barber => {
            barberNames.push(barber.name)
        });

        return barberNames;
    }
}

module.exports = Repository;