import type { ReactNode } from 'react';
import type { Vector3 } from "three"
import { Html } from "@react-three/drei"
import type { FC } from "react"

type FloatInfoBlockProps = {
    position?: Vector3,
    children?: ReactNode | ReactNode[]

}
const FloatInfoBlock:FC<FloatInfoBlockProps> = ({children}) => {
    return (
        <Html as="div" position={[-30,10,0]} >
            <div className='infoBlock bg-amber-50 p-4 rounded-2xl border border-black'>
                {children}
            </div>
        </Html>
    )
}

export default FloatInfoBlock