import {createPortal} from "react-dom";


const LoadingSmallModal = ({isOpen}: {isOpen: boolean}) => {


    if(!isOpen) return null

    return (
        createPortal(
            <div
                className={'absolute bottom-3 right-3 text-sm bg-black/80 text-white/80 px-4 py-1.5 rounded-md'}>
                Loading...
            </div>,
            document.body
        )
    )
}

export default LoadingSmallModal