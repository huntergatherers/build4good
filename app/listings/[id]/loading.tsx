import { LoaderCircle } from "lucide-react";

export default function Loading() {
    return (
        <div className="h-screen my-auto flex flex-col justify-center items-center">
            <div className="text-2xl font-semibold">Loading...</div>
            <LoaderCircle className="animate-spin mt-2" size={50} />
        </div>
    );
}
