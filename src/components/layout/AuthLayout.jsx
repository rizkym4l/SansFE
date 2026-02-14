import { Outlet } from "react-router-dom";
import Navbar from "../common/Navbar";
import Sidebar from "../common/Sidebar";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-orange-50/40 font-cartoon">
      <Navbar />
      <Sidebar />

      {/* Main Content */}
      <main className="md:ml-60 min-h-[calc(100vh-57px)] pb-20 md:pb-0">
        <Outlet />
      </main>
    </div>
  );
}
