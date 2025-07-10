import { useThree } from "@react-three/fiber";
import { useRef,useEffect,useMemo, type FC, useState } from "react"
import { Group} from 'three'
import { type SVGResult } from "three/examples/jsm/Addons.js";
import Area from "../area";
import * as THREE from "three";
import RenewableEnergyStation from  '../../../json/RenewableEnergyStation.json'
import { mainStore } from "../../../store";
// import { RnewEnergyTypeTabs } from "../../widgets";
//import { type EnergyTypesData } from "../../../utils/types";

const mapCenter = new THREE.Vector3()
type RenewMapProps = {
    svgData:SVGResult
}
/**(能源別\/Type of Energy)
 * EnergyType:
 * Wind
 * Solar
 * Geothermal
 * 
 */
// const EnergyTypes:EnergyTypesData[] = [{
//     name:'風力',
//     type:'Wind'
// },{
//     name:'太陽能',
//     type:'Solar'
// },{
//     name:'地熱能',
//     type:'Geothermal'
// }];
const EnergyTypeKey =  "能源別\/Type of Energy";
const addressTypeKey = "地址\/Address";
const nameKey = "發電站名稱\/Name of The Power Station";


const RenewEnegryMap:FC<RenewMapProps> = ({svgData}) => {
    const groupRef = useRef<Group| null>(null);
    const EffectRan = useRef(false);
    const {camera } = useThree();
    const box = new THREE.Box3();
    const taiwanGIS = mainStore(state => state.taiwanGIS);
    const initalCityDataArray = mainStore(state => state.initalCityDataArray);
    const energyType = mainStore(state => state.energyType);
    //const [EnergyType,setEnergyType] = useState(EnergyTypes[0].type)

    const renewEnergyData = useMemo(()=>{
        const selectedEnergyStations = RenewableEnergyStation.filter(e => e[EnergyTypeKey].includes(energyType))
        return svgData.paths.map((path)=>{
            //找出地圖上各gis
            const gis = taiwanGIS.find(e => e.cityId === path.userData?.node.id)
            const selectedEnergyStation = selectedEnergyStations.find(e => gis?.ch_name?e[addressTypeKey].includes(gis?.ch_name):'')

            let ShowInfoType = ''
            let infolist:string[] = [];
            let isShowModel = false;
            const cityData = {
                name:gis?.ch_name ?? '',
                cityId:gis?.cityId ?? ''
            }
            if(path.userData?.node.nodeName === 'path' && selectedEnergyStation){
                ShowInfoType = 'renew'+energyType
                infolist = [selectedEnergyStation[nameKey]];
                isShowModel = selectedEnergyStation?true:false;
            }
            return {
                shape:path,
                ShowInfoType,
                isShowModel,
                infolist,
                cityData
            }
        })
    },[svgData,taiwanGIS,energyType])
 
    useEffect(()=>{
        if(EffectRan.current && groupRef.current){
            groupRef.current.rotateX((Math.PI)- 45);
            groupRef.current.rotateZ(Math.PI/8);
            box.setFromObject(groupRef.current)
            box.getCenter(mapCenter)
            groupRef.current.position.sub(mapCenter)// 將 group 移動，讓中心在 (0,0,0)
            camera.lookAt(mapCenter);
            camera.position.z = 850;
            initalCityDataArray();
        }
         return ()=>{
            EffectRan.current = true;
        }
       
    },[])

    return (
        <>
            {/* <RnewEnergyTypeTabs EnergyType={EnergyType} EnergyTypes={EnergyTypes} setSelectorType={(e)=> {setEnergyType(e)}} /> */}
            <group ref={groupRef} >
                {
                    renewEnergyData.map((data,i)=> (
                        <Area key={i}
                            shape={data.shape}
                            ShowInfoType={data.ShowInfoType}
                            isShowModel={data.isShowModel}
                            infoList={data.infolist}
                            cityData={data.cityData} />
                    ))
                }
            </group> 
        </>
    )
}

export default RenewEnegryMap;
