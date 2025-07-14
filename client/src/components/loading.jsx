import React from "react";

function Loading({ message = "Loading..." }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[200px] text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
            <p className="text-gray-600 text-sm">{message}</p>
        </div>
    );
}

export default Loading;