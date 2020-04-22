import React from "react";

import createHypnogram from "./d3/hypnogram";

class Hypnogram extends React.Component {
    componentDidMount() {
        createHypnogram(this.svg);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (<svg ref={ref => this.svg = ref } />);
    } 
}

export default Hypnogram;