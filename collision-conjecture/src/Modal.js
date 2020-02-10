import React, {Component} from "react";


export default class Modal extends Component {
    render() {
        if(!this.props.show){
            return null;
        }
      return <div className="Modal" onClick={this.props.hideModal}>Hello Modal</div>;
    }
  }



