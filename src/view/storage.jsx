import React from "react";

//储存
class Storage extends React.Component {
    constructor(props) {
        super(props);
        console.log(this.props.storage);
        this.state = {
            storage : this.props.storage
        }
    }

    changeName(index){
        this.state.storage[index] = this.state.storage[index] + "添加";
        this.setState({
            storage: this.state.storage
        });
    }

    render(){
        const children = this.state.storage;
        let list = null;
        console.log(this.state);
        console.log(this.props);
        if (children){
            list = children.map((v, i) => {
                return (
                    <li key={i}>
                        <button onClick={() => this.changeName(i)}>{v}</button>
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

export default Storage;