import { useContext } from "react";
import { AudioContext } from "../context/AudioContext";
import { useEffect, useRef, useState } from "react";
import { FastAverageColor } from "fast-average-color";
import { getITunesPreviewUrl } from "../utils/fetchITunesPreview";

export default function AlbumPage({album}) {
  const imgRef = useRef(null);
  const [bgcolor, setBgColor] = useState('rgb(0,0,0)');
  const {setCurrentTrack, setIsVisible} = useContext(AudioContext);

  useEffect(()=>{
    const fac = new FastAverageColor();
    const img = imgRef.current;

    if(img?.complete){
      fac.getColorAsync(img).then((color)=>{
        setBgColor(color.rgb);
      });
    } else {
      img?.addEventListener('load', ()=>{
        fac.getColorAsync(img).then((color)=>{
          setBgColor(color.rgb);
        })
      })
    }
  },[]);
  const totalDurationMs = album.tracks.items.reduce((acc,track)=> acc + track.duration_ms, 0)
  const totalMinutes = Math.floor(totalDurationMs / 60000);
  const totalSeconds = Math.floor((totalDurationMs % 6000) / 1000);

  return(
    <div className="w-full min-h-screen pt-20 text-white bg-black">
      <div
        className="max-w-7xl mx-auto px-8"
        style={{
          background: `linear-gradient(to bottom, ${bgcolor}, #000)`,
        }}
      >
        <div className="flex items-center gap-6">
          <img 
            ref={imgRef}
            crossOrigin="anonymous"
            src={album.images[0].url}
            alt={album.name}
            className="w-52 h-52 object-cover rounded shadow-lg"
            />
            <div>
              <p className="uppercase text-sm font-medium">앨범</p>
              <h1 className="text-4xl font-bold">{album.name}</h1>
              <p className="mt-2 text-gray-200">
                {album.artists.map((a)=>a.name).join(', ')}{' '}
                {new Date(album.release_date).getFullYear()}{' '}
                {album.tracks.total}곡 {totalMinutes}분 {totalSeconds}초
              </p>
            </div>
        </div>
      </div>
      <div className="px-8 py-4 bg-black">
        <table className="w-full text-left">
          <thead className="border-b border-gray-700">
            <tr>
              <th className="py-2">#</th>
              <th>제목</th>
              <th>재생 시간</th>
            </tr>
          </thead>
          <tbody>
            {album.tracks.items.map((track, index)=>{
              const min = Math.floor(track.duration_ms / 60000);
              const sec = String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0');
              return (
                <tr 
                key={track.id} 
                className="hover:bg-gray-800 cursor-pointer"
                onClick={async ()=>{
                  let previewUrl = track.preview_url;
                  console.log("앨범 이미지: ",album.images)

                  if(!previewUrl) {
                    previewUrl = await getITunesPreviewUrl(track.name, track.artists?.[0]?.name);
                  }
                  console.log("최종 previewUrl:", previewUrl)
                  if(previewUrl?.startsWith("http://")){
                    previewUrl = previewUrl.replace("http://","https://");
                  }
                  if(previewUrl) {
                    setCurrentTrack({
                      name: track.name,
                      artist: track.artists?.[0]?.name,
                      preview_url: previewUrl,
                      albumImage: album.images?.[0]?.url,
                    });
                    setIsVisible(true);
                  } else {
                    alert("이 곡은 미리듣기를 지원하지 않아요.");
                  }
                }}
                >
                  <td className="py-2">{index + 1 }</td>
                  <td>{track.name}</td>
                  <td>{min}:{sec}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}