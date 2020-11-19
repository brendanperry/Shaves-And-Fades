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
            cost: 0
        }
    }

    // once the appointment is loaded, update the info
    componentDidMount = () => {
        this.getBarberNames();
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

    barberChanged = () => {
        let select = document.getElementById('barber' + this.props.keyProps);
        let barberName = select[select.selectedIndex].text;

        this.updateServices(barberName);
        this.updateBarberPhoto(barberName);
        // update schedule
    }

    updateBarberPhoto = (barberName) => {
        let photo = document.getElementById("headshot" + this.props.keyProps);
        photo.src = "../images/" + barberName.replace(/ /g,'') + ".PNG";

        if (barberName == "Select a barber") {
            photo.style.display = "none";
        }
        else {
            photo.style.display = "block";
        }
    }

    updateServices = (barberName) => {
        let serviceNames = this.props.repo.getServiceNamesWithCost(barberName);
        let serviceCosts = this.props.repo.getServiceCosts(barberName);

        let select = document.getElementById('select' + this.props.keyProps)
        select.length = 1;

        for (let i = 0; i < serviceCosts.length; i++) {
            let option = document.createElement('option');
            option.innerHTML = serviceNames[i];
            option.value = serviceCosts[i]
            select.appendChild(option);
        }
    }

    getCost = () => {
        return this.state.cost;
    }

    getBarberNames = () => {
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
                                <select className="custom-select" onChange={this.barberChanged} id={"barber" + this.props.keyProps}>
                                    <option>Select a barber</option>
                                </select>
                            </div>
                                <div className="customMargin">
                                    <select type="select" className="custom-select" onChange={this.calculateTotal} id={"select" + this.props.keyProps}>
                                        <option value="0">Select a service</option>
                                        
                                    </select>
                                </div>
                            </div>
                        </div> 
                        <div className="barberAndCut">
                            <div className="customMargin">
                                <select className="custom-select">
                                    <option>Oct 22 2020</option>
                                    <option>Oct 23 2020</option>
                                    <option>Oct 24 2020</option>
                                </select>
                            </div>
                            <div className="customMargin">
                                <select className="custom-select">
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