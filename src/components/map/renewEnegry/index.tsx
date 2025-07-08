import { useThree } from "@react-three/fiber";
import { useRef,useEffect,useMemo, type FC, useState } from "react"
import { Group} from 'three'
// import { mainStore } from "../../../store";
import { type SVGResult } from "three/examples/jsm/Addons.js";
import Area from "../area";
import * as THREE from "three";
import RenewableEnergyStation from  '../../../json/RenewableEnergyStation.json'
import { mainStore } from "../../../store";
import { RnewEnegryTypeTabs } from "../../widgets";
import { type EnegryTypesData } from "../../../utils/types";

const mapCenter = new THREE.Vector3()
type RenewMapProps = {
    svgData:SVGResult
}
/**(能源別\/Type of Energy)
 * EnegryType:
 * Wind
 * Solar
 * Geothermal
 * 
 */
const EnegryTypes:EnegryTypesData[] = [{
    name:'風力',
    type:'Wind'
},{
    name:'太陽能',
    type:'Solar'
},{
    name:'地熱能',
    type:'Geothermal'
}];
const EnegryTypeKey =  "能源別\/Type of Energy";
const addressTypeKey = "地址\/Address";
const nameKey = "發電站名稱\/Name of The Power Station";


const RenewEnegryMap:FC<RenewMapProps> = ({svgData}) => {
    const groupRef = useRef<Group| null>(null);
    const EffectRan = useRef(false);
    const {camera } = useThree();
    const box = new THREE.Box3();
    const taiwanGIS = mainStore(state => state.taiwanGIS);
    const [enegryType,setEnegryType] = useState(EnegryTypes[0].type)

    const renewEnergyData = useMemo(()=>{
        const selectedEnegryStations = RenewableEnergyStation.filter(e => e[EnegryTypeKey].includes(enegryType))
        return svgData.paths.map((path)=>{
            //找出地圖上各gis
            const gis = taiwanGIS.find(e => e.cityId === path.userData?.node.id)
            const selectedEnegryStation = selectedEnegryStations.find(e => gis?.ch_name?e[addressTypeKey].includes(gis?.ch_name):'')

            let ShowInfoType = ''
            let infolist:string[] = [];
            let isShowModel = false;
            if(path.userData?.node.nodeName === 'path' && selectedEnegryStation){
                ShowInfoType = 'renew'+enegryType
                infolist = [selectedEnegryStation[nameKey]];
                isShowModel = selectedEnegryStation?true:false;
            }
            return {
                shape:path,
                ShowInfoType,
                isShowModel,
                infolist
            }
        })
    },[svgData,taiwanGIS,enegryType])
    // const getPowerGen = useCallback(()=>{
    //     fetch('../json/gis_with_area_and_ch_name.json').then(res => res.json()).then(data => {
    //         console.log('data',data);
    //     })
    // },[]);
 
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
        <>
            <RnewEnegryTypeTabs enegryType={enegryType} EnegryTypes={EnegryTypes} setSelectorType={(e)=> {setEnegryType(e)}} />
            <group ref={groupRef} >
                {
                    renewEnergyData.map((data,i)=> (
                        <Area key={i}
                            shape={data.shape}
                            ShowInfoType={data.ShowInfoType}
                            isShowModel={data.isShowModel}
                            infoList={data.infolist} />
                    ))
                }
            </group> 
        </>
    )
}

export default RenewEnegryMap;
