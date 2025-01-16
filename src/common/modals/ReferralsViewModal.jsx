import BackSvg from "../../../public/icons/back.svg";
import CopySvg from "../../../public/icons/copy.svg";
import InviteFriendsBox from "../../../public/images/invite-friends-present.svg";
import ReferralsStars from "../../../public/icons/referrals-stars.svg";
import clsx from "clsx";

export function ReferralsViewModal({isOpenReferrals,setIsOpenReferrals,referralCode}) {
  return (
    <div
      className={clsx(
        "flex flex-col items-center gap-2.5 fixed z-20 top-0 transition-all duration-700 w-screen overflow-y-auto pb-10 safe-top bg-white px-4 h-screen",
        isOpenReferrals ? "translate-x-0" : "translate-x-[20000px]"
      )}
    >
      <div className="flex items-center justify-between w-full mt-3 py-[22px]">
        <button className="pl-1.5" onClick={() => setIsOpenReferrals(false)}>
          <BackSvg />
        </button>
        <h4 className="font-medium mx-auto text-sm">Referrals</h4>
      </div>
      <div className="rounded-[20px] border-[#D2D2D2]/50 border p-4 flex items-center gap-2.5 w-full">
        <div>
          <InviteFriendsBox />
        </div>
        <div className="flex flex-col justify-start gap-0.5">
          <span className="font-semibold text-main-blue rounded-full py-1.5 px-4 bg-main-blue/10 font-roboto w-max">
            10% from sale
          </span>
          <h6 className="font-semibold text-xl">Invite Friends</h6>
          <p className="text-sm opacity-40">
            Invite a friend and get 10% from sale
          </p>
        </div>
      </div>
      <div className="bg-[#E8E8E8]/30 rounded-[20px] w-full flex-col p-4 flex gap-2.5 items-center">
        <h5 className="font-medium text-sm ">Your Referral code</h5>
        <span className="w-full flex justify-between items-center bg-white rounded-[20px] p-4">
          <p className="text-sm">{referralCode}</p>
          <button
            onClick={() =>
              window && window.navigator.clipboard.writeText(referralCode)
            }
          >
            <CopySvg />
          </button>
        </span>
      </div>
      <div className="flex items-center justify-between w-full">
        <h5 className="font-medium text-dark-blue">Other Tasks</h5>
        <button className="text-main-blue underline text-sm font-semibold leading-none">
          See All
        </button>
      </div>
      <div className="p-4 rounded-[20px] border border-[#D2D2D2]50 flex items-start w-full gap-1">
        <span>
          <ReferralsStars />
        </span>
        <div className="">
          <h6 className="text-sm font-semibold pb-0.5">You get free points</h6>
          <p className="text-xs opacity-40">
            When they Paypal, you unlock 1% from sale
          </p>
        </div>
      </div>
      <div className="text-start w-full flex flex-col gap-2.5">
        <h5 className="font-medium text-dark-blue">Statistics</h5>
        <button className="w-full p-4 justify-between rounded-[20px] border flex items-center border-[#D2D2D2]">
          <span className="text-sm">By month</span>
          <BackSvg className="rotate-180" />
        </button>
        <div className="w-full flex items-center border py-4 border-[#D2D2D2]/50 rounded-[20px]">
          <span className="flex border-r border-[#D2D2D2]50 flex-col items-center w-full">
            <h6 className="text-xs">Количество продаж</h6>
            <p className="font-semibold text-main-blue">12</p>
          </span>
          <span className="flex flex-col items-center w-full">
            <h6 className="text-xs">Перевод (idr)</h6>
            <p className="font-semibold text-main-blue">12550</p>
          </span>
        </div>
      </div>
      <div className="rounded-[20px] border py-4 px-3 flex items-end border-[#D2D2D2]/50 w-full">
        {[
          { ref: 10, month: 1 },
          { ref: 24, month: 2 },
          { ref: 7, month: 3 },
          { ref: 27, month: 4 },
          { ref: 7, month: 5 },
          { ref: 8, month: 6 },
          { ref: 24, month: 7 },
          { ref: 30, month: 8 },
          { ref: 19, month: 9 },
          { ref: 5, month: 10 },
          { ref: 3, month: 11 },
          { ref: 29, month: 12 },
        ].map((referral, idx) => (
          <div
            key={idx}
            className="flex gap-2.5 max-w-5 min-w-3 flex-col items-center mx-auto"
          >
            <span
              className="w-5 rounded-t-2xl bg-[#D2D2D2]/50"
              style={{ height: `${referral.ref * 6.2}px` }}
            ></span>
            <p className="text-sm opacity-40">{referral.month}</p>
          </div>
        ))}
      </div>
      <div className="text-start w-full">
        <h5 className="font-medium text-dark-blue">History</h5>
      </div>
      <div className="p-4 border rounded-[20px] border-[#D2D2D2]/50 justify-between w-full flex">
        <span>
          <p className="font-semibold text-sm">I bought a tour to Berlin</p>
          <p className="text-sm">Ivan Ivanov</p>
          <p className="text-sm opacity-40">Today at 2:20pm</p>
        </span>
        <p className="font-semibold text-main-blue">+5000</p>
      </div>
    </div>
  );
}
