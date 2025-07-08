import { useState, type FC } from "react";
import type { PowerData,EnegryTypesData } from "../../utils/types";
import { Html } from "@react-three/drei";

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
            transform: 'translate(-45%, 5%)'
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

type TabsProp = {
  EnegryTypes: EnegryTypesData[],
  enegryType:string
  setSelectorType: (type:string) => void
}
export const RnewEnegryTypeTabs:FC<TabsProp> = ({enegryType,EnegryTypes,setSelectorType}) => {
  // const [currentSelect, setCurrentSelect] = useState(EnegryTypes[0]);
  return (
    <Html as='div'
     fullscreen
        style={{
            left:0,
            transform: 'translate(-45%, 5%)'
        }}>
      <div className="listWrap h-full">
        <ul className="flex flex-row gap-1 pl-0.5 pr-0.5 w-fit bg-white">
          {
            EnegryTypes.map((e,i) => <li key={i} 
                onClick={()=>{
                  setSelectorType(e.type)
                }}
                className={'p-2 cursor-pointer '+(enegryType === e.type?'text-blue-600 border-b-blue-600 border-b-2':'text-gray-400')}>{e.name}</li>)
          }
        </ul>
      </div>
    </Html>
    
  )
}


