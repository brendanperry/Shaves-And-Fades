const React = require('react');

export default class Appointment extends React.Component {
    constructor(props) {
        super(props);
        this.remove = this.removeApp.bind(this);
        this.getKey = this.getKey.bind(this);
        this.state = {
            key: this.props.keyProps,
            barber: "",
            date: "",
            time: "",
            service: "",
            cost: 0
        }
    }

    // once the appointment is loaded, update the info
    componentDidMount() {
        this.getBarberNames();
    }

    updateKey(newKey) {
        this.setState({
            key: newKey
        });
    }

    getKey() {
        return this.state.key;
    }

    removeApp(key) {
        this.props.remove(key);
    }

    calculateTotal() {
        let id = this.props.keyProps;
        let cost = parseFloat(document.getElementById("service" + id).value);

        // setState is async, so we call calculate total in the callback to make sure the state is up to date
        this.setState({
            cost: cost
        }, () => {
            this.props.calculateTotal();
        })
    }

    barberChanged(event) {
        let select = event.srcElement;
        let barberName = select.value;

        this.setState({
            barber: barberName
        }, () => {
            this.updateServices(barberName);
            this.updateBarberPhoto(barberName);
            this.updateDates(barberName);
            this.updateTimes(null);
        })
    }

    updateBarberPhoto(barber) {
        let photo = document.getElementById("headshot" + this.props.keyProps);
        photo.src = "../images/" + barber.replace(/ /g,'') + ".PNG";

        if (barber == "Select a barber") {
            photo.style.display = "none";
        }
        else {
            photo.style.display = "block";
        }
    }

    updateServices(barber) {
        let serviceNames = this.props.repo.getServiceNamesWithCost(barber);
        let serviceCosts = this.props.repo.getServiceCosts(barber);

        let select = document.getElementById('service' + this.props.keyProps)
        select.length = 1;

        for (let i = 0; i < serviceCosts.length; i++) {
            let option = document.createElement('option');
            option.innerHTML = serviceNames[i];
            option.value = serviceCosts[i]
            select.appendChild(option);
        }
    }

    serviceChanged(event) {
        // update cost and reset the selects
        this.calculateTotal();
        this.updateDates();
        this.updateTimes(null);

        let serviceText = event.srcElement[event.srcElement.selectedIndex].innerText.replace(/[^A-Za-z\s/]/g,'').trim();

        this.setState({
            service: serviceText
        });
    }

    dateChanged(event) {
        let date = event.srcElement.value;
        this.updateTimes(date);

        this.setState({
            date: date
        })
    }

    updateDates() {
        let dates = this.props.repo.getDates(this.state.barber);

        let select = document.getElementById('date' + this.props.keyProps)
        select.length = 1;

        dates.forEach(date => {
            let option = document.createElement('option');
            option.innerHTML = date;
            select.appendChild(option);
        });
    }

    updateTimes(date) {
        // used to reset the select
        if (date == null) {
            let select = document.getElementById('time' + this.props.keyProps)
            select.length = 1;
            return;
        }

        let hours = this.props.repo.getWorkingHours(this.state.barber, date);
        let service = this.props.repo.getService(this.state.barber, this.state.service)

        let slots = this.props.repo.getTimeSlots(hours, service);
        let select = document.getElementById('time' + this.props.keyProps)
        select.length = 1;

        slots.forEach(slot => {
            slot.forEach(time => {
                let apptointmentSlot = this.convertToLocalTime(time[0]) + " - " + this.convertToLocalTime(time[1]);
                let option = document.createElement('option');
                option.innerHTML = apptointmentSlot;
                select.appendChild(option);
            });
        });
    }

    convertToLocalTime(time24) {
        let time = time24;
        let H = +time.substr(0, 2);
        let h = (H % 12) || 12;
        let ampm = H < 12 ? " AM" : " PM";
        time = h + time.substr(2, 3) + ampm;
        return time;
    };

    getCost() {
        return this.state.cost;
    }

    getBarberNames() {
        let names = this.props.repo.getBarberNames();
        let select = document.getElementById('barber' + this.props.keyProps)

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
                            <img src="" style={{"display": "none"}} alt="barber" width={100} className="headshot" id={"headshot" + this.props.keyProps}/>
                        </div>
                        <div>
                            <div className="customMargin">
                                <select type="select" className="custom-select" onChange={() => this.barberChanged(event)} id={"barber" + this.props.keyProps}>
                                    <option>Select a barber</option>
                                </select>
                            </div>
                                <div className="customMargin">
                                    <select type="select" className="custom-select" onChange={() => this.serviceChanged(event)} id={"service" + this.props.keyProps}>
                                        <option value="0">Select a service</option>
                                    </select>
                                </div>
                            </div>
                        </div> 
                        <div className="barberAndCut">
                            <div className="customMargin">
                                <select type="select" className="custom-select" id={"date" + this.props.keyProps} onChange={() => this.dateChanged(event)}>
                                    <option value="0">Select a date</option>
                                </select>
                            </div>
                            <div className="customMargin">
                                <select type="select" className="custom-select" id={"time" + this.props.keyProps}>
                                    <option value="0">Select a time</option>
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