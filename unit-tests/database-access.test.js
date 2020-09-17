const dbAccess = require('../database/data-access')

test ('adds 1 + 2 to equal 3', () => {
    expect(dbAccess.testFunction(1, 2)).toBe(3);
})