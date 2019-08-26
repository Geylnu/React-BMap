import React, {useState} from 'react';
import ClustererManage from '../ClustererManage'
import Overlay from '../ClustererManage/overlay'
import OverlayTest from '../ClustererManage/OverlayTest'

import { Map, Marker, NavigationControl, InfoWindow } from 'react-bmap'
import BMap from 'BMap'


const genData = (max)=>{
    let dataList = []
    for (let i=0;i<max;i++){
        let randomPot = {
            lng:Math.random() * 40 + 85,
            lat:Math.random() * 30 + 21
        }
        dataList.push(randomPot)
    }
    return dataList
}

const $Map = props => {
    return (<Map style={{}} center={{ lng: 116.402544, lat: 39.928216 }} zoom="5" enableScrollWheelZoom={true}>
    <NavigationControl />
    <ClustererManage data={genData(50000)}/>
    {/* <OverlayTest></OverlayTest> */}
    {/* <Marker position={{lng: 116.407845, lat: 39.914101}} /> */}
</Map>)
}


export default $Map