import { useEffect, useState, useRef } from "react";
import { fetchNewReleases } from "../api/spotify";
import { useNavigate } from "react-router-dom";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

export default function NewReleases() {
  const [albums, setAlbums] = useState([]);
  const [error, setError] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [showLeft, setShowLeft]  = useState(false);
  const [showRight, setShowRight] = useState(true);
  const navigate = useNavigate();

  const containerRef = useRef();

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchNewReleases();
        setAlbums(data);
      } catch (err) {
        console.error(err);
        setError("데이터를 불러오지 못했습니다.");
      }
    }

    loadData();
  }, []);


  useEffect(()=>{
    const el = containerRef.current;
    if(!el) return;
    const handleScroll = () => {
      const scrollLeft = el.scrollLeft;
      const maxScroll = el.scrollWidth - el.clientWidth;
      setShowLeft(scrollLeft > 0);
      setShowRight(scrollLeft < maxScroll - 10);
    };
    el.addEventListener("scroll",handleScroll);
    return () => el.removeEventListener("scroll",handleScroll);
  },[]);

  const scrollByAmount = 400;

  const handleScrollLeft = () => {
    containerRef.current.scrollBy({left: -scrollByAmount, behavior:"smooth"})
  }
  const handleScrollRight = () => {
    containerRef.current.scrollBy({left: scrollByAmount, behavior:"smooth"})
  }
    if (error) return <p>{error}</p>;

  return (
    <div className="relative w-full h-full bg-[#1f2937] rounded-xl"
      onMouseEnter={()=> setHovered(true)}
      onMouseLeave={()=> setHovered(false)}
    >
      <h1 className="text-xl font-bold mb-4 text-white ml-1 pt-1">🎶New Album</h1>
      <div
        ref={containerRef}
        className="flex overflow-x-auto scroll-smooth gap-4  pl-0 scrollbar-hide justify-start"
      >
        {albums.slice(0,16).map((album)=>(
          <div
            key={album.id}
            className="w-[160px] flex-shrink-0 bg-[#1f2937] p-2 rounded shadow text-white cursor-pointer hover:scale-105"
            onClick={()=> navigate(`/album/${album.id}`)}
          >
            <img
              src={album.images[0].url}
              alt={album.name}
              className="w-full h-auto rounded mb-2"
              />
              <p className="text-sm font-semibold truncate text-white leading-tight">{album.name}</p>
              <Link
                to={`/artist/${album.artists[0]?.id}`}
                className="text-sm text-white hover:underline"
                onClick={(e)=> e.stopPropagation()}
              >
                {album.artists[0]?.name}
              </Link>
          </div>
        ))}      
      </div>
      {hovered && showLeft && (
        <button
        onClick={handleScrollLeft}
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-[#1f2937]  p-2 rounded-full shadow hover:scale-105 transition cursor-pointer"
        >
            <ChevronLeftIcon className="w-5 h-5 text-white" />
        </button>
      )}
      {hovered && showRight && (
        <button
          onClick={handleScrollRight}
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-[#1f2937]  p-2 rounded-full shadow hover:scale-105 transition cursor-pointer">
            <ChevronRightIcon className="w-5 h-5 text-white" />
          </button>
      )}
  </div>
  );
}