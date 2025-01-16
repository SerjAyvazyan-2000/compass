import clsx from "clsx";


export function SwitchToggle({isOn, setIsOn}) {
  return (
    <button
      onClick={() => setIsOn()}
      className="w-11 h-6 relative flex items-center"
    >
      <span
        className={clsx(
          "w-full h-[17px] opacity-50 rounded-full transition-all duration-300",
          isOn ? "bg-main-blue" : "bg-[#3C3C43]/30"
        )}
      ></span>

      <span
        className={clsx(
          "h-full rounded-full w-6 absolute z-10 transition-all box-border shadow-lg duration-300",
          isOn ? "bg-main-blue right-0" : "bg-white left-0"
        )}
      ></span>
    </button>
  );
}
