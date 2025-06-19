import { useLoader,useThree } from "@react-three/fiber";
import { useRef,useEffect,useMemo,useState, type FC } from "react"
import {DirectionalLight,Group} from 'three'
import { SVGLoader } from "three/examples/jsm/Addons.js";
import TaiwanMapSVG from '../../assets/tw.svg';
import * as THREE from "three";
import { Html, OrbitControls } from '@react-three/drei';
import { taiwanGis } from "../../utils/GIS";
import taiwanPower from '../../json/taiwanPower.json';
import Area from "./area";
import { mainStore } from "../../store";
const DirectLight = () => {
    const lightRef = useRef<DirectionalLight | null>(null);
    // const [isReady, setIsReady] = useState(false);
    // const {x} = useControls({x:{value:1, min:-20,max:20}});
    //寫法參考：https://github.com/pmndrs/react-three-fiber/discussions/2791
    useEffect(()=>{
        if(lightRef.current){
            const d = 10;
            lightRef.current.position.set(20,20,20);
            lightRef.current.castShadow = true;
            lightRef.current.shadow.camera.left = -d;
            lightRef.current.shadow.camera.right = d;
            lightRef.current.shadow.camera.top = d;
            lightRef.current.shadow.camera.bottom = -d;

            //更新target 位置
            lightRef.current.target.position.set(0,0,0);
            lightRef.current.target.updateMatrixWorld();
            
        }
    },[])
    return <directionalLight ref={lightRef} color={0xffffff} intensity={4} />
}
// GIS來源資料如下
/**
 * 發電(萬瓩)
 * 用電(萬瓩)
 */
// type areaData = {
//     cityId:string,
//     name:string,
//     area: string,
//     ch_name: string,
//     powergen?:number,
//     powerConsumption?:number
// }
// 
const mapCenter = new THREE.Vector3()
/**
 * 北-藍色
 * 中-紫色
 * 東-橘色
 * 南-綠色
 */
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

type MapProp = {
    currentArea: PowerData
}
const TaiwanMap:FC<MapProp> = ({currentArea}) => {
    const groupRef = useRef<Group| null>(null);
    const EffectRan = useRef(false);
    const {camera } = useThree();
    const box = new THREE.Box3();
    const svgData = useLoader(SVGLoader,TaiwanMapSVG)
    const mapMode = mainStore((state)=> state.mapMode);
    const powerData = useMemo(()=>{
        
        return svgData.paths.map((path) => {
            //找出地圖上各gis
            const gis = taiwanGis.find(e => e.cityId === path.userData?.node.id)
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
    },[svgData,currentArea])
    
    const renewEnergyData = useMemo(()=>{
        return svgData.paths.map((path)=>{
            return {
                shape:path
            }
        })
    },[svgData])
    // const getPowerGen = useCallback(()=>{
    //     fetch('../json/gis_with_area_and_ch_name.json').then(res => res.json()).then(data => {
    //         console.log('data',data);
    //     })
    // },[]);
 
    useEffect(()=>{
        if(EffectRan.current && groupRef.current){
            groupRef.current.rotateX((Math.PI)- 45);
            //groupRef.current.rotateY(Math.PI/4);
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
        <group ref={groupRef} >
            {
               mapMode === 'twp' &&(
                 powerData.map((data,i)=> (
                        <Area key={i} 
                            shape={data.shape}
                            areaColor={data.areaColor}
                            isHover={data.isHover}
                            ShowInfoType={data.ShowInfoType}
                            infoList={data.infolist}  />
                 ))
               )
            }
            {
                mapMode === 'rnest' && (
                    renewEnergyData.map((data,i)=> (
                        <Area key={i}
                         shape={data.shape} />
                    ))
                )
            }
        </group>
    )
}
type SelectorProp = {
    setSelectorData: (area:PowerData) => void
}
const DataSelector:FC<SelectorProp> = ({setSelectorData}) => {

    return (
        <Html
        as='div'
        fullscreen
        style={{
            left:0,
            transform: 'translate(-45%, 50%)'
        }}
        prepend>
            <select className="selector bg-amber-50" onChange={(e)=>{
                const selectedData = taiwanPower.data.find(item => item.area === e.target.value)
                if(selectedData){
                    setSelectorData(selectedData)
                }
                
            }}>
                {
                    taiwanPower.data.map((e,i)=> {
                        return <option key={i} value={e.area}>
                            {e.area}
                        </option>
                    })
                }
            </select>
        </Html>
    )
}

const Map = () => {
    const [currentAreaData,setCurrentAreaData] = useState(taiwanPower.data[0])
    return (
          <>
            <OrbitControls />
            <DataSelector setSelectorData={(data:PowerData)=> {setCurrentAreaData({...data})} } />
            <TaiwanMap currentArea={currentAreaData} />
            <ambientLight color={0xffffff} intensity={0.8} /> 
            <DirectLight />
         </>
    )
   
}

export default Map