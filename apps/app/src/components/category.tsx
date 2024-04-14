export const CategoryCard = ({ img, title, link }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md">
      <a href={link}>
        <img
          src={img}
          alt="Placeholder Image"
          className="w-full h-38 object-cover object-center"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
      </a>
    </div>
  );
};
