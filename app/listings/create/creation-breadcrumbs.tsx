export default function CreationBreadcrumbs({
    step,
    totalSteps,
}: {
    step: number;
    totalSteps: number;
}) {
    return (
        <div className="flex items-center space-x-2 text-sm text-gray-500 w-full">
            {[...Array(totalSteps)].map((_, index) => (
                <div
                    key={index}
                    className={`w-full h-1 rounded-full ${
                        index < step ? "bg-gray-500" : "bg-gray-200"
                    }`}
                ></div>
            ))}
        </div>
    );
}
