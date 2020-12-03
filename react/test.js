import React from 'react';
import Repository from '../javascript/repository';
import Api from '../javascript/api';

class Test extends React.Component {
   constructor (props){
    super(props)
    console.log("hello:");
    let button1 = document.getElementById("barberButton");
    button1.onclick = function(){
        console.log("Button 1 was clicked");
        let select = document.getElementById('tableBody');
        select.innerHTML = "";
    }
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
           
            
            row.appendChild(id);
            row.appendChild(tName);
            row.appendChild(status);
            select.appendChild(row);
        }

    }
    render() {
        return (
            <div className="content">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="card">
                        <div className="card-header card-header-primary">
                          <h4 className="card-title ">Shaves and Fades Barbers</h4>
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
        )
    }
}

export default Test;