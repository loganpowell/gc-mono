import { Card } from "@ui/card";
const SearchResult = ({ sr }) => {
  return (
    <Card
      video={`${process.env.API_URI}/v1/stream/${sr.filename}`}
      title={sr.title}
      description={sr.description}
    />
  );
};

export default SearchResult;

// SearchResult.propTypes = {
//   sr: PropTypes.object,
// };
