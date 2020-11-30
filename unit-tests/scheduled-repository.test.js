var assert = require('assert');
const daysjs = require('dayjs')
const fakeData = require('../javascript/scheduled-appointments-data');
const ScheduledRepository = require('../javascript/scheduled-repository');

describe('PendingRepository', () => 
{
  let repository;
    
  before(() => 
  {
    repository = new ScheduledRepository('Mixio Gaytan', fakeData);
  })

  describe('Can get all data', () => 
  {
    it('Returns all appointments', () => {
        let appointments = [
          [
              'Mixio Gaytan',
              '02 Nov 2020',
              '08:00 AM - 08:45 AM',
              'Regular Haircut',
              17,
              'cs_test_c17V2LbsrH6DyowaJVmHGyQdoCDlZEJgh6FwIdynET1ZbiLK9gKLVJf5YW'
          ],
          [
              'Mixio Gaytan',
              '02 Nov 2020',
              '05:15 PM - 06:00 PM',
              'Regular Haircut',
              17,
              'cs_test_c1UMoxInCDm6foou4YwBoBnyLEoCDA0vgJxkXrqBvIrhSCkTaNzdtiDDpn'
          ],
        ]

        assert.notStrictEqual(repository.getAppointments(), appointments);
    })

    it('Returns appointment times', () => {
      let startOne = daysjs(new Date('2020-11-02T13:00:00.000Z'));
      let endOne = daysjs(new Date('2020-11-02T13:45:00.000Z'));

      let startTwo = daysjs(new Date('2020-11-02T22:15:00.000Z'));
      let endTwo = daysjs(new Date('2020-11-02T23:00:00.000Z'));

      let dates = [[startOne, endOne], [startTwo, endTwo]];

      assert.notStrictEqual(repository.getAppointmentTimes(), dates);
    })
  })

  describe('Operations functioning correctly', () => {
    it('Converts 12 hour time to 24 hour time', () => {
      let time12 = '1:30 PM';
      let time24 = '13:30';

      assert.strictEqual(repository.convertTime12to24(time12), time24);
    })
  })
});
