export default function FilterBoxSkeleton() {
  return (
    <div className="bg-white rounded-4xl shadow-sm w-full animate-pulse">
      {/* Header Section */}
      <div className="flex flex-row items-center justify-between w-full pb-6 border-b border-[#F0F0F0] mb-6 p-6">
        <div className="h-5 bg-gray-200 rounded w-48"></div>
        <div className="h-5 bg-gray-200 rounded w-32"></div>
      </div>

      {/* Details Section */}
      <div className="space-y-2 pb-6 py-0 p-6 border-b border-[#F0F0F0]">
        <div className="flex">
          <span className="h-4 bg-gray-200 rounded w-20 mr-4"></span>
          <span className="h-4 bg-gray-200 rounded w-40"></span>
        </div>

        <div className="flex">
          <span className="h-4 bg-gray-200 rounded w-20 mr-4"></span>
          <span className="h-4 bg-gray-200 rounded w-32"></span>
        </div>

        <div className="flex">
          <span className="h-4 bg-gray-200 rounded w-20 mr-4"></span>
          <span className="h-4 bg-gray-200 rounded w-64"></span>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="space-y-4 mb-8 p-6 border-b border-[#F0F0F0]">
        <div className="flex items-center">
          <div className="w-[42px] h-[24px] bg-gray-200 rounded-full"></div>
          <div className="h-5 bg-gray-200 rounded w-56 ml-4"></div>
        </div>

        <div className="flex items-center">
          <div className="w-[42px] h-[24px] bg-gray-200 rounded-full"></div>
          <div className="h-5 bg-gray-200 rounded w-56 ml-4"></div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 p-6 pt-0">
        <div className="flex-1 h-14 bg-gray-200 rounded-2xl max-w-[263px]"></div>
        <div className="w-[110px] h-14 bg-gray-200 rounded-2xl ml-auto"></div>
        <div className="w-[66px] h-14 bg-gray-200 rounded-2xl"></div>
      </div>
    </div>
  );
}
