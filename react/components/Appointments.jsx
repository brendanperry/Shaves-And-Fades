const React = require('react');
import Repository from '../../javascript/repository';
import Api from '../../javascript/api';
import Appointment from './Appointment.jsx';
import Loading from './Loading.jsx';

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
            loading: true
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
                                <button className="button">CONTINUE</button>
                            </div>
                        </div>
                        <p id="total-appointments" style={{"display":"none"}}>{this.state.appointments.length}</p>
                    </div>
                }
            </div>
        )
    }
}
