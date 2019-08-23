import BMap from 'BMap'
import BMapLib from 'BMapLib'


const getMarkers =(data)=>{
    let markList = []
    data.forEach(pot => {
        let {lng,lat} = pot
        let marker = new BMap.Marker(new BMap.Point(lng,lat))
        markList.push(marker)
    });
    markList[0].getPosition()
    return markList
}

const ClustererManage = props =>{
    let {map,data,cluster} = props
    
    let {MarkerClusterer: MarkerClusterer2} = BMapLib
    let markers = getMarkers(data)
    let clustererManage = new MarkerClusterer2(map,{markers})
    return null
}

export default ClustererManage