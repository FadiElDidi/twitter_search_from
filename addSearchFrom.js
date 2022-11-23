let listState, searchState, typeahead;
let activeFrom = false;
const inputRef = document.querySelector(
  '[data-testid="SearchBox_Search_Input"]'
);
const fromTokenRef = document.createElement("div");
fromTokenRef.innerHTML = "from: ";
fromTokenRef.style.display = "none";
fromTokenRef.style.background = "#1d9bf0";
fromTokenRef.style.margin = "10px 3px";
fromTokenRef.style.alignItems = "center";
fromTokenRef.style.padding = "5px 3px";
fromTokenRef.style.borderRadius = "5px";
inputRef?.parentNode?.insertBefore(fromTokenRef, inputRef);

const showFromToken = () => {
  fromTokenRef.style.display = "flex";
};
const hideFromToken = () => {
  fromTokenRef.style.display = "none";
};
const refreshStates = () => {
  const getSearchStateNode = () => {
    let searchRef = document.querySelector('form[role="search"]').parentNode
      .parentNode;

    let fiberKey = Object.keys(searchRef).find((el) =>
      el.startsWith("__reactFiber$")
    );
    let reactFiber = searchRef[fiberKey];
    let stateNode;
    while (!stateNode || !reactFiber.return) {
      reactFiber = reactFiber.return;
      stateNode = reactFiber.stateNode;
    }
    return stateNode;
  };
  const getListStateNode = () => {
    let searchRef = document.querySelector('div[role="listbox"]');
    if (!searchRef) return undefined;
    let fiberKey = Object.keys(searchRef).find((el) =>
      el.startsWith("__reactFiber$")
    );
    let reactFiber = searchRef[fiberKey];
    let stateNode;
    while (!stateNode || !reactFiber.return) {
      reactFiber = reactFiber.return;
      stateNode = reactFiber.stateNode;
    }
    return stateNode;
  };
  const getTypeahead = () => {
    let searchRef = document.querySelector('form[role="search"]').parentNode
      .parentNode.parentNode;

    let fiberKey = Object.keys(searchRef).find((el) =>
      el.startsWith("__reactFiber$")
    );
    let reactFiber = searchRef[fiberKey];
    let stateNode;
    while (!stateNode || !reactFiber.return) {
      reactFiber = reactFiber.return;
      stateNode = reactFiber.stateNode;
    }
    return stateNode;
  };
  listState = getListStateNode();
  searchState = getSearchStateNode();
  typeahead = getTypeahead();
  if (listState) {
    listState._handleItemClick = (e, t) => {
      typeahead._submitQuery({
        query: `(from:${e.data.screen_name})`,
        shouldAddToRecentSearch: false,
      });
    };
  }
};
const setShowFrom = (state) => {
  activeFrom = state;
  if (state) {
    showFromToken();
  } else {
    hideFromToken();
  }
};
refreshStates();
inputRef?.addEventListener("keydown", (e) => {
  if (activeFrom && e.keyCode === 13) {
    if (listState.state.focusIndex === -1) {
      typeahead._submitQuery({
        query: `(from:${searchState.state.query.replaceAll("@", "")})`,
        shouldAddToRecentSearch: false,
      });
    } else {
      listState.selectFocusedItem();
    }
  }
});
inputRef?.addEventListener("keyup", (e) => {
  if (activeFrom) {
    if (e.keyCode === 8 && searchState.state.query === "") {
      setShowFrom(false);
    } else {
      const updatedQuery = "@" + searchState.state.query.replaceAll("@", "");
      searchState.setQuery(updatedQuery);
    }
  }
  if (searchState.state.query.startsWith("from:")) {
    searchState.setQuery("");
    setShowFrom(true);
  }
  refreshStates();
});
