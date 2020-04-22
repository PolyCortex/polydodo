import React from "react";
import PropTypes from "prop-types";

class D3Component extends React.Component {
  static propTypes = {
    callback: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const { callback } = this.props;
    callback(this.svg);
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (<svg ref={ref => this.svg = ref } />);
  }
}

export default D3Component;