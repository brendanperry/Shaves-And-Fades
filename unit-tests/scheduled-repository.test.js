var assert = require('assert');
const fakeData = require('../javascript/scheduled-appointments-data');
const ScheduledRepository = require('../javascript/pending-repository');

describe('PendingRepository', () => 
{
  let repository;
    
  before(() => 
  {
    repository = new ScheduledRepository(fakeData);
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

        assert.deepStrictEqual(repository.getAppointments(), appointments);
    })
  })
});
