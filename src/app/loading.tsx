export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="flex flex-col items-center space-y-6 mt-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-300 rounded-full animate-spin border-t-transparent"></div>
        <div className="absolute inset-3 w-10 h-10 bg-blue-500 rounded-full animate-ping opacity-75"></div>
      </div>
      <p className="text-lg text-gray-600 font-medium">Loading...</p>
    </div>
  </div>
)
}
