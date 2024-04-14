export const GazaBanner = ({ img, message }) => {
  return (
    <div className="flex items-center md:w-3/5 mx-auto border-b mb-5 border-gray-200">
      <div className="w-32 h-32 overflow-hidden rounded-full flex-shrink-0 m-2">
        <img className="mx-auto h-full" src={img} alt={message} />
      </div>
      <div className="">
        <h2 className="text-gray-900 text-lg title-font font-medium mb-2">
          Gaza Care
        </h2>
        <p className="leading-relaxed">{message}</p>
      </div>
    </div>
  );
};
