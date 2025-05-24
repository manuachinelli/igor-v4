import IgorHeader from "@/components/IgorHeader";
import IgorChat from "@/components/IgorChat";

export default function Page() {
  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <IgorHeader />
      <IgorChat />
    </div>
  );
}
