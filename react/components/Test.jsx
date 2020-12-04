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

      let response = await api.get('barbers');

      if (response[0] != 200) {
          alert("An error has occured. Please try again.");
          return null;
      }

      return new ScheduledRepository(response[1]);
  }

    getBarberTable(names) {
        

        let select = document.getElementById('tableBody')
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
        

      let select = document.getElementById('tableBody')
      for (let i = 0; i < schedule.length; i++){
          
          let row = document.createElement('tr');
          let barber = document.createElement('td');
          let date = document.createElement('td');
          
          barber.innerHTML = schedule[i].barber;
          date.innerHTML = schedule[i].date;
         
          row.appendChild(barber);
          row.appendChild(date);
          select.appendChild(row);
      }

  }

    barberLoad = async () => {
        let select = document.getElementById('tableBody');
        select.innerHTML = "";
        let theRepo = await this.getRepo();
        this.getBarberTable(theRepo.getBarberNames());
    }

    appointmentLoad = async () => {
      let select = document.getElementById('tableBody');
      select.innerHTML = "";
      let theScRepo = await this.getScApp();
      this.getAppointmentTable(theScRepo.getAppointments());
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
                  <a className="nav-link" id="timeButton">
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
                        <div className="card-body">
                          <div className="table-responsive">
                            <table className="table">
                              <thead className=" text-primary">
                                <tr><th>
                                    ID
                                  </th>
                                  <th>
                                    Name
                                  </th>
                                  <th>
                                    Status
                                  </th>
                                  <th>
                                  </th>
                                </tr>
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