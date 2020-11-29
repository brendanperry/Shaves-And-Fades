// this file is used for all data operations and SHOULD NOT access the database. It is takes a data source which can be either the real data or fake data
// it is to be used for scheduled and pending data because it is in the same format
const daysjs = require('dayjs');

class ScheduledRepository 
{
    constructor(barberName, appointments) 
    {
        this.appointments = appointments;
        this.barberName = barberName;
    }

    getAppointments = () => {
        let barberApps = [];

        this.appointments.forEach(app => {
            if (app[0] == this.barberName) {
                barberApps.push(app)
            }
        });

        return barberApps;
    }

    getAppointmentTimes = () => {
        let times = []

        let apps = this.getAppointments();

        apps.forEach(app => {
            let time = app[2];
            let date = app[1];

            let formattedTime = this.hourAndMinutesToDateTime(time, date);

            times.push(formattedTime);
        });

        return times;
    }

    hourAndMinutesToDateTime = (time, date) => {
        let startTime = daysjs(new Date(date));
        let endTime = daysjs(new Date(date));

        let start = this.convertTime12to24(time.substring(0, 8));
        let end = this.convertTime12to24(time.substring(11, 19));

        startTime = startTime.set('hour', start.substring(0, 2));
        startTime = startTime.set('minute', start.substring(3, 5));
        startTime = startTime.set('second', 0);
        startTime = startTime.set('millisecond', 0);

        endTime = endTime.set('hour', end.substring(0, 2));
        endTime = endTime.set('minute', end.substring(3, 5));
        endTime = endTime.set('second', 0);
        endTime = endTime.set('millisecond', 0);

        return [startTime, endTime];
    }

    convertTime12to24 = (time12h) => {
        const [time, modifier] = time12h.split(' ');
      
        let [hours, minutes] = time.split(':');
      
        if (hours === '12') {
            hours = '00';
        }
      
        if (modifier === 'PM') {
            hours = parseInt(hours, 10) + 12;
        }
      
        return `${hours}:${minutes}`;
    }
}

module.exports = ScheduledRepository;