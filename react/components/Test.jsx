const React = require('react');
import Repository from '../../javascript/repository';
import ScheduledRepository from '../../javascript/scheduled-repository';
import Api from '../../javascript/api';


class Test extends React.Component {
  

   constructor (props){
    super(props)
    console.log("hello:");
    this.barberL = this.barberLoad.bind(this);
    this.appointmentL = this.appointmentLoad.bind(this);
 
}
  
    componentDidMount = async () => {
        let theRepo = await this.getRepo();
        this.getBarberTable(theRepo.getBarberNames());
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

    getScApp = async () => {
      let api = new Api();

      let response = await api.get('scheduledappointments');

      if (response[0] != 200) {
          alert("An error has occured. Please try again.");
          return null;
      }

      return new ScheduledRepository(response[1]);
  }


    getBarberTable(names) {
        

        let select = document.getElementById('tableBody')
        let selecthead = document.getElementById('tableHead');
          
        let row = document.createElement('tr');
        let c1 = document.createElement('th');
        let c2 = document.createElement('th');
        let c3 = document.createElement('th');

        c1.innerHTML = "ID";
        c2.innerHTML = "Name";
        c3.innerHTML = "Status";

        
        console.log("test");
        row.appendChild(c1);
        row.appendChild(c2);
        row.appendChild(c3);
 
        selecthead.appendChild(row);

        for (let i = 0; i < names.length; i++){
            
            let row = document.createElement('tr');
            let id = document.createElement('td');
            let tName = document.createElement('td');
            id.innerHTML = i+1;
            tName.innerHTML = names[i];
            let status = document.createElement('td');
            status.innerHTML = "Active";
           
            console.log(tName);
            row.appendChild(id);
            row.appendChild(tName);
            row.appendChild(status);
            select.appendChild(row);
        }

    }

    getAppointmentTable(schedule) {
      console.log("test");
      console.log(schedule);
      let select = document.getElementById('tableBody');
      let selecthead = document.getElementById('tableHead');
          
        let row = document.createElement('tr');
        let c1 = document.createElement('th');
        let c2 = document.createElement('th');
        let c3 = document.createElement('th');
        let c4 = document.createElement('th');
        let c5 = document.createElement('th');
        
        c1.innerHTML = "Barber";
        c2.innerHTML = "Date";
        c3.innerHTML = "Time";
        c4.innerHTML = "Service";
        c5.innerHTML = "Cost";
       
        console.log("test");
        row.appendChild(c1);
        row.appendChild(c2);
        row.appendChild(c3);
        row.appendChild(c4);
        row.appendChild(c5);
        selecthead.appendChild(row);

      for (let i = 0; i < schedule.length; i++){
          
          let row = document.createElement('tr');
          let barber = document.createElement('td');
          let date = document.createElement('td');
          let time = document.createElement('td');
          let service = document.createElement('td');
          let cost = document.createElement('td');
          
          
          barber.innerHTML = schedule[i].barber;
          date.innerHTML = schedule[i].date;
          time.innerHTML = schedule[i].time;
          service.innerHTML = schedule[i].service;
          cost.innerHTML = schedule[i].cost;
          
          console.log("test");
          row.appendChild(barber);
          row.appendChild(date);
          row.appendChild(time);
          row.appendChild(service);
          row.appendChild(cost);
          
          select.appendChild(row);
      }

  }

  getTime() {
    console.log("test");
    let select = document.getElementById('time');
        
      let dropdownlabel = document.createElement("label");
      dropdownlabel.innerHTML= "Select Barber:";

      let submit = document.createElement("button");
      submit.innerHTML = "Submit";

      let dropdown = document.createElement("select");
      dropdown.appendChild(new Option("Jeffrey Ortega", "Jeffrey Ortega"));
      dropdown.appendChild(new Option("Mixio Gaytan", "Mixio Gaytan"));
      dropdown.appendChild(new Option("David Nakasen", "David Nakasen"));
      
      let dropdownlabeldate = document.createElement("label");
      dropdownlabeldate.innerHTML= "Select Date:";

      let dropdowndate = document.createElement("select");
      dropdowndate.appendChild(new Option("5 Dec 2020", "5 Dec 2020"));
      dropdowndate.appendChild(new Option("6 Dec 2020", "6 Dec 2020"));
      dropdowndate.appendChild(new Option("7 Dec 2020", "7 Dec 2020"));

      let dropdownlabelstarttime = document.createElement("label");
      dropdownlabelstarttime.innerHTML= "Start Time:";

      let dropdownstarttime = document.createElement("select");
      dropdownstarttime.appendChild(new Option("07:00 AM", "07:00 AM"));
      dropdownstarttime.appendChild(new Option("07:30 AM", "07:30 AM"));
      dropdownstarttime.appendChild(new Option("08:00 AM", "08:00 AM"));

      let dropdownlabelendtime = document.createElement("label");
      dropdownlabelendtime.innerHTML= "End Time:";

      let dropdownendtime = document.createElement("select");
      dropdownendtime.appendChild(new Option("05:00 PM", "05:00 PM"));
      dropdownendtime.appendChild(new Option("05:30 PM", "05:30 PM"));
      dropdownendtime.appendChild(new Option("06:00 PM", "06:00 PM"));

      
      select.appendChild(dropdownlabel);
      select.appendChild(document.createElement("br"));
      select.appendChild(dropdown);

      select.appendChild(document.createElement("br"));

      select.appendChild(dropdownlabeldate);
      select.appendChild(document.createElement("br"));
      select.appendChild(dropdowndate);

      select.appendChild(document.createElement("br"));

      select.appendChild(dropdownlabelstarttime);
      select.appendChild(document.createElement("br"));
      select.appendChild(dropdownstarttime);

      select.appendChild(document.createElement("br"));

      select.appendChild(dropdownlabelendtime);
      select.appendChild(document.createElement("br"));
      select.appendChild(dropdownendtime);

      select.appendChild(document.createElement("br"));
      select.appendChild(document.createElement("br"));

      select.appendChild(submit);

    }

    barberLoad = async () => {
      let selecttime = document.getElementById('time');
        selecttime.innerHTML = "";
        let select = document.getElementById('tableBody');
        select.innerHTML = "";
        let theRepo = await this.getRepo();
        let selectHead = document.getElementById('tableHead');
        selectHead.innerHTML = "";
        this.getBarberTable(theRepo.getBarberNames());
    }

    appointmentLoad = async () => {
      let selecttime = document.getElementById('time');
        selecttime.innerHTML = "";
      let select = document.getElementById('tableBody');
        select.innerHTML = "";
        let selectHead = document.getElementById('tableHead');
        selectHead.innerHTML = "";
        let theRepo = await this.getRepo();
        this.getAppointmentTable(theRepo.getScheduledSlots('Mixio Gaytan'));
  }

    timeLoad = async () => {
      let selecttime = document.getElementById('time');
        selecttime.innerHTML = "";
      let select = document.getElementById('tableBody');
        select.innerHTML = "";
        let selectHead = document.getElementById('tableHead');
        selectHead.innerHTML = "";
      let theRepo = await this.getRepo();
      this.getTime();
}
    

    

    render() {
      return (

        <div className="wrapper ">
          <div className="sidebar" data-color="purple" data-background-color="white">
            {/*
        Tip 1: You can change the color of the sidebar using: data-color="purple | azure | green | orange | danger"
  
        Tip 2: you can also add an image using data-image tag
    */}
            <div className="logo">
              <a href="http://www.shavesandfades.com" className="simple-text logo-mini">
                SHAVES AND FADES
              </a>
              <a href="http://www.shavesandfades.com" className="simple-text logo-normal">
                ADMIN PAGE
              </a>
              <form action="/logout?_method=DELETE" method="POST" className="simple-text logo-normal">
                <button className="no-outline" type="submit" style={{background: 'none', border: 'none', margin: 0, padding: 0, cursor: 'pointer'}}>LOG OUT</button>
              </form>
            </div>
            <div className="sidebar-wrapper">
              <ul className="nav">
                <li className="nav-item active  ">
                  <br />
                  <a className="nav-link" id="barberButton" onClick={() => this.barberLoad()}>
                    <i className="material-icons">dashboard</i>
                    <p>Barbers</p>
                  </a>
                  <br />
                  <a className="nav-link" id="appointmentButton" onClick={() => this.appointmentLoad()}>
                    <i className="material-icons">dashboard</i>
                    <p>Appointments</p>
                  </a>
                  <br />
                  <a className="nav-link" id="timeButton" onClick={() => this.timeLoad()}>
                    <i className="material-icons">dashboard</i>
                    <p>Time</p>
                  </a>
                </li>
                {/* your sidebar here */}
              </ul>
            </div>
          </div>
          <div className="main-panel">
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-transparent navbar-absolute fixed-top ">
              <div className="container-fluid">
                <div className="navbar-wrapper">
                  <a className="navbar-brand" href="javascript:;">Dashboard</a>
                </div>
                <button className="navbar-toggler" type="button" data-toggle="collapse" aria-controls="navigation-index" aria-expanded="false" aria-label="Toggle navigation">
                  <span className="sr-only">Toggle navigation</span>
                  <span className="navbar-toggler-icon icon-bar" />
                  <span className="navbar-toggler-icon icon-bar" />
                  <span className="navbar-toggler-icon icon-bar" />
                </button>
                <div className="collapse navbar-collapse justify-content-end">
                  <ul className="navbar-nav">
                    <li className="nav-item">
                      <a className="nav-link" href="javascript:;">
                        <i className="material-icons">notifications</i> Notifications
                      </a>
                    </li>
                    {/* your navbar here */}
                  </ul>
                </div>
              </div>
            </nav>
            {/* End Navbar */}
            <div className="main-panel">
          {/* Navbar */}
            <div className="content">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="card">
                        <div className="card-header card-header-primary">
                          <h4 className="card-title ">Shaves and Fades</h4>
                          <p className="card-category"> </p>
                        </div>
                        <div className="card-body" id="card-body">
                          <div id = "time"></div>
                          <div className="table-responsive" >
                            <table className="table">
                              <thead className=" text-primary" id="tableHead">
                                
                                </thead>
                              <tbody id = "tableBody">
                                
                              </tbody>
                              </table>
                        </div>
                      </div>
                    </div>
                  </div>
                  <footer className="footer">
                    <div className="container-fluid">
                      <nav className="float-left">
                        <ul>
                          <li>
                          </li>
                        </ul>
                      </nav>
                      <div className="copyright float-right">
                        ©
                        , Shaves and Fades
                      </div>
                      {/* your footer here */}
                    </div>
                  </footer>
                </div>
              </div>
            </div></div></div></div>
      );
    }
  }

export default Test;