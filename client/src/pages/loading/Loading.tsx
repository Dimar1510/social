import { GiBirdTwitter } from "react-icons/gi"

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-[#161616]">
      <div className="relative flex justify-center items-center size-52">
        <div className="absolute animate-spin rounded-full max-w-[50vw] aspect-auto size-64 border-t-4 border-b-4 border-primary"></div>
        <GiBirdTwitter className="size-48 text-foreground-300 p-2" />
      </div>
    </div>
  )
}

export default Loading
