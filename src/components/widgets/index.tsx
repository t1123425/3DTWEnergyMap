import { useState, type FC } from "react";
import type { PowerData,EnergyTypesData } from "../../utils/types";
import { Html } from "@react-three/drei";
import { mainStore } from "../../store";
//import * as THREE from "three";
type SelectorProp = {
    selectList:PowerData[],
    currentSelect:PowerData,
    setSelectorData: (value: PowerData) => void
}
export const PowerAreaDropdownSelector:FC<SelectorProp> = ({selectList,currentSelect,setSelectorData}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
     <Html
        as='div'
        fullscreen
        style={{
            left:0,
            transform: 'translate(-45%, 20%)'
        }}
        prepend>
            <div className="relative inline-block w-48">
              <button
                className="w-full bg-white border border-gray-300 rounded px-4 py-2 text-left shadow focus:outline-none"
                onClick={() => setIsOpen((prev) => !prev)}
              >
                {currentSelect.areaName}
                <span className="float-right">&#9662;</span>
              </button>
              {isOpen && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 shadow">
                  {selectList.map((option) => (
                    <li
                      key={option.area}
                      className={`px-4 py-2 cursor-pointer hover:bg-blue-100 ${
                        currentSelect.area === option.area ? "bg-blue-50" : ""
                      }`}
                      onClick={() => {
                        setIsOpen(false);
                        setSelectorData(option)
                      }}
                    >
                      {option.areaName}
                    </li>
                  ))}
                </ul>
              )}
          </div>

        </Html>
  );
};

const EnergyTypes:EnergyTypesData[] = [{
    name:'風力',
    type:'Wind'
},{
    name:'太陽能',
    type:'Solar'
},{
    name:'地熱能',
    type:'Geothermal'
}];
export const RnewEnegryTypeTabs:FC = () => {
  const mapCityDataArray = mainStore(state => state.mapCityDataArray);
  const setCurrentSelectCity = mainStore(state => state.setCurrentSelectCity)
  const energyType = mainStore(state => state.energyType);
  const setEnergyType = mainStore(state => state.setEnergyType);
  return (
    <div className="listWrap h-full w-full fixed top-20 left-10 z-10" style={{maxWidth:250}}>
        <ul className="flex flex-row gap-1 pl-0.5 pr-0.5 h-fit bg-white">
          {
            EnergyTypes.map((e,i) => <li key={i} 
                onClick={()=>{
                  setEnergyType(e.type)
                }}
                className={'p-2 w-full text-center cursor-pointer '+(energyType === e.type?'text-blue-600 border-b-blue-600 border-b-2':'text-gray-400')}>{e.name}</li>)
          }
        </ul>
        <div className="cityList mt-2  overflow-auto h-full bg-white">
           <ul className="p-2 w-full" style={{paddingBottom:150}}>
              {
                mapCityDataArray.map((e,i) => {
                  return (
                    <li key={i} className="w-full p-2 cursor-pointer border-b-1 border-b-gray-400" onClick={()=>{
                      setCurrentSelectCity(e)
                    }}>
                      <p>{e.city}</p>
                    </li>
                  )
                })
              }
           </ul>
        </div>
      </div>
    
  )
}


