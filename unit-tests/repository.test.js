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

    it('Get Services', () =>
    {
      assert.strictEqual(Object.keys(repository.getServices()).length, 3)
    })
  });

  describe('Load data for schedule page', () =>
  {
    it('Given a request for barber names, return array of strings with barber names', () =>
    {
      assert.deepStrictEqual(repository.getBarberNames(), ["Mixio Gaytan", "David Nakasen", "Jeffrey Ortega"]);
    })
  })
});
