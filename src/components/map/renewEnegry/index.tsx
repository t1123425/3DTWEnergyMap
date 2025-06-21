import { useThree } from "@react-three/fiber";
import { useRef,useEffect,useMemo, type FC } from "react"
import { Group} from 'three'
// import { mainStore } from "../../../store";
import { type SVGResult } from "three/examples/jsm/Addons.js";
import Area from "../area";
import * as THREE from "three";

const mapCenter = new THREE.Vector3()
type RenewMapProps = {
    svgData:SVGResult
}
const RenewEnegryMap:FC<RenewMapProps> = ({svgData}) => {
    const groupRef = useRef<Group| null>(null);
    const EffectRan = useRef(false);
    const {camera } = useThree();
    const box = new THREE.Box3();
    
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
                renewEnergyData.map((data,i)=> (
                    <Area key={i}
                        shape={data.shape} />
                ))
            }
        </group>
    )
}

export default RenewEnegryMap;
