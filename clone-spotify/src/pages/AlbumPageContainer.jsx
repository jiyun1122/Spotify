import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchAlbumById } from "../api/spotify";
import AlbumPage from "./AlbumPage";

export default function AlbumPageContainer() {
  const { albumId } = useParams();
  const [album, setAlbum] = useState(null);

  useEffect(()=>{
    async function load(){
      try {
        const data = await fetchAlbumById(albumId);
        setAlbum(data);
      } catch (error) {
        console.error('Failed to load album:',error);
      }
    } load();
  },[albumId]);

  if(!album) return <p> 로딩 중..</p>
  return <AlbumPage album={album} />;

}