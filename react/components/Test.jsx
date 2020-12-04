const React = require('react');
import Repository from '../../javascript/repository';
import Api from '../../javascript/api';

class Test extends React.Component {
  

   constructor (props){
    super(props)
    console.log("hello:");
 
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

    render() {
        return (
          <div>
        <div className="sidebar-wrapper">
          <ul className="nav">
            <li className="nav-item active  ">
              <br />
              <a className="nav-link" id="barberButton">
                <i className="material-icons">dashboard</i>
                <p>Barbers</p>
              </a>
              <br />
              <a className="nav-link" id="appointmentButton">
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
                      </div>
                      </div>
                      </div>
                      </div>
                      </div>
        );
    }
}

export default Test;