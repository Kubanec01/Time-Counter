export const SettingsBody = () => {


    return (
        <div
            className={"w-11/12 max-w-[900px] border mx-auto mt-[200px] flex justify-between"}>
            {/*Map*/}
            <section
                className={"pt-10 w-[22%]"}>
                <div
                    className={"pb-3 text-xl border-b border-black/20 w-[80%] font-medium"}>
                    <h1>Workspace <br/> Settings</h1>
                </div>
                <ul
                    className={"pt-6 font-medium flex flex-col gap-3"}>
                    <li
                        className={"flex items-center gap-1"}>
                        <span className={"text-4xl mb-0.5"}>·</span> Users
                    </li>
                    <li
                        className={"flex items-center gap-1"}>
                        <span className={"text-4xl mb-0.5"}>·</span>Name and Password
                    </li>
                </ul>
            </section>
            <section
                className={"flex-1 pl-6"}>
                <div
                    className={"text-3xl font-medium pb-5 pt-12.5 border-b border-black/20"}>
                    <h1>Projects</h1>
                </div>
                <ul
                    className={"w-full"}
                >

                </ul>
            </section>
        </div>
    )
}