import {ReactNode} from "react";


const RadialPurpleGradientBg = (
    {children} :
    {children: ReactNode}
) => {

    return (
        <section
            className="w-full h-screen flex flex-col justify-center items-center bg-radial from-gradient-purple to-white to-40%">
            {children}
        </section>
    )
}

export default RadialPurpleGradientBg;