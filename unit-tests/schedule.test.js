const Browser = require('zombie')
let assert = require('assert')

describe('Schedule Page', () => {
    var url = "http://localhost:3000/schedule"
    let browser = new Browser();

    before((done) => {
        return browser.visit(url, done);
    })

    it("Given new page appointment, appointment count is 1", (done) => {
        assert.strictEqual(browser.text("p#total-appointments"), "1")
        done();
    })

    it("Given add appointment button was clicked, appointment count is 2", (done) => {
        browser.pressButton("Add New Appointment")

        assert.strictEqual(browser.text("p#total-appointments"), "2")

        done();
    })

    it("Given two appointments and remove appointment button is clicked, appointment count is 1", (done) => {
        browser.pressButton("Remove Appointment 2")

        assert.strictEqual(browser.text("p#total-appointments"), "1")
        done();
    })

    it("Given three appointments and remove appointment button is clicked on number 2, appointment 3 remains", (done) => {
        browser.pressButton("Add New Appointment")
        browser.pressButton("Add New Appointment")
        browser.pressButton("Remove Appointment 2")

        browser.assert.element(".remove2")
        done();
    })
})