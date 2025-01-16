import Image from "next/image";
import placeImage from "../../public/images/placeImage.jpeg";
import profileImage from "../../public/images/profile-image.jpeg";
import clsx from "clsx";
import Link from "next/link";

export default function SeeAllPlacesCard() {
  return (
    <Link href='place-card' className="relative h-[270px] flex w-[324px] -z-30">
      <div
        style={{
          width: `${209}px`,
          height: `${242}px`,
          top: `${36}px`,
        }}
        className={clsx("absolute rounded-[20px] left-7 bg-[#03184E] blur-md")}
      />
      <div className="absolute flex justify-center w-[270px] h-[270px]">
        <div className="absolute rounded-[20px] z-30 top-0 size-full left-0 bg-gradient-to-t from-[#323131CC] to-[#32313100]" />
        <Image
          src={placeImage}
          priority
          alt={"See All"}
          className="object-cover w-full rounded-[20px] h-full object-center"
        />
        <div className="bottom-4 text-center border border-white py-4 absolute text-white bg-[#6b6b6b6e] w-[238px] font-medium rounded-[20px] text-base z-40">
          See all
        </div>
      </div>
      <div className="absolute w-[195px] h-[225px] -z-10 top-[22px] right-6">
        <Image
          src={placeImage}
          alt="See all"
          className="opacity-70 w-full h-full object-cover rounded-[20px] blur-[2px]"
        />
      </div>
      <div className="absolute w-[121px] h-[154px] -z-20 top-[58px] right-0">
        <Image
          src={profileImage}
          alt="See all"
          className="opacity-[47] w-full h-full object-cover rounded-[20px] blur-sm"
        />
      </div>
    </Link>
  );
}
