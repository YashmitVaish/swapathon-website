import React from "react";
import Navbar from "../components/Navbar";
import bg from "../assets/MountainBg.png"
function GuidelinesPage() {
  return (
    <div className="h-screen w-screen overflow-hidden bg-no-repeat bg-center bg-cover" style={{
        backgroundImage:`url(${bg})`,
    }}>
      <div className="mt-5">
        <Navbar></Navbar>
      </div>
      <div className="flex justify-end">
        <div className="font-lastshuriken  mr-30 text-4xl mt-8">
          Feature Creep Chaos
        </div>
      </div>
      <div className="border border-white rounded-sm backdrop-blur-3xl mx-20 mt-10" >
        <div className="flex-col  justify-items-center pt-10 px-5 pb-20">
          <div className="text-3xl font-extrabold font-lastshuriken">
            {" "}
            Event Guidlines
          </div>
          <div className="text-2xl ">
            {" "}
            In chaos, the unprepared fall. The adaptable endure.
          </div>
          <div className="text-md font-zenantique">
            {" "}
            混沌の中で、備えなき者は倒れる。 適応する者だけが、生き残る
          </div>
          <hr className="color-white" />
          <div className="">
            Form Your Clan Two to four warriors walk together. A lone ronin may
            enter — but the battlefield shows no mercy. Receive Your Fate The
            battlefield does not ask for your idea — it hands you a mission.
            Each clan begins with a problem statement bestowed by the Shogunate
            (organisers) — your war begins the moment you unfold the scroll.
            Assigned Burden One compulsory feature is tied to the mission —
            unchangeable, unavoidable, a weight to be carried with honor. Four
            Seals of Innovation The clan must then forge four of its own
            features — crafted through wit, discipline, and instinct. The
            Shielding One of these four may be placed under protection — locked
            in iron, untouchable by enemy hands. The Swap Duel Clans face each
            other in ritual exchange. An unshielded feature is exposed — and
            rewritten by the challenger. Survival lies not in ownership — but
            adaptation. AI as a Blade Extension LLMs and code-forging tools are
            permitted; the ronin may sharpen his skill with any digital steel he
            masters. The Build Trial With the final five features, the clan must
            forge a working prototype — swift, deliberate, battle-ready. Conduct
            of Battle Strike the concept, not the samurai. Chaos is law —
            dishonor is exile. Judgment Victory is granted to the clan that
            adapts under pressure and returns from the storm still standing.
          </div>
      </div>
        </div>

    </div>
  );
}

export default GuidelinesPage;
