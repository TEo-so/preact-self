import React from "../src";
import { render } from "../src/render";
import { useState, useEffect, useLayoutEffect } from '../src/hooks'


// 函数组件继承Component,render = doRender


function App() {
    const [value, setValue] = useState('state')
    useEffect(() => {
        console.log('执行effect')
    }, [value])
    useLayoutEffect(() => {
        console.log('执行useLayoutEffect')
    }, [value])
    const changeValue = () => {
        setValue('change')
    }
    return (
        <div>
            <p>simple react: hooks</p>
            <button onClick={changeValue}>更改state的值</button>
            <p>{value}</p>
        </div>
    )
}

const root = document.querySelector('#root')
React.render(<App />, root)