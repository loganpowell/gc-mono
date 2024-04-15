const search = (dispatch, keywords, language) => {
  dispatch({ type: "REQUESTING_SEARCH" });

  const API_URI = process.env.VITE_API_URI;
  console.log("API_URI", API_URI);

  fetch(`${API_URI}/v1/search?q=${keywords}&lang=${language}`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((json) => dispatch({ type: "RECEIVED_SEARCH_RESULTS", data: json }));
};

const changeLocale = (locale) => {
  return { type: "CHANGE_LOCALE", data: locale };
};

export { search, changeLocale };
