// this file is used for all data operations and SHOULD NOT access the database. It is takes a data source which can be either the real data or fake data
const daysjs = require('dayjs')

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

    getBarber(barberName)
    {
        for (let i = 0; i < this.barbers.length; i++)
        {
            if (barberName == this.barbers[i].name) 
            {
                return this.barbers[i];
            }
        }
    }

    getServiceNames(barberName)
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

    getDay(barberInfo, date)
    {
        for (let i = 0; i < barberInfo.daysWorking.length; i++)
        {
            if (daysjs(barberInfo.daysWorking[i].date).isSame(daysjs(date)))
            {
                return barberInfo.daysWorking[i];
            }
        }
    }

    getWorkingHours(barberName, date) 
    {
        let barber = this.getBarber(barberName);

        let day = this.getDay(barber, date);

        return day.hours;
    }

    getDates(barberName)
    {
        let barber = this.getBarber(barberName);
        let dates = [];

        barber.daysWorking.forEach(day => {
            dates.push(daysjs(day.date).format('DD MMM YYYY'));
        });

        return dates;
    }

    getService(barberName, serviceName)
    {
        let barber = this.getBarber(barberName);

        for (let i = 0; i < barber.services.length; i++)
        {
            if (barber.services[i].name === serviceName)
            {
                return barber.services[i];
            }
        }
    }

    getTimeSlots(workingHours, service)
    {
        if (!service) {
            return;
        }
        
        let slots = [];
        let serviceLength = service.length;

        workingHours.forEach(shift => {
            let slot = [];
            let startTime = daysjs(shift.startTime);
            let endTime = daysjs(shift.endTime);

            endTime = endTime.subtract(serviceLength, 'minute');

            while (startTime.isBefore(endTime) || startTime.isSame(endTime))
            {
                let appointmentEndTime = startTime.add(service.length, 'minute');
                slot.push([startTime.format('HH:mm'), appointmentEndTime.format('HH:mm')]);

                startTime = startTime.add(15, 'minute');
            }

            slots.push(slot);
        });

        return slots;
    }
}

module.exports = Repository;