const React = require('react');
import Repository from '../../javascript/repository';
import Api from '../../javascript/api';
import Appointment from './Appointment.jsx';
import Loading from './Loading.jsx';
import Popup from './Popup.jsx';
import { loadStripe } from '@stripe/stripe-js';
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

        return JSON.stringify(data);
    }

    addPayment = async () => {
        let api = new Api();
        let checkoutResponse = await api.get('checkout');
        
        if (checkoutResponse[0] != 200) {
            alert("Something went wrong. Please try again.");
            console.log("Something went wrong. Please try again.");
            return;
        }

        const sessionId = checkoutResponse[1].id;

        let data = this.getAppointmentData(sessionId);

        // success, now we need to mark the time slots as pending
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

        // private key: sk_test_51HBLUsDGxKT2NkYgUU4esEBYQdoRjrjcu6Lx0jQCcP3QFYAcDsz0lF7bypIFxDPVoW2NGffiYbNR9NbTeIMHYHWT00dXSKyY8k
        // public key: pk_test_51HBLUsDGxKT2NkYgVHvoExpjT6UP7ECQf0ZNRSfDLD1u2jQk3VPoJrj3bFqM70gqu9NZM2bdjzC2u6CDNItk2t0i00bTgBKg2R
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
