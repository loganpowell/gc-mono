export const search = (dispatch, keywords, language) => {
  dispatch({ type: "REQUESTING_SEARCH" });

  const API_URI = process.env.API_URI;
  console.log("API_URI", API_URI);

  fetch(`${API_URI}/v1/search?q=${keywords}&lang=${language}`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((json) => dispatch({ type: "RECEIVED_SEARCH_RESULTS", data: json }));
};
