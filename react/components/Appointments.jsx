const React = require('react');
import Repository from '../../javascript/repository';
import fakeData from '../../javascript/fake-data';

export default class Appointments extends React.Component {
    constructor(props) {
        super(props);
        this.removeAppointment = this.removeAppointment.bind(this);
        this.calculateTotal = this.calculateTotal.bind(this);
        //let theRepo = await this.getRepo();
        let firstRef = React.createRef();
        this.state = {
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
            nextKey: 2,
            totalCost: 0,
            //repo: theRepo
        }
    }

    getDatabase = async () => {
        if (location.hostname === "localhost") {
            return fakeData;
        }
        else {
            // will ping database for data
        }
    }

    getRepo = async () => {
        let repo = new Repository(await this.getDatabase());

        return repo.getBarbers();
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

    render() {
        return (
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
                        <span>Your total is: $<span id="total" style={{"fontWeight":"bold"}}>{this.state.totalCost}</span></span>
                    </div>
                    <div className="button-container">
                        <button className="button">CONTINUE</button>
                    </div>
                </div>
                <p id="total-appointments" style={{"display":"none"}}>{this.state.appointments.length}</p>
            </div>
        )
    }
}

class Appointment extends React.Component {
    constructor(props) {
        super(props);
        this.remove = this.removeApp.bind(this);
        this.getKey = this.getKey.bind(this);
        this.state = {
            key: this.props.keyProps,
            barber: "",
            date: "",
            time: "",
            cost: 0
        }

        this.getBarbers();
    }

    updateKey = (newKey) => {
        this.setState({
            key: newKey
        });
    }

    getKey = () => {
        return this.state.key;
    }

    removeApp = (key) => {
        this.props.remove(key);
    }

    calculateTotal = () => {
        let id = this.props.keyProps;
        let cost = parseFloat(document.getElementById("select" + id).value);

        // setState is async, so we call calculate total in the callback to make sure the state is up to date
        this.setState({
            cost: cost
        }, () => {
            this.props.calculateTotal();
        })
    }

    updateAllInfo = () => {

    }

    getCost = () => {
        return this.state.cost;
    }

    getBarberNames = () => {
        let names = this.props.repo.getBarberNames();
        let select = document.getElementById('select' + this.props.keyProps)

        names.forEach(name => {
            let option = document.createElement('option');
            option.innerHTML = name;
            select.appendChild(option);
        });
    }

    render() {
        return (
            <div>
                <div className="main">
                    <div className="topForm">
                        <div className="barber">
                            <img src="../images/jeff.PNG" alt="jeff" width={100} className="headshot" />
                        </div>
                        <div>
                            <div className="customMargin">
                                <select class="custom-select" onChange={this.updateAllInfo}>
                                    <option>Select a barber</option>
                                </select>
                            </div>
                                <div className="customMargin">
                                    <select type="select" class="custom-select" onChange={this.calculateTotal} id={"select" + this.props.keyProps}>
                                        <option value="0">Select a service</option>
                                        
                                    </select>
                                </div>
                            </div>
                        </div> 
                        <div className="barberAndCut">
                            <div className="customMargin">
                                <select class="custom-select">
                                    <option>Oct 22 2020</option>
                                    <option>Oct 23 2020</option>
                                    <option>Oct 24 2020</option>
                                </select>
                            </div>
                            <div className="customMargin">
                                <select class="custom-select">
                                    <option>10:00 AM - 10:30 AM</option>
                                    <option>10:00 AM - 10:30 AM</option>
                                    <option>10:00 AM - 10:30 AM</option>
                                </select>
                            </div>
                        </div>

                    {this.props.canRemove &&
                        <div className="remove-button-container">
                            <button type="button" onClick={() => this.removeApp(this.state.key)} id={"remove" + this.state.key} className={"removeAppointment"}>Remove</button>
                        </div>
                    }
                </div>
                {!this.props.canRemove &&
                        <div className="first-appointment-spacer"></div>
                }
                <hr/>
            </div>
        );
    }
}