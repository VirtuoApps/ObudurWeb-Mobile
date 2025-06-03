export default function FilterBoxSkeleton() {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl lg:rounded-4xl shadow-sm w-full animate-pulse">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full pb-4 sm:pb-6 border-b border-[#F0F0F0] mb-4 sm:mb-6 p-4 sm:p-6 gap-2 sm:gap-0">
        <div className="h-4 sm:h-5 bg-gray-200 rounded w-32 sm:w-48"></div>
        <div className="h-3 sm:h-4 lg:h-5 bg-gray-200 rounded w-24 sm:w-32"></div>
      </div>

      {/* Details Section */}
      <div className="space-y-3 sm:space-y-2 pb-4 sm:pb-6 py-0 p-4 sm:p-6 border-b border-[#F0F0F0]">
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-0">
          <span className="h-3 sm:h-4 bg-gray-200 rounded w-16 sm:w-20 sm:mr-4"></span>
          <span className="h-3 sm:h-4 bg-gray-200 rounded w-32 sm:w-40"></span>
        </div>

        <div className="flex flex-col sm:flex-row gap-1 sm:gap-0">
          <span className="h-3 sm:h-4 bg-gray-200 rounded w-16 sm:w-20 sm:mr-4"></span>
          <span className="h-3 sm:h-4 bg-gray-200 rounded w-24 sm:w-32"></span>
        </div>

        <div className="flex flex-col sm:flex-row gap-1 sm:gap-0">
          <span className="h-3 sm:h-4 bg-gray-200 rounded w-16 sm:w-20 sm:mr-4"></span>
          <span className="h-3 sm:h-4 bg-gray-200 rounded w-48 sm:w-64"></span>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 p-4 sm:p-6 border-b border-[#F0F0F0]">
        <div className="flex items-center">
          <div className="w-[38px] h-[22px] sm:w-[42px] sm:h-[24px] bg-gray-200 rounded-full"></div>
          <div className="h-3 sm:h-4 lg:h-5 bg-gray-200 rounded w-40 sm:w-56 ml-3 sm:ml-4"></div>
        </div>

        <div className="flex items-center">
          <div className="w-[38px] h-[22px] sm:w-[42px] sm:h-[24px] bg-gray-200 rounded-full"></div>
          <div className="h-3 sm:h-4 lg:h-5 bg-gray-200 rounded w-40 sm:w-56 ml-3 sm:ml-4"></div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-4 sm:p-6 pt-0">
        <div className="flex-1 h-12 sm:h-14 bg-gray-200 rounded-xl sm:rounded-2xl sm:max-w-[263px] order-1"></div>
        <div className="flex gap-3 sm:gap-4 order-2">
          <div className="flex-1 sm:flex-none sm:w-[110px] h-12 sm:h-14 bg-gray-200 rounded-xl sm:rounded-2xl sm:ml-auto"></div>
          <div className="flex-1 sm:flex-none sm:w-[66px] h-12 sm:h-14 bg-gray-200 rounded-xl sm:rounded-2xl"></div>
        </div>
      </div>
    </div>
  );
}
