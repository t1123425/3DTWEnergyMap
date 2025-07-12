import { useLoader,useFrame, useThree } from "@react-three/fiber";
import { useRef,useEffect } from "react"
import {DirectionalLight} from 'three'
import { SVGLoader } from "three/examples/jsm/Addons.js";
import TaiwanMapSVG from '../../assets/tw.svg';
import { OrbitControls } from '@react-three/drei';
import { mainStore } from "../../store";
import TWPowerMap from "./twpower";
import RenewEnegryMap from "./renewEnegry";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
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

const Map = () => {
    const svgData = useLoader(SVGLoader,TaiwanMapSVG)
    const mapMode = mainStore((state)=> state.mapMode);
    //const reNewEnegryStations = mainStore(state => state.mapCityDataArray);
    const currentSelectCity = mainStore(state => state.currentSelectCity)
    const setCurrentSelectCity = mainStore(state => state.setCurrentSelectCity);
    const controlsRef = useRef<OrbitControlsImpl | null>(null);
    //const [animating, setAnimating] = useState(false)
    const {camera } = useThree();
    // const targetPos = useMemo(()=>{
    //     console.log('reNewEnegryStations',reNewEnegryStations)
    //     if(reNewEnegryStations.length){
    //         const posX = reNewEnegryStations[2].pos.x;
    //         const posY = reNewEnegryStations[2].pos.y;
    //         return new THREE.Vector3(posX ,posY,400)
    //     }else{
    //         return new THREE.Vector3();
    //     }

        
    // },[currentSelectCity])
    useFrame(()=>{
        if(currentSelectCity && controlsRef.current){
            const targetCameraPos = currentSelectCity.pos.clone().add(new THREE.Vector3(0,0,300));
            camera.position.lerp(targetCameraPos,0.05)

            controlsRef.current.target.lerp(targetCameraPos,0.05);
            controlsRef.current.update()
            // 始終朝向目標地區
            camera.lookAt(currentSelectCity.pos);
            const distance = camera.position.distanceTo(targetCameraPos)
            if(distance < 1){
                //setAnimating(false)
                setCurrentSelectCity(null);
            }
        }
    })
    return (
          <>
            <OrbitControls ref={controlsRef} enableZoom={false} />
            {
                mapMode === 'twp' && <TWPowerMap svgData={svgData} />
            }
            {
                mapMode === 'rnest' && (
                    <RenewEnegryMap svgData={svgData} />
                )
            }
            <ambientLight color={0xffffff} intensity={0.8} /> 
            <DirectLight />
         </>
    )
   
}

export default Map