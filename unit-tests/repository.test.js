var assert = require('assert');
const fakeData = require('../javascript/barber-data');
const Repository = require('../javascript/repository');

describe('Repository', () => 
{
  let repository;
    
  before(() => 
  {
    repository = new Repository(fakeData);
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
    it('Given hours and service, return array of time slots', () => {
      let hours = repository.getWorkingHours('Mixio Gaytan', '2020-11-04');
      let service = repository.getService('Mixio Gaytan', 'Zero Fade/Taper')

      let slots = repository.getTimeSlots(hours, service);
      let testSlots = [[
        ['11:00', '11:45'], 
        ['11:15', '12:00'],
        ['11:30', '12:15'],
        ['11:45', '12:30'],
        ['12:00', '12:45'],
        ['12:15', '13:00'],
        ['12:30', '13:15'],
        ['12:45', '13:30'],
        ['13:00', '13:45'],
        ['13:15', '14:00'],
      ]];

      assert.deepStrictEqual(slots, testSlots);
    })

    it('Given test slots, remove any that overlap with scheduled and pending appointments', () => {
      let hours = repository.getWorkingHours('Mixio Gaytan', '2020-11-02');
      let service = repository.getService('Mixio Gaytan', 'Zero Fade/Taper')

      let slots = repository.getTimeSlots(hours, service);
    })
  })
});
