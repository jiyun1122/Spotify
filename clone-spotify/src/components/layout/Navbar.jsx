import { useState } from 'react';
import KongLogo from '/Kong.svg';
import {Bars3Icon, XMarkIcon} from "@heroicons/react/24/solid";
import SearchBar from '../SearchBar';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return(
    <nav className="fixed top-0 left-0 right-0 bg-black border-b-1 border-gray-600 z-50">
  {/* 데스크톱용 Navbar */}
  <div className="hidden md:flex h-20 items-center justify-between px-6">
    {/* 로고 */}
    <Link to="/">
    <img src={KongLogo} alt="logo" className="w-28 h-28" />
    </Link>
    {/* 검색창 */}
    <div className='w-[430px] relative'>
      <SearchBar />
    </div>

    {/* 로그인/회원가입 */}
    <div className="flex gap-4 text-sm text-white">
      <div className="font-medium">로그인</div>
      <div className="font-medium">회원가입</div>
    </div>
  </div>

  {/* 모바일용 Navbar */}
  <div className="flex flex-nowrap md:hidden h-20 items-center justify-between px-4">
    {/* 로고 */}
    <div className='flex items-center space-x-2'>
    <img src={KongLogo} alt="logo" className="w-20 h-20" />

      <div
      className='w-[190px] h-[30px] relative'>
      <SearchBar />
      </div>
    </div>

    {/* 햄버거 버튼 */}
    <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
      <Bars3Icon className="w-6 h-6 text-black" />
    </button>
    </div>
    
  {/* 모바일 사이드메뉴 */}
  {isMenuOpen && (
    <>
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={() => setIsMenuOpen(false)}
      />
      <div
        className="fixed top-0 right-0 h-full w-64 bg-white z-50 shadow-lg transition-transform duration-300"
      >
        <button
          onClick={() => setIsMenuOpen(false)}
          className="absolute top-4 right-4 text-gray-500"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <div className="mt-20 flex flex-col space-y-6 px-6">
          <div className="text-lg font-medium cursor-pointer">로그인</div>
          <div className="text-lg font-medium cursor-pointer">회원가입</div>
        </div>
      </div>
    </>
  )}
</nav>
  );
}