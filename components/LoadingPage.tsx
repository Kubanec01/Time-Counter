import React from "react";


export const LoadingPage = () => {

    return (
        <section
            className={"w-full h-screen flex justify-center items-center"}>
            <img
                className={"aspect-square w-[50px]"}
                src={"/loading-icon-img.png"} alt="loading-icon"/>
        </section>
    )
}