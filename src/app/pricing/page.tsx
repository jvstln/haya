import { ArrowLeft2 } from "iconsax-reactjs";
import { SubscriptionPlans } from "@/components/plans";
import { Button } from "@/components/ui/button";

const Pricing = () => {
  return (
    <div className="px-6 pb-11 md:px-11">
      {/* Decorative background elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="-left-1/2 -bottom-1/2 pointer-events-none absolute size-208 bg-[#100841] opacity-30 blur-[144px]" />
        <div
          className="-translate-x-1/2 -top-1/2 -right-1/2 pointer-events-none absolute size-208 opacity-30 blur-[175px]"
          style={{
            background:
              "linear-gradient(261.15deg, #FFAFA4 -29.14%, #7A63FF 99.41%)",
          }}
        />
      </div>

      <div className="25 relative mt-19 mb-20 flex flex-col items-center gap-2 text-center">
        <Button size="icon" variant="ghost" className="absolute top-0 left-0">
          <ArrowLeft2 />
        </Button>
        <h1 className="text-3xl text-white">Upgrade your plan</h1>
        <p className="text-xl">Select your best preferred subscription plan</p>
      </div>

      <SubscriptionPlans />
    </div>
  );
};

export default Pricing;
