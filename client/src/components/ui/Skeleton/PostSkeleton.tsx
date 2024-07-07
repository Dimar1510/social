import {
  CardBody,
  CardFooter,
  CardHeader,
  Card as NextCard,
  Skeleton,
} from "@nextui-org/react"
import { FaRegComment } from "react-icons/fa"
import { MdOutlineFavoriteBorder } from "react-icons/md"

const PostSkeleton = () => {
  return (
    <NextCard className="mb-6" shadow="sm">
      <CardHeader className="items-center bg-transparent">
        <div className="max-w-[300px] w-full flex items-center gap-3">
          <div>
            <Skeleton className="flex rounded-full w-12 h-12" />
          </div>
          <div className="w-full flex flex-col gap-2">
            <Skeleton className="h-3 w-3/5 rounded-lg" />
            <Skeleton className="h-3 w-4/5 rounded-lg" />
          </div>
        </div>
      </CardHeader>
      <CardBody className="px-3 py-2 flex flex-col gap-4">
        <Skeleton className="h-3 w-3/5 rounded-lg" />
        <Skeleton className="h-3 w-2/5 rounded-lg" />
      </CardBody>
      <CardFooter>
        <div className="flex gap-5 items-center ">
          <FaRegComment className="text-default-300" />
          <MdOutlineFavoriteBorder className="text-default-300" />
        </div>
      </CardFooter>
    </NextCard>
  )
}

export default PostSkeleton
