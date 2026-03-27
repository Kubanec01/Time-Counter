import {JSX, ReactNode} from "react";
import {twMerge} from "tailwind-merge";


const ModalTemplate = (
    {children, className}: { children: JSX.Element | ReactNode, className?: string }) => {

    const bodyClass = `fixed top-2/4 left-2/4 -translate-2/4 w-[290px] h-[320px] rounded-xl p-6 mx-auto`

    return (
        <>
            <div
                className={twMerge(`${bodyClass} backdrop-blur-sm z-40`, className)}
            />
            <div
                className={twMerge(`${bodyClass} z-41 bg-white/20 border border-black/12 shadow-xl`, className)}
            >
                {children}
            </div>
        </>
    )

}

export default ModalTemplate;