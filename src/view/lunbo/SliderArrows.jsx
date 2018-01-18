import React, { Component } from 'react';

export default class SliderArrows extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let { goSon,flag } = this.props;
        let style = flag?{right: '30px'}:{left: '30px'};
        return (
            <span
                style={style}
                className="control"
                onClick={goSon}
            />
        );
    }
}