'use client'

import BackSvg from '../../../public/icons/back.svg'
import QrCodeSvg from '../../../public/images/qr-code.svg'
import Link from 'next/link'

export default function Galleon() {
  return (
    <div className="px-4 h-screen overflow-y-auto pb-20 safe-top">
      <div className="flex items-center w-full py-5 mt-2.5">
        <Link href={'..'}>
          <BackSvg />
        </Link>
        <h4 className="font-medium mx-auto">Galleon</h4>
      </div>
      <div className="flex items-center flex-col gap-2.5">
        <span className="text-[#848282] text-sm text-center px-4 mb-6">
          Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod
          tempor incidunt ut labore et dolore magna aliqua.
        </span>
        <span className="bg-gradient-to-br from-main-blue to-[#38B7FF] p-4 flex items-center justify-center rounded-[20px]">
          <span className="bg-white p-8 rounded-[20px]">
            <QrCodeSvg />
          </span>
        </span>
        <span className="rounded-[20px] border border-[#D2D2D2]/50 w-full px-1">
          <span className="flex items-center justify-between px-2.5 py-5 border-b border-b-[#D9D9D9]/50">
            <p className="text-[#848282]">Name</p>
            <p className="font-medium">Ivan Ivanov</p>
          </span>
          <span className="flex items-center justify-between px-2.5 py-5">
            <p className="text-[#848282]">Bonus</p>
            <p className="font-medium">0</p>
          </span>
        </span>
        <Link className="underline text-main-blue decoration-solid" href="rcm">
          Как получить бонусы?
        </Link>
      </div>
    </div>
  )
}
