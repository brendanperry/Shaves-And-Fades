'use strict';

const e = React.createElement;

class Appointments extends React.Component {
    constructor(props) {
        super(props);
        this.removeAppointment = this.removeAppointment.bind(this);
        this.state = {
            appointments: [<Appointment key={0} canRemove={false} />],
            keyCount: 1
        }
    }

    addAppointment = () => {
        let apps = [...this.state.appointments];
        let currentKey = this.state.keyCount;

        apps.push(<Appointment key={currentKey} keyProps={currentKey} canRemove={true} remove={this.removeAppointment} />)

        currentKey += 1;

        this.setState({
            appointments: apps,
            keyCount: currentKey
        })
    }

    removeAppointment = (key) => {
        let apps = [...this.state.appointments]
        let indexToRemove = -1;

        for (let i = 0; i < apps.length; i++) {
            if (apps[i].keyProps == key) {
                indexToRemove = i;
                break;
            }
        }

        apps.splice(indexToRemove, 1)

        this.setState({
            appointments: apps
        })
    }

    render() {
        return (
            <div>
                {this.state.appointments}
                <div>
                    <button onClick={this.addAppointment}>Add another appointment</button>
                    <p>Total appointments: {this.state.appointments.length}</p>
                </div>
            </div>
        )
    }
}

class Appointment extends React.Component {
    constructor(props) {
        super(props);
        this.remove = this.removeApp.bind(this);
        this.state = {
            barber: "",
            date: "",
            time: "",
            cost: ""
        }
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
                        <button type="button" onClick={() => this.removeApp(this.props.keyProps)}>Remove</button>
                    </div>
                }
            </div>
        );
    }
}

const domContainer = document.querySelector('#appointments');
ReactDOM.render(e(Appointments), domContainer)