import React from "react"
import ReactDOM from 'react-dom'
import BMap from 'BMap'
import TextIcon from './lib/TextIcon'

const Overlay = props => {
    let {map} = props
    let point = new BMap.Point(116.407845,39.914101)
    let icon1 = new TextIcon(point,'A')
    map.addOverlay(icon1)
    let point2 = new BMap.Point(115.407845,38.914101)
    map.addOverlay(new TextIcon(point2,'B'))
    window.setTimeout(()=>{
        icon1.setText(4)
    },3000)
    return null
}
export default Overlay