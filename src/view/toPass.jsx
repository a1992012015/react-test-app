import React from "react";

let arr = [{
    name: '一号',
    children: [{
        name: '一号下的一号',
        children: [],
    }, {
        name: '一号下的二号',
        children: [],
    }]
}, {
    name: '二号',
    children: [{
        name: '二号下的一号',
        children: [],
    }, {
        name: '二号下的二号',
        children: [],
    }]
}];

//归递组件写法
class Subject extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            arr: this.props.children
        }
    }

    changeName(index) {
        this.state.arr[index].name = this.state.arr[index].name + "san";
        this.setState({
            arr: this.state.arr
        });
    }

    render() {
        const children = this.state.arr;
        let list = null;
        if (children) {
            list = children.map((v, i) => {
                return (
                    <li key={i}>
                        {v.name}&nbsp;&nbsp;&nbsp;
                        <button onClick={() => this.changeName(i)}>按钮</button>
                        <Subject children={v.children}/>
                    </li>
                );
            });
        }

        return (
            <ul>
                {list}
            </ul>
        );
    }
}

class MyComponent extends React.Component {
    render() {
        return (
            <Subject children={arr}/>
        );
    }
}


export default MyComponent;