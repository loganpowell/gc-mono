// import PropTypes from "prop-types";

const SearchResult = ({ sr }) => {
  return (
    <div className="SearchResult">
      <div className="card">
        <div className="card-header">
          <div className="card-header-title">{sr.title}</div>
        </div>
        <div className="card-content">
          <div className="content">
            <video controls playsInline>
              <source
                src={`${import.meta.env.API_URI}/v1/stream/${sr.filename}`}
              />
              Your device does not support video playback
            </video>
            <span>{sr.description}</span>
            <br />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResult;

// SearchResult.propTypes = {
//   sr: PropTypes.object,
// };
