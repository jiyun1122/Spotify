import ArtistSlider from "../components/ArtistSlider";
import NewReleases from "./NewReleases";

export const Home = () => {
  return (
    <div className="flex items-start gap-4 px-6 pt-20 bg-black min-h-screen w-full">
      {/* 왼쪽 고정 박스 */}
      <div className="w-[200px] h-[260px] mt-10">
         <ArtistSlider />
      </div>

      {/* 가운데 슬라이더 */}
      <div className="flex-1 h-[260px] overflow-hidden mt-10">
        <NewReleases />
      </div>

      {/* 오른쪽 고정 박스 */}
      <div className="w-[200px] h-[260px] bg-[#1f2937] rounded-xl p-1 shadow flex shrink-0 mt-10">
         <h1 className="text-xl font-bold  text-white pl-2">Genres</h1>
      </div>
    </div>
  );
};