const React = require('react');


export default class Popup extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
      return (
        <div>
          {/* Modal */}
          <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                  </button>
                  <h5 className="modal-title" id="exampleModalLabel">Summary</h5>
                  <p>This appointment requires a cancellation fee of $15.</p>
                </div>
                <div className="modal-body" id="modal-text">
                  ...
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                  <button type="button" className="btn btn-primary" id="addPayment" onClick={() => this.props.payButton()}>Add Payment Card</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };