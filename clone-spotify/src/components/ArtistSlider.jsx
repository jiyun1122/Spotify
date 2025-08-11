import { useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { searchArtistByName } from "../api/spotify";
import { mockArtists } from "../mock/mockArtists";
import { Link } from "react-router-dom";

export default function ArtistSlider() {
  const [artists, setArtists] = useState([]);
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(false);

    
      
        
  useEffect(() => {
  const loadArtists = async () => {
    try {
      const results = await Promise.all(
        mockArtists.map(async (name) => {
          try {
            return await searchArtistByName(name);
          } catch (e) {
            console.warn(`❗ ${name} 실패`, e);
            return null;
          }
        })
      );

      const filtered = results.filter(
        (artist) => artist && artist.images && artist.images.length > 0
      );

      console.log("🎯 최종 필터링된 아티스트 목록:", filtered);
      setArtists(filtered);
    } catch (err) {
      console.error("❌ 아티스트 전체 불러오기 실패:", err);
    }
  };

  loadArtists(); 
}, []);
    
    const handleChange = (newIndex) => {
      setFade(true);
      setTimeout(()=>{
        setIndex(newIndex);
        setFade(false);
      },300)
    };
    const artist = artists[index];
    if(!artists || artists.length === 0 || !artist) {
      return <div className="text-white">🎶 아티스트 정보 불러오는 중...</div>
    }
    return (
    <div className="relative w-full h-full bg-[#1f2937] rounded-xl p-4 shadow flex flex-col items-center overflow-hidden group">
      <h1 className="absolute top-1 left-1 text-xl font-bold  text-white ml-1 mb-3 self-start">🎤 Artist </h1>
      <Link to={`/artist/${artist.id}`} className={`flex flex-col items-center justify-center transition-opacity duration-300 transform group-hover:scale-102 group-hover:cursor-pointer
        ${fade ? "opacity-0" : "opacity-100"}`}>
      {artist && artist.images?.[0]?.url ? (
      <img
        src={artist.images?.[0]?.url}
        alt={artist.name}
        className="w-37 h-37 rounded-full object-cover mb-2 mt-10"
      />
      ) : (
        <div className="w-37 h-37 bg-gray-700 items-center justify-center text-white text-sm">
          No Image
        </div>
      )}
      <p className="text-lg font-medium text-white">{artist.name}</p>
      <p className="text-sm text-gray-300">아티스트</p>
      </Link>
      
      {index > 0 && (
        <button
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-[#1f2937]  p-2 rounded-full shadow hover:scale-105 transition cursor-pointer hidden group-hover:block"
          onClick={()=> handleChange(index - 1)}
        >
           <ChevronLeftIcon className="w-5 h-5 text-white" />
        </button>
      )}
      {index < artists.length -1 &&(
         <button
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-[#1f2937]  p-2 rounded-full shadow hover:scale-105 transition cursor-pointer hidden group-hover:block"
          onClick={()=> handleChange(index + 1)}
        >
           <ChevronRightIcon className="w-5 h-5 text-white" />
        </button>
      )}
    </div>
  );

}