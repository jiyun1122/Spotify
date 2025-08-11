import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";


export const Layout = () => {
  return(
    <div className="flex  min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center">
          <Outlet />
        </main>
    </div>
  );
}