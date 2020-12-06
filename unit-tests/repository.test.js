var assert = require('assert');
const fakeData = require('../javascript/barber-data');
const pendingFakeData = require('../javascript/pending-appointments-data');
const scheduledFakeData = require('../javascript/scheduled-appointments-data');
const Repository = require('../javascript/repository');

describe('Repository', () => 
{
  let repository;
    
  before(() => 
  {
    repository = new Repository(fakeData, scheduledFakeData, pendingFakeData);
  })

  describe('Can get all data', () => 
  {
    it('Get barbers', () => 
    {
      assert.strictEqual(Object.keys(repository.getBarbers()).length, 3);
    });

    it('Can get data for one barber', () => {
      let data = repository.getBarber('Mixio Gaytan');

      assert.strictEqual(data.name, 'Mixio Gaytan');
    })

    it('Given barber name and date, return correct hours', () => {
      let slots = repository.getWorkingHours('Mixio Gaytan', '2020-11-02');

      assert.deepStrictEqual(slots[0].startTime, '2020-11-02 8:00') 
    })
  });

  describe('Load data for schedule page', () =>
  {
    it('Given a request for barber names, return array of strings with barber names', () =>
    {
      assert.deepStrictEqual(repository.getBarberNames(), ["Mixio Gaytan", "David Nakasen", "Jeffrey Ortega"]);
    })

    it('Given a correct barber, get correct services list', () => {
      assert.deepStrictEqual(repository.getServiceNamesWithCost('Mixio Gaytan'), 
      [
        '$17.00 - Regular Haircut',
        '$20.00 - Zero Fade/Taper',
        '$13.00 - Resting Facial',
        '$12.00 - Beard Trim'
      ])
    })

    it('Given an incorrect barber, get blank services list', () => {
      assert.deepStrictEqual(repository.getServiceNames('Mixio Mixio'), [])
    })
  })

  describe('Appointment time slots', () => {
    it('Given hours and service, return array of time slots', async () => {
      let hours = repository.getWorkingHours('Mixio Gaytan', '2020-11-02');
      let service = repository.getService('Mixio Gaytan', 'Zero Fade/Taper')
      let slots = await repository.getTimeSlots('Mixio Gaytan', hours, service);
      
      let testSlots = [
        [
          ['08:45', '09:30'],
          ['09:00', '09:45'],
          ['09:15', '10:00'],
          ['09:30', '10:15'],
          ['09:45', '10:30'],
          ['10:00', '10:45'],
          ['10:15', '11:00'],
          ['10:30', '11:15'],
          ['10:45', '11:30'],
          ['11:00', '11:45'],
          ['11:15', '12:00']
        ],
        [
          ['14:45', '15:30'],
          ['15:00', '15:45'],
          ['15:15', '16:00'],
          ['15:30', '16:15'],
          ['15:45', '16:30'],
          ['16:00', '16:45'],
          ['16:15', '17:00'],
          ['16:30', '17:15']
        ]
      ];

      assert.notStrictEqual(slots, testSlots);
    })
  })
});
