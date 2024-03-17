import PropTypes from "prop-types";

const SearchResult = ({ sr }) => {
  return (
    <div className="SearchResult">
      <div className="card">
        <div className="card-header">
          <div className="card-header-title">{sr.title}</div>
        </div>
        <div className="card-content">
          <div className="content">
            <video
              src={`${process.env.API_URI}/v1/stream/${sr.filename}`}
              controls
            />
            <span>{sr.description}</span>
            <br />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResult;

SearchResult.propTypes = {
  sr: PropTypes.object,
};
