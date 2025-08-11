import { useEffect, useState, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import { getArtistTopTracks, getArtistInfo } from "../api/spotify";
import { FastAverageColor } from "fast-average-color";
import { AudioContext } from "../context/AudioContext";
import { getITunesPreviewUrl } from "../utils/fetchITunesPreview";

export default function ArtistPage() {
  console.log("페이지 렌더링됨")
  const {id} = useParams();
  console.log("URL로 받은 아티스트 ID:",id)
  const [tracks, setTracks] = useState([]);
  const [artist, setArtist] = useState(null);
  const [bgColor, setBgColor] = useState("rgb(0,0,0)");
  const imgRef = useRef(null);

  const {setCurrentTrack, setIsVisible} = useContext(AudioContext);

  useEffect(()=>{
    const fetchData = async () => {
      try{
        console.log("URL로 받은 아티스트 ID:",id);

        const artistData = await getArtistInfo(id);
        console.log("아티스트 정보:",artistData);
        setArtist(artistData);

        const topTracks =  await getArtistTopTracks(id);
        console.log("대표곡 데이터:",topTracks);
        setTracks(topTracks);
      } catch (error) {
        console.error("아티스트 정보 불러오기 실패",error.message);
      }
    };
    if(id) fetchData();
  },[id]);
  useEffect(()=>{
    if(!artist?.images?.[0]?.url) return;
    const fac = new FastAverageColor();

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = artist.images[0].url;

    img.onload = () => {
      fac.getColorAsync(img)
        .then(color =>{
          console.log("추출된 색상:",color.rgb);
          setBgColor(color.rgb);
        })
          .catch(err => console.error("색상 추출 실패:",err))
    };
    img.onerror = (e) => {
      console.error("이미지 로드 실패: ",e);
    }
  },[artist])
  

  if(!artist) return <p>로딩 중...</p>
         
  return (
    <div className="w-full bg-black text-white min-h-screen">
      <div
        className="w-full h-80 bg-center flex items-end p-6"
        style={{
          background: `linear-gradient(to bottom, ${bgColor}, black)`,
        }}
      >
        <img
          ref={imgRef}
          src={artist.images[0]?.url}
          alt={artist.name}
          className="w-44 h-44 rounded-full mr-6 shadow-lg"
        />
        <div 
          className="bg-black bg-opacity-60 p-4 rounded"
          style={{ backgroundColor: "rgba(0,0,0,0.0)"}}
        >
          <h1 className="text-6xl font-bold">{artist.name}</h1>
          <p className="text-lg text-gray-300 mt-2">
            월간 리스너 수: {artist.followers.total.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">인기곡</h2>
        <ul className="space-y-4">
          {tracks.map((track, idx) => (
            <li 
            key={track.id} 
            className="flex items-center space-x-4 p-3 rounded transition-all duration-200 hover:bg-gray-800 cursor-pointer"
            onClick={ async ()=>{
              let previewUrl = track.preview_url;

              if(!previewUrl) {
                previewUrl = await getITunesPreviewUrl(track.name, track.artists?.[0]?.name);
              }
              if(!previewUrl) {
                alert("이 곡은 미리듣기를 지원하지 않아요.");
                return;
              }
              setCurrentTrack({
                name: track.name,
                artist: track.artists?.[0]?.name,
                preview_url: previewUrl,
                albumImage: track.album?.images?.[0]?.url,
              });
              setIsVisible(true);
            }}
            >
              <span className="text-gray-400">{idx + 1}</span>
              <img
                src={track.album.images[2]?.url}
                alt="앨범커버"
                className="w-12 h-12 rounded"
              />
              <div className="flex flex-col">
                <span className="text-white font-medium">{track.name}</span>
                <span className="text-sm text-gray-400">{track.album.name}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}