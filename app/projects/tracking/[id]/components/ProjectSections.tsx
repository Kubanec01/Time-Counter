'use client'

import React from "react";
import {Section} from "@/types";
import {setNameByDate} from "@/features/utilities/date/setNameByDate";
import SectionCart from "@/app/projects/tracking/[id]/components/projectCart/components/SectionCart";

type ProjectSectionsProps = {
    projectId: string;
    updatedSectionsByDates: string[];
    sections: Section[];
    userId: string | undefined;
};

export const ProjectSections = ({...props}: ProjectSectionsProps) => {
    return (
        <div className="border border-black/5 p-8 mb-30 mx-auto flex flex-col gap-4 rounded-xl shadow-lg bg-white/60">
            {/*<div className="w-full border">*/}
            {/*    /!* select element will be here *!/*/}
            {/*</div>*/}

            <section>
                <ul className="w-full flex flex-col gap-[20px]">
                    {props.updatedSectionsByDates.length > 0 && (
                        <>
                            {props.updatedSectionsByDates.map((section, index) => (
                                <li
                                    className="w-full"
                                    key={index}
                                >
                                    <h1 className="text-sm text-black/50 font-medium ml-2 mb-2">
                                        {setNameByDate(section)}
                                    </h1>
                                    <div
                                        className={"rounded-xl bg-black/10 p-2 pb-0.5"}>
                                        {props.sections.map((i) => {
                                            if (i.updateDate === section) {
                                                return (
                                                    <SectionCart
                                                        key={i.sectionId}
                                                        userName={i.userName}
                                                        sectionId={i.sectionId}
                                                        projectId={i.projectId}
                                                        title={i.title}
                                                        userId={props.userId}
                                                        type={i.category}
                                                    />
                                                );
                                            }
                                            return null;
                                        })}
                                    </div>
                                </li>
                            ))}
                        </>
                    )}
                </ul>
            </section>
        </div>
    );
};