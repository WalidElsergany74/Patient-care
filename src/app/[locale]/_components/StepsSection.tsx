

import React from "react";
import "aos/dist/aos.css";
import { getCurrentLocale } from "@/lib/getCurrentLocale";
import getTrans from "@/lib/translations";
import { Languages } from "@/constants";



const StepsSection =  async() => {
  const locale = await getCurrentLocale()
  const {home } = await getTrans(locale)
  const steps = [
    {
      id: 1,
      title: home.stepSection.cardOne.title,
      description:
      home.stepSection.cardOne.description,
      icon: "👨‍⚕️",
    },
    {
      id: 2,
      title: home.stepSection.cardTwo.title,
      description:
      home.stepSection.cardTwo.description,
      icon: "📅",
    },
    {
      id: 3,
      title: home.stepSection.cardThree.title,
      description:
      home.stepSection.cardThree.description,
      icon: "📝",
    },
    {
      id: 4,
      title: home.stepSection.cardFour.title,
      description:
      home.stepSection.cardFour.description,
      icon: "💊",
    },
  ];
  return (
    <section className="py-12">
  {/* Section Header */}
  <div className="text-center mb-16">
    <h5 className="text-lg font-medium text-muted-foreground">- {home.stepSection.title}</h5>
    <h2 className="text-3xl md:text-4xl font-bold mt-4">
      {locale === Languages.ARABIC ? (
        <>
          <span className="text-primary">{home.stepSection.easySteps}</span> {home.stepSection.getSolution}
        </>
      ) : (
        <>
          <span className="text-primary">4 Easy Steps</span> And Get Your Solution
        </>
      )}
    </h2>
  </div>

  {/* Steps Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 ">
    {steps.map((step) => (
      <div
        key={step.id}
        className="group cursor-pointer bg-white border border-gray-200 py-10 px-6 rounded-2xl shadow-sm flex flex-col items-center text-center
          transition-all duration-[0.3ms] ease-in-out hover:bg-primary hover:border-primary hover:shadow-lg hover:-translate-y-2 hover:scale-105"
      >
        <div className="w-18 h-18 p-2 flex items-center justify-center bg-primary/10 rounded-full text-4xl text-primary mb-6 transition-all group-hover:bg-white group-hover:text-primary">
          {step.icon}
        </div>
        <h3 className="text-xl font-semibold mb-3 group-hover:text-white">{step.title}</h3>
        <p className="text-gray-500 text-sm font-light group-hover:text-white">{step.description}</p>
      </div>
    ))}
  </div>
</section>

  );
};

export default StepsSection;
