import React from "react";

//归递组件写法
class MyComponent extends React.Component {
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
                        <MyComponent children={v.children}/>
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

export default MyComponent;