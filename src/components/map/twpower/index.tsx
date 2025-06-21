import { useThree } from "@react-three/fiber";
import { useRef,useEffect,useMemo, type FC } from "react"
import { Group} from 'three'
import { mainStore } from "../../../store";
import { type SVGResult } from "three/examples/jsm/Addons.js";
import Area from "../area";
import * as THREE from "three";
import taiwanPower from '../../../json/taiwanPower.json';

type MapColorObj = {
    [key:string]:string
}
const colorObj:MapColorObj = {
    North:'blue',
    Central: 'purple',
    East: 'orange',
    South: 'green'
}

type PowerData = {
    date:string,
    area:string,
    powerGen: string,
    powerConsumption: string
}

type PowerMapProp = {
    currentArea: PowerData,
    svgData:SVGResult
}
const mapCenter = new THREE.Vector3()
const TWPowerMap:FC<PowerMapProp> = ({currentArea,svgData}) => {
    const taiwanGIS = mainStore(state => state.taiwanGIS);
    const groupRef = useRef<Group| null>(null);
    const EffectRan = useRef(false);
    const {camera } = useThree();
    const box = new THREE.Box3();
    const powerData = useMemo(()=>{
        
        return svgData.paths.map((path) => {
            //找出地圖上各gis
            const gis = taiwanGIS.find(e => e.cityId === path.userData?.node.id)
            //設定選出區域顏色
            const areaColor = gis?.area ? colorObj[gis.area] : '';
            //確認已被選取區域
            const isHover = currentArea.area === gis?.area;
            let ShowInfoType = ''
            let infolist:string[] = [];
            // 用電量預設選擇
            if((gis?.cityId === 'TWTPE' || 
               gis?.cityId === 'TWTXG' || 
               gis?.cityId === 'TWKHH' || 
               gis?.cityId === 'TWHUA' ) && path.userData?.node.nodeName === 'path'){
                const getTaiwanPowerData = taiwanPower.data.find(e => gis?.area === e.area)
                ShowInfoType = 'power'
                infolist = ['發電量:'+getTaiwanPowerData?.powerGen,'用電量:'+getTaiwanPowerData?.powerConsumption]
            }
             return {
                    shape:path,
                    areaColor,
                    isHover,
                    ShowInfoType,
                    infolist
                }
            
        })
    },[svgData,currentArea,taiwanGIS])

    useEffect(()=>{
        if(EffectRan.current && groupRef.current){
            groupRef.current.rotateX((Math.PI)- 45);
            groupRef.current.rotateZ(Math.PI/8);
            box.setFromObject(groupRef.current)
            box.getCenter(mapCenter)
            groupRef.current.position.sub(mapCenter)// 將 group 移動，讓中心在 (0,0,0)
            camera.lookAt(mapCenter);
            camera.position.z = 850;
            
        }
         return ()=>{
            EffectRan.current = true;
        }
       
    },[])
    return (
        <group ref={groupRef}>
            {
                powerData.map((data,i)=> (
                        <Area key={i} 
                            shape={data.shape}
                            areaColor={data.areaColor}
                            isHover={data.isHover}
                            ShowInfoType={data.ShowInfoType}
                            infoList={data.infolist}  />
                 ))
            }
        </group>
    )
}
export default TWPowerMap;