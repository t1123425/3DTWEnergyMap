import {  useThree } from "@react-three/fiber";
import { useRef,useEffect,useMemo,useState, type FC } from "react"
//import { Html } from "@react-three/drei";
import { Group} from 'three'
import { mainStore } from "../../../store";
import { type SVGResult } from "three/examples/jsm/Addons.js";
import Area from "../area";
import * as THREE from "three";
import taiwanPower from '../../../json/taiwanPower.json';
import type { PowerData } from "../../../utils/types";
import { PowerAreaDropdownSelector } from "../../widgets";
//import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

type MapColorObj = {
    [key:string]:string
}
const colorObj:MapColorObj = {
    North:'blue',
    Central: 'purple',
    East: 'orange',
    South: 'green'
}

type PowerMapProp = {
    svgData:SVGResult
}

const mapCenter = new THREE.Vector3()
const TWPowerMap:FC<PowerMapProp> = ({svgData}) => {
    const [currentAreaData,setCurrentAreaData] = useState(taiwanPower.data[0])
    const taiwanGIS = mainStore(state => state.taiwanGIS);
    // const controlsRef = useRef<OrbitControlsImpl | null>(null);

    const groupRef = useRef<Group| null>(null);
    const EffectRan = useRef(false);
    const {camera } = useThree();
    const box = new THREE.Box3();
    const initalCityDataArray = mainStore(state => state.initalCityDataArray);
    //const [animating, setAnimating] = useState(false)
    const powerData = useMemo(()=>{
        
        return svgData.paths.map((path) => {
            //找出地圖上各gis
            const gis = taiwanGIS.find(e => e.cityId === path.userData?.node.id)
            //設定選出區域顏色
            const areaColor = gis?.area ? colorObj[gis.area] : '';
            //確認已被選取區域
            const isHover = currentAreaData.area === gis?.area;
            let ShowInfoType = ''
            let infolist:string[] = [];
            const cityData = {
                name:gis?.ch_name ?? '',
                cityId:gis?.cityId ?? ''
            }
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
                    infolist,
                    cityData
                }
            
        })
    },[svgData,currentAreaData,taiwanGIS]) 
    
    // useFrame(()=>{
    //     if(EffectRan.current && groupRef.current && controlsRef.current && animating){
    //         const targetCameraPos = new THREE.Vector3(0,200,400)
    //         camera.position.lerp(targetCameraPos,0.05)

    //         controlsRef.current.target.lerp(targetPos,0.05);
    //         controlsRef.current.update()
    //         // 始終朝向目標地區
    //         camera.lookAt(targetPos);
    //         const distance = camera.position.distanceTo(targetCameraPos)
    //         if(distance < 1){
    //             console.log('stop aniamte and show targetPos',targetPos);
    //             setAnimating(false)
    //         }
    //     }
    // })
    useEffect(()=>{
        if(EffectRan.current && groupRef.current){
            groupRef.current.rotateX((Math.PI)- 45);
            groupRef.current.rotateZ(Math.PI/8);
            //groupRef.current.rotateX(-Math.PI);
            box.setFromObject(groupRef.current)
            box.getCenter(mapCenter)
            groupRef.current.position.sub(mapCenter)// 將 group 移動，讓中心在 (0,0,0)
            camera.lookAt(mapCenter);
            console.log('mapcenter',mapCenter);
            camera.position.z = 850;
            initalCityDataArray();
        }
         return ()=>{
            EffectRan.current = true;
        }
       
    },[])
    
    return (
        <>
             {/* <DataSelector setSelectorData={(data:PowerData)=> {setCurrentAreaData({...data})} } />  */}
             {/* <Html as="div"
                fullscreen
                style={{
                    left:0,
                    transform: 'translate(-45%, 40%)'
                }}
                prepend={true}>
                <button className="bg-amber-50 p-5 " onClick={()=>{setAnimating(true)}}>
                    start animate
                </button>
             </Html> */}
             <PowerAreaDropdownSelector
                selectList={taiwanPower.data}
                currentSelect={currentAreaData}  
                setSelectorData={(data:PowerData)=> {setCurrentAreaData({...data})} } />
             <group ref={groupRef}>
                {
                    powerData.map((data,i)=> (
                            <Area key={i} 
                                shape={data.shape}
                                areaColor={data.areaColor}
                                isHover={data.isHover}
                                ShowInfoType={data.ShowInfoType}
                                infoList={data.infolist}
                                cityData={data.cityData}  />
                    ))
                }
            </group>
        </>
       
    )
}
export default TWPowerMap;