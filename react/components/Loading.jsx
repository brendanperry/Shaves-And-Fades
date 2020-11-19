const React = require('react');

export default class Loading extends React.Component {
  render() {
      return (
        <div style={{"display": "flex", "justifyContent": "center", "alignItems": "center"}}>
            <img src="../images/Spin-1s-200px.svg"></img>
        </div>
      )
  }
}