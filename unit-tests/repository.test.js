var assert = require('assert');
const fakeData = require('../javascript/fake-data');
const Repository = require('../javascript/repository');

describe('Repository', () => 
{
  let repository;
    
  before(() => 
  {
    repository = new Repository();
  })

  describe('Can get all data', () => 
  {
    it('Get barbers', () => 
    {
      assert.strictEqual(Object.keys(repository.getBarbers()).length, 3);
    });
  });

  describe('Load data for schedule page', () =>
  {
    it('Given a request for barber names, return array of strings with barber names', () =>
    {
      assert.deepStrictEqual(repository.getBarberNames(), ["Mixio Gaytan", "David Nakasen", "Jeffrey Ortega"]);
    })

    it('Given a correct barber, get correct services list', () => {
      assert.deepStrictEqual(repository.getServices('Mixio Gaytan'), 
      [
        '$17.00 - Regular Haircut',
        '$20.00 - Zero Fade/Taper',
        '$13.00 - Resting Facial',
      ])
    })

    it('Given an incorrect barber, get blank services list', () => {
      assert.deepStrictEqual(repository.getServices('Mixio Mixio'), [])
    })
  })
});
