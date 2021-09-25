import React from "../src";

// const element = react.createElement('div', { id: 'preact'}, 'preact')
// const element = <div>text</div>

class Children extends React.Component {
    render() {
        return (
            <div>
                <p>
                    最后的组件
                </p>
                <p>{this.props.name}</p>
            </div>
        )
    }
}


class App extends React.Component {
    state = {
        value: 'prop-children',
        arr: [
            'list1'
        ]
    }
    ref1 = React.createRef()
    ref2 = React.createRef()

    // 一些基本的生命周期
    // unsafe
    // componentWillMount() {
    //     console.log('App: will mount');
    // }

    componentDidMount() {
        const node1 = this.ref1
        const node2 = this.ref2
        console.log('App: did mount', node1, node2);

    }

    // unsafe
    // componentWillUpdate() {
    //     console.log('App: will update');
    // }

    componentDidUpdate() {
        console.log('App: did update');
    }

    componentWillUnmount() {
        console.log('App: will unmount');
    }
    // 一定要写箭头函数
    changeValue = () => {
        this.setState({ arr: this.state.arr.slice().reverse() })
    }
    addValue = () => {
        this.setState({ arr: [...this.state.arr, 'list2'] })
    }
    changeValue = () => {
        this.setState({ ...this.state, value: "change-prop" })
    }


    render() {
        return (
            <div ref={this.ref1}>
                {/* <button onClick={this.changeValue}>更改数组</button> */}
                <button onClick={this.addValue}>增加一个数值</button>
                <button onClick={this.changeValue}>更改子组件prop</button>
                {
                    this.state.arr.map(item => {
                        return <li key={item}>{item}</li>
                    })
                }
                <Children ref={this.ref2} name={this.state.value} />
            </div>
        )
    }
}

const root = document.querySelector('#root')
React.render(<App />, root)


