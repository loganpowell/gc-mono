export const SearchBar = ({ onClick, onChange, placeholder }) => {
  return (
    <form className="flex max-w-xl md:mx-auto" min-width="400 500 600 700 800">
      <div className="w-full">
        <div className="relative h-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none"></div>
          <input
            type="text"
            className="block w-full px-3 py-2 pl-11 text-base text-gray-900 bg-white border border-gray-200 rounded-l-xl focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder:text-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder={placeholder}
            onChange={onChange}
          />
        </div>
      </div>
      <div>
        <input
          type="submit"
          className="w-full px-4 py-2 text-base font-medium text-center text-white bg-blue-700 dark:bg-blue-600 dark:border-blue-600 border border-blue-700 cursor-pointer rounded-r-xl  hover:bg-blue-800 dark:hover:border-blue-700 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          value="Search"
          onClick={(e) => (e.preventDefault(), onClick(e))}
        />
      </div>
    </form>
  );
};
