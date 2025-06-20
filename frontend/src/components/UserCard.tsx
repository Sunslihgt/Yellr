function UserCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-4">
      <div className="flex items-center space-x-3">
        <img 
          className="w-12 h-12 rounded-full" 
          src="https://pbs.twimg.com/profile_images/1861527302418391040/Dh98PT3y_400x400.jpg" 
          alt="Rafael Nadal profile picture"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            Rafael Nadal
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            @rafaelnadal
          </p>
        </div>
        <button className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full transition-colors">
          Follow
        </button>
      </div>
    </div>
  );
}

export default UserCard;