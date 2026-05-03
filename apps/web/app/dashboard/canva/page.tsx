import { redirect } from "next/navigation";
import { CanvaPage } from "@/features/canva/components/canva-page";

const Canva = () => {
  redirect("/dashboard/canva/new");

  return <CanvaPage />;
};

export default Canva;
