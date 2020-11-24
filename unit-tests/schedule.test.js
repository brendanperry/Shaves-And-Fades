const Browser = require('zombie');
let assert = require('assert');
let app = require('../server');
let request = require('supertest');

describe('Schedule Page', () => 
{
    var url = "http://localhost:8080/schedule"
    let browser = new Browser();

    // this will start the server so the test can access the UI *only for zombie*
    request(app);

    before((done) => 
    {
        return browser.visit(url, done);
    })

    it("Given new page appointment, appointment count is 1", (done) => 
    {
        assert.strictEqual(browser.text("p#total-appointments"), "1")
        
        done();
    })

    it("Given add appointment button was clicked, appointment count is 2", (done) => 
    {
        browser.pressButton("Add New Appointment")

        assert.strictEqual(browser.text("p#total-appointments"), "2")

        done();
    })

    it("Given two appointments and remove appointment button is clicked, appointment count is 1", (done) => 
    {
        browser.pressButton("#remove2")

        assert.strictEqual(browser.text("p#total-appointments"), "1")

        done();
    })

    it("Given three appointments and remove appointment button is clicked on number 2, appointment 3 remains", (done) => 
    {
        browser.pressButton("Add New Appointment")
        browser.pressButton("Add New Appointment")
        browser.pressButton("#remove3")

        // the id of 3 will be updated to remove2 when state refreshes
        browser.assert.element("#remove2")

        done();
    })

    it("Given page start, the total cost is 0", (done) => {
        assert.strictEqual(browser.text("#total"), "$0")

        done();
    })

    it("Select two services, the total cost is 35", (done) => {
        browser.select("#barber1", "Mixio Gaytan")
        browser.select("#barber2", "Jeffrey Ortega")

        browser.select("#service1", "$17.00 - Regular Haircut")
        browser.select("#service2", "$20.00 - Zero Fade/Taper")

        assert.strictEqual(browser.text("#total"), "$37")

        done();
    })

    it("Remove an appointment, the total cost is subtracted", (done) => {
        browser.pressButton("#remove2")

        assert.strictEqual(browser.text("#total"), "$17")

        done();
    })
})