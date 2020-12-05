// this file is used for all data operations and SHOULD NOT access the database. It is takes a data source which can be either the real data or fake data
const daysjs = require('dayjs')
const ScheduledRepo = require('./scheduled-repository')
const Api = require('./api');

class Repository 
{
    constructor(data) 
    {
        this.barbers = data;
        this.scheduledSlots = this.getScheduledSlots();
        this.pendingSlots = this.getPendingSlots();
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

    getScheduledSlots = async (barberName) => {
        if (this.scheduledSlots) {
            return this.scheduledSlots;
        }

        let api = new Api();

        let response = await api.get('scheduledappointments');

        if (response[0] != 200) {
            alert("An error has occured. Please try again.");
            return null;
        }

        let scheduledRepo = new ScheduledRepo(barberName, response[1]);
        this.scheduledSlots = scheduledRepo.getAppointmentTimes();

        return this.scheduledSlots;
    }

    getPendingSlots = async (barberName) => {
        if (this.pendingSlots) {
            return this.pendingSlots;
        }

        let api = new Api();

        let response = await api.get('pendingappointments');

        if (response[0] != 200) {
            alert("An error has occured. Please try again.");
            return null;
        }

        let pendingRepo = new ScheduledRepo(barberName, response[1]);
        this.pendingSlots = pendingRepo.getAppointmentTimes();

        return this.pendingSlots;
    }

    getTimeSlots = async (barberName, workingHours, service) =>
    {
        if (!service) {
            return;
        }
        
        let slots = [];
        let serviceLength = service.length;

        let scheduled = await this.getScheduledSlots(barberName);
        let pending = await this.getPendingSlots(barberName);

        if (scheduled == null || pending == null) return;

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
            
            slot = this.removeTakenSlots(scheduled, pending, slot, startTime);

            slots.push(slot);
        });

        return slots;
    }

    removeTakenSlots = (scheduled, pending, openSlots, date) =>
    {
        let timesToRemove = [];

        for (let i = 0; i < openSlots.length; i++)
        {
            let startTime = this.hourAndMinutesToDateTime(openSlots[i][0], date);
            let endTime = this.hourAndMinutesToDateTime(openSlots[i][1], date);


            for (let j = 0; j < pending.length; j++) 
            {
                let startTimePending = pending[j][0];
                let endTimePending = pending[j][1];

                // remove the slot if the pending time overlaps
                if (endTime.isAfter(startTimePending) && startTime.isBefore(endTimePending))
                {
                    timesToRemove.push(this.getHourAndMinutes(startTime))
                }
            }

            for (let k = 0; k < scheduled.length; k++) 
            {
                let startTimeScheduled = scheduled[k][0];
                let endTimeScheduled = scheduled[k][1];

                // remove the slot if the scheduled time overlaps
                if (endTime.isAfter(startTimeScheduled) && startTime.isBefore(endTimeScheduled))
                {
                    timesToRemove.push(this.getHourAndMinutes(startTime))
                }
            }
        }

        timesToRemove.forEach(time => {
            for (let d = 0; d < openSlots.length; d++)
            {
                if (openSlots[d][0] === time)
                {
                    openSlots.splice(d, 1)
                }
            }
        });

        return openSlots;
    }

    hourAndMinutesToDateTime = (time, date) => {
        let formattedTime = date;

        formattedTime = formattedTime.set('hour', time.substring(0, 2));
        formattedTime = formattedTime.set('minute', time.substring(3, 5));
        formattedTime = formattedTime.set('second', 0);
        formattedTime = formattedTime.set('millisecond', 0);

        return formattedTime;
    }

    getHourAndMinutes(time) 
    {
        let hour = time.get('hour') + "";

        if (hour.length === 1) {
            hour = '0' + hour;
        }

        let minute = time.get('minute') + "";

        if (minute.length === 1) {
            minute = '0' + minute;
        }

        return hour + ":" + minute;
    }
}

module.exports = Repository;