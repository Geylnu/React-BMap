import React, { useState } from 'react'
import ReactDom from 'react-dom'
const container = document.createElement('div')

const getScript = () => {
    return new Promise((res, rej) => {
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = '//api.map.baidu.com/api?v=3.0&ak=7KCcP9pLTnPPGH0GmvBItY6wZWn33mhL&callback=initialize'
        script.onload = (e)=>{
            document.close();
            res(e)
        }
        script.onerror = (e)=>{
            rej(e)
        }
        document.body.appendChild(script)
    })
}

const Test = props => {
    getScript().then(()=>{
        console.log(window.Bmap)
    })
    const demo = (<div>Test.js</div>)
    ReactDom.render(demo, container)
    window.setTimeout(() => {
        let dom = document.getElementById('test')
        dom.appendChild(container)
    }, 4000)
    return null
}


export default Test