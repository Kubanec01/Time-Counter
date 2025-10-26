import React from "react";

const page = () => {
  return (
    <section className="w-full h-screen flex justify-center items-center">
      <div className="border w-[400px] h-[300px] rounded-2xl flex flex-col px-4">
        <h1 className="text-3xl text-center mt-8">Sign Up</h1>
        <div className="w-full flex flex-col justify-center items-center flex-1 gap-4">
          <input
            className="w-full h-[50px] border rounded-2xl text-xl px-3"
            type="text"
          />
          <input
            className="w-full h-[50px] border rounded-2xl text-xl px-3"
            type="password"
          />
          <button className="text-lg border rounded-2xl px-4 py-1">
            Sign Up
          </button>
        </div>
      </div>
    </section>
  );
};

export default page;
