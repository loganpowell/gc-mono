const BASE_URI = process.env.API_URI;

const search = (dispatch, keywords, language) => {
  dispatch({ type: "REQUESTING_SEARCH" });

  fetch(`${BASE_URI}/v1/search?q=${keywords}&lang=${language}`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((json) => dispatch({ type: "RECEIVED_SEARCH_RESULTS", data: json }));
};

export { search };
