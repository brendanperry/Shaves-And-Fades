'use strict';

const e = React.createElement;

class Appointments extends React.Component {
    constructor(props) {
        super(props);
        this.removeAppointment = this.removeAppointment.bind(this);
        let firstRef = React.createRef();
        this.state = {
            appointments: [<Appointment key={1} keyProps={1} canRemove={false} ref={firstRef} />],
            appointmentRefs: [firstRef],
            nextKey: 2
        }
    }

    addAppointment = () => {
        let apps = [...this.state.appointments];
        let key = this.state.nextKey;

        let appRefs = [...this.state.appointmentRefs];
        this.newRef = React.createRef();
        let nextKey = appRefs[appRefs.length - 1].current.getKey() + 1;

        apps.push(<Appointment ref={this.newRef} key={this.state.nextKey} keyProps={nextKey} canRemove={true} remove={this.removeAppointment} />)

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
        let apps = [...this.state.appointments]
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

    render() {
        return (
            <div>
                {this.state.appointments}
                <div>
                    <button onClick={this.addAppointment} className="addAppointment">Add New Appointment</button>
                    <p id="total-appointments">{this.state.appointments.length}</p>
                </div>
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
            cost: ""
        }
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

    render() {
        return (
            <div>
                <div style={{"textAlign" :"center","marginTop":"25px"}}>
                    <h1>Select a barber</h1>
                    <div id="bar" />
                </div>
                <main>
                    <div className="barber">
                        <img src="../images/jeff.PNG" alt="jeff" width={100} className="headshot" />
                        <p>Jeffrey Ortega</p>
                    </div>
                    <div className="barber">
                        <img src="../images/mixio.PNG" alt="mixio" width={100} className="headshot" />
                        <p>Mixio Gaytan</p>
                    </div>
                    <div className="barber">
                        <img src="../images/david.PNG" alt="david" width={100} className="headshot" />
                        <p>David Nakasen</p>
                    </div>
                </main>
                <div>
                    <select>
                        <option>One</option>
                        <option>Two</option>
                        <option>Three</option>
                    </select>
                </div>
                {this.props.canRemove &&
                    <div style={{"display": "flex", "justifyContent": "center"}}>
                        <button type="button" onClick={() => this.removeApp(this.state.key)} className={"remove" + this.state.key}>Remove Appointment {this.state.key}</button>
                    </div>
                }
            </div>
        );
    }
}

const domContainer = document.querySelector('#appointments');
ReactDOM.render(e(Appointments), domContainer)