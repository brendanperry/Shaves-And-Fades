const React = require('react');
import Repository from '../../javascript/repository';
import Api from '../../javascript/api';
import Appointment from './Appointment.jsx';
import Loading from './Loading.jsx';
import Popup from './Popup.jsx';
import { loadStripe } from '@stripe/stripe-js';
const daysjs = require('dayjs')
const stripePromise = loadStripe('pk_test_51HsZ8ND4ypkbyKIte9muIIOiUaKJxrKzXeooYSnf0CCq8LKfDHhmH2LzePf29oGTDKPEgi5ryXpz8H8CJBr91Oi200eZiE1XAu');

export default class Appointments extends React.Component {
    constructor(props) {
        super(props);
        this.removeAppointment = this.removeAppointment.bind(this);
        this.calculateTotal = this.calculateTotal.bind(this);
        
        this.state = {
            appointments: [],
            appointmentRefs: [],
            nextKey: 2,
            totalCost: 0,
            repo: null,
            loading: true,
        }
    }

    // load in the database information async
    componentDidMount = async () => {
        let theRepo = await this.getRepo();

        if (theRepo != null) {
            let firstRef = React.createRef();

            this.setState({
                appointments: [
                    <Appointment 
                        key={1} 
                        keyProps={1} 
                        canRemove={false} 
                        calculateTotal={this.calculateTotal} 
                        ref={firstRef} 
                        repo={theRepo}
                    />],
                appointmentRefs: [firstRef],
                repo: theRepo,
                loading: false
            })
        }
    }

    getRepo = async () => {
        let api = new Api();

        let response = await api.get('barbers');

        if (response[0] != 200) {
            alert("An error has occured. Please try again.");
            return null;
        }

        return new Repository(response[1]);
    }

    addAppointment = () => {
        let apps = [...this.state.appointments];
        let key = this.state.nextKey;

        let appRefs = [...this.state.appointmentRefs];
        this.newRef = React.createRef();
        let nextKey = appRefs[appRefs.length - 1].current.getKey() + 1;

        apps.push(
        <Appointment 
            ref={this.newRef} 
            key={this.state.nextKey} 
            keyProps={nextKey} 
            canRemove={true} 
            remove={this.removeAppointment} 
            calculateTotal={this.calculateTotal} 
            repo={this.state.repo}
        />)

        appRefs.push(this.newRef);
        key++;

        this.setState({
            appointments: apps,
            nextKey: key,
            appointmentRefs: appRefs,
            nextKey: this.state.nextKey + 1
        })
    }

    removeAppointment = (key) => {
        let apps = [...this.state.appointments];
        let appRefs = [...this.state.appointmentRefs];
        let indexToRemove = -1;

        for (let i = 0; i < apps.length; i++) {
            if (appRefs[i].current.getKey() == key) {
                indexToRemove = i;
                break;
            }
        }

        for (let j = indexToRemove + 1; j < apps.length; j++) {
            let key = appRefs[j].current.getKey() - 1;
            appRefs[j].current.updateKey(key);
        }

        apps.splice(indexToRemove, 1);
        appRefs.splice(indexToRemove, 1);

        this.setState({
            appointments: apps,
            appointmentRefs: appRefs
        }, () => {
            this.calculateTotal();
        })
    }

    calculateTotal = () => {
        let apps = [...this.state.appointmentRefs]
        let sum = 0;

        apps.forEach(appointment => {
            sum += appointment.current.getCost()
        });

        this.setState({
            totalCost: sum
        })
    }

    continue = () => {
        let summary = "";

        let apps = [...this.state.appointmentRefs]
        let isComplete = true;

        apps.forEach(app => {
            if (!app.current.isFormComplete()) {
                isComplete = false;
            }

            summary += app.current.getSummary() + "--------------\n"
        });

        summary += "Total Cost: $" + this.state.totalCost;

        if (isComplete) {
            document.getElementById("modal-text").innerHTML = summary;
            document.getElementById("addPayment").style = "display: block";
        }
        else {
            document.getElementById("modal-text").innerHTML = "Please complete all form fields and try again.";
            document.getElementById("addPayment").style = "display: none";
        }

        return summary;
    }

    getAppointmentData = (sessionId) => {
        let apps = [...this.state.appointmentRefs]
        let data = [];

        apps.forEach(app => {
            data.push(app.current.getData(sessionId));
        });

        return data;
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

        if (hours.length == 1) {
            hours = "0" + hours;
        }
      
        return `${hours}:${minutes}`;
    }

    timesAreOverlapping = () => {
        let isOverlapping = false;
        let apps = [...this.state.appointmentRefs];
        let takenSlots = []

        apps.forEach(app => {
            let date = app.current.getDate();
            let time = app.current.getTime();
            let barberName = app.current.getBarber();

            let startTime = this.state.repo.hourAndMinutesToDateTime(this.convertTime12to24(time.split('-')[0].trim()), daysjs(date));
            let endTime = this.state.repo.hourAndMinutesToDateTime(this.convertTime12to24(time.split('-')[1].trim()), daysjs(date));

            takenSlots.forEach(slot => {
                if (barberName == slot[0]) {
                    if (endTime.isAfter(slot[1][0]) && startTime.isBefore(slot[1][1]))
                    {
                        alert("You have overlapping appointments. Please choose a different time.")
                        isOverlapping = true;
                    }
                }
            });

            takenSlots.push([barberName, [startTime, endTime]]);
        });

        return isOverlapping;
    }

    slotsAreStillAvailable = async () => {
        let apps = [...this.state.appointmentRefs];

        for (let i = 0; i < apps.length; i++) {
            let barberName = apps[i].current.getBarber();
            let service = this.state.repo.getService(barberName, apps[i].current.getService());
            let date = apps[i].current.getDate();
            let time = apps[i].current.getTime();
            let startTime = this.convertTime12to24(time.split('-')[0].trim());
            let endTime = this.convertTime12to24(time.split('-')[1].trim());

            let hours = this.state.repo.getWorkingHours(barberName, date);
            let slots = await this.state.repo.getTimeSlots(barberName, hours, service, date);

            let timeStillOpen = false;

            slots.forEach(slot => {
                slot.forEach(time => {
                    if (time[0] == startTime && time[1] == endTime) {
                        timeStillOpen = true;
                    }
                });
            });

            if (timeStillOpen == false) {
                alert("The time " + date + " at " + time + " is no longer available. Please select a new time.")
                return false;
            } 
        }

        return true;
    }

    addPayment = async () => {
        if (!(await this.slotsAreStillAvailable()) || this.timesAreOverlapping()) {
            return;
        }

        let api = new Api();
        let checkoutResponse = await api.get('checkout');
        
        if (checkoutResponse[0] != 200) {
            alert("Something went wrong. Please try again.");
            return;
        }

        const sessionId = checkoutResponse[1].id;

        let data = this.getAppointmentData(sessionId);

        // success, now we need to mark the time slots as pending so they can't be scheduled over while adding a card
        let markPendingResponse = await api.post('pendingappointment', data);

        if (markPendingResponse != 200) {
            alert("Something went wrong. Please try again.");
            console.log(markPendingResponse);
            return;
        }

        window.onbeforeunload = function () {}

        // When the customer clicks on the button, redirect them to Checkout.
        const stripe = await stripePromise;
        const { error } = await stripe.redirectToCheckout({
            sessionId,
        });
    }

    render() {
        return (
            <div>
                {this.state.loading === true && 
                    <Loading />
                }
                {this.state.loading === false &&
                    <div>
                        <div style={{"textAlign" :"center","marginTop":"25px"}}>
                            <h1>Schedule Your Time</h1>
                        <div id="bar" />
                        </div>
                            {this.state.appointments}
                        <div className="add-button-container">
                            <button onClick={this.addAppointment} className="addAppointment">Add New Appointment</button>
                        </div>
                        <div className="footer">
                            <div style={{"marginRight": "10px"}}>
                                <span>Your total is: <span id="total" style={{"fontWeight":"bold"}}>${this.state.totalCost}</span></span>
                            </div>
                            <div className="button-container">
                                <button className="button" data-toggle="modal" data-target="#exampleModal" onClick={this.continue}>CONTINUE</button>
                            </div>
                        </div>
                        <p id="total-appointments" style={{"display":"none"}}>{this.state.appointments.length}</p>
                    </div>
                }
                <Popup payButton={this.addPayment} />

            </div>
        )
    }
}
