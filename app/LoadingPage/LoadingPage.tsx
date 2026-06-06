import React from "react";
import {seoTitle} from "@/app/config/seo.title";


export const LoadingPage = () => {

    return (
        <>
            <title>{seoTitle.loading.title}</title>
        <section
            className={"w-full h-screen flex justify-center items-center"}>
            <img
                className={"aspect-square w-12.5"}
                src={"/loading_icon_img.png"} alt="loading-icon"/>
        </section>
        </>
    )
}