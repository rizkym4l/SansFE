import video from "../../assets/karakterVideo/mascot.mp4"
export default function Loading({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 min-h-dvh">
      <div className="w-52 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin">
        <video className="rounded-full p-2" src={video} ></video>
      </div>
      <p className="mt-10 text-gray-500 text-sm">{text}</p>
    </div>
  );
}
