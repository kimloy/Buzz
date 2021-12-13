import React from "react";
import { useState, useEffect } from "react";
import { sampleData } from "./data";
import './App.scss';

// const filterForUrl = (url, data) => {
//   let result = false;
//   for(let key in data){
//     if(key.url === url){
//       result = true; 
//     }
//   }
//  }

const getBuzzDataByUrl = (url) => {
  const hasData = sampleData.length;
  if (!url || !hasData) {
    const status = !url ? 500 : 404;
    return {
      body: "",
      json: () => {
        return "";
      },
      status: status,
      ok: false
    };
  }
  const data = sampleData.pop();
  return {
    body: JSON.stringify(data),
    json: () => {
      return data;
    },
    status: 201,
    ok: true
  };
};

const initialState = {
  label: "",
  links: [],
  lookupUrl: "",
  mode: "builder",
  disableSubmit: true,
  error: true, 
  validation: {
    label: true,
    labelError: "",
    articleUrl: true,
    articleError: "",
  },
};

/**
 * Components
 */
const Error = ({ error }) => {
  return (
    <div className="page-message page-message--error xs-mb2">
      <svg
        className="page-message__icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 38 38"
        aria-hidden="true"
      >
        <title>Error</title>
        <path d="M19 16.878l-6.364-6.363-2.12 2.12L16.878 19l-6.365 6.364 2.12 2.12L19 21.122l6.364 6.365 2.12-2.12L21.122 19l6.365-6.364-2.12-2.12L19 16.877z" />
      </svg>
      <div>{error}</div>
    </div>
  );
};

const Links = ({ links, handleDelete }) => {
  const linkItems = links.map((link) => {
    return (
      <li key={link.id} className="bold xs-my1 xs-flex xs-flex-justify-space-between xs-col-12">
        <div className="xs-border xs-mr1 xs-p1">{link.title}</div>
        <div className="xs-border xs-flex xs-flex-align-center xs-p1" onClick={() => {handleDelete(link.id)}}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 38 38"
            className="svg-4 svg-black"
            aria-hidden="true"
          >
            <title>Trash</title>
            <path d="M32.9 7H26V6c0-3.3-2.7-6-6-6h-2c-3.3 0-6 2.7-6 6v1H5c-1.1 0-2 .9-2 2s.9 2 2 2h1l1.1 27h23.8l1.3-27h.7c1.1 0 2-.9 2-2s-.8-2-2-2zM15 6c0-1.7 1.3-3 3-3h2c1.7 0 3 1.3 3 3v1h-8V6zm12 29H11l-1-24h18l-1 24zm-12.5-4.4l-.8-15c0-.9.6-1.6 1.5-1.6.8 0 1.5.6 1.5 1.4l.8 15c0 .9-.6 1.6-1.5 1.6-.8 0-1.5-.6-1.5-1.4zm6-.2l.8-15c0-.8.7-1.4 1.5-1.4.9 0 1.5.7 1.5 1.6l-.8 15c0 .8-.7 1.4-1.5 1.4s-1.5-.7-1.5-1.6z" />
          </svg>
        </div>
      </li>
    );
  });

  return (
    <div>
      <ul className="list-unstyled">{linkItems}</ul>
    </div>
  );
};

const Preview = ({ state, handleEdit }) => {
  const linkItems = state.links.map((link) => {
    return (
      <li className="bfp-related-links__list-item" key={link.id}>
        <a href={link.url} className="bfp-related-links__link">
          {link.title}
        </a>
        <span className="bfp-related-links__meta">
          <span className="bfp-related-links__author">{link.author}</span>{" "}
          <span aria-hidden="true">&middot;</span> {link.published}
        </span>
      </li>
    );
  });
  return (
    <div className="xs-p1">
      <aside className="bfp-related-links">
        <h2 className="bfp-related-links__title">{state.label}</h2>
        <ul className="bfp-related-links__list">{linkItems}</ul>
      </aside>
      <button type="button" className="button" onClick={handleEdit}>
        Edit
      </button>
    </div>
  );
};

const Builder = ({
  handleUrlLookup,
  handleLabelChange,
  onUrlChange,
  onLabelBlur,
  onUrlBlur,
  handleSave,
  handleDelete,
  handleEdit,
  state
}) => {
  return (
    <div className="xs-col-5 xs-p1">
      <header className="md-mb4">
        <h2 className="xs-text-2 bold">Related Links Builder</h2>
      </header>
      <form>
        {state.error ? <Error error={state.error} /> : ""}
        <div className="xs-col-12">
          <label className="form-label clearfix">
            Label<span className="text-red">*</span>
          </label>
          <input id={`labelInput ${state.validation.label ? "" : "error"}`} onChange={handleLabelChange} onBlur={onLabelBlur} type="text" className={`text-input xs-col-12`} autoFocus></input>
          <p className="xs-text-6 text-gray-lightest xs-mt1">
            You can try something like "Olympic Highlights"
          </p>
        </div>

        <div className="xs-col-12 xs-my2">
          <label htmlFor="url" className="form-label">
            Article URL<span className="text-red">*</span>
          </label>

          <p className="md-mb1">3-4 links recommended.</p>
          {state.links.length ? <Links links={state.links} handleDelete={handleDelete} /> : ""}
          <div className="xs-flex xs-flex-justify-space-between">
            <input
              id={`urlInput ${state.validation.articleUrl ? "" : "error"}`}
              type="url"
              className="text-input col xs-col-9 xs-mr1"
              placeholder="https://www.buzzfeed.com/..."
              onChange={onUrlChange}
              onBlur={onUrlBlur}
              autoFocus
            ></input>
            <button
              type="button"
              className="button button--secondary xs-col-3"
              onClick={handleUrlLookup}
            >
              + Add Article
            </button>
          </div>
        </div>
        <footer className="xs-flex xs-flex-justify-end">
          <button type="button" className="button button--secondary">
            Cancel
          </button>
          <button type="button" className="button xs-ml1" disabled={state.disableSubmit} onClick={handleSave}>
            Save
          </button>
        </footer>
      </form>
    </div>
  );
};

const App = () => {
  const [state, setState] = useState(initialState);

  const handleUrlLookup = () => {
    const response = getBuzzDataByUrl(state.lookupUrl);
    setState({
      ...state,
      links: [...state.links, response.json()]
    });
  };

  const onUrlChange = (e) => {
    setState({ ...state, lookupUrl: e.target.value });
  };

  const handleSave = () => {
    setState({ ...state, mode: "preview" });
  };

  const handleEdit = () => {
    setState({ ...state, mode: "builder" });
  };

  const handleLabelChange = (e) => {
    setState({ ...state, label: e.target.value})
  }

  const labelOnBlur = () => {
    validateLabel();
   }

   const articleOnBlur = () => {
     validateUrl();
   }

   const validateUrl = () => { 
    // eslint-disable-next-line no-useless-escape
    const urlRegex =  /^((http|https):\/\/)?(www.)?(?!.*(http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+(\/)?.([\w\?[a-zA-Z-_%\/@?]+)*([^\/\w\?[a-zA-Z0-9_-]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/;
    
    if(!state.lookupUrl){
      setState({...state, validation: {...state.validation, articleUrl: false, articleError: "A url is required"}})
    }
    else if(!state.lookupUrl.match(urlRegex)){
      setState({...state,  validation: {...state.validation, articleUrl: false, articleError: "A real url is required"}});
    } else {
      setState({...state, validation: {...state.validation, articleUrl: true, articleError: ""}})
    }
   }

   const validateLabel = () => {
     if(state.label){
       setState({...state, validation:{...state.validation, label: true, labelError: ""} })
     } else {
       setState({...state, validation: {...state.validation, label: false, labelError: "A label is required."}})
     }
   }

   const handleDeleteLink = (id) => {
    const currState = state;
    const indexOfLink = currState.links.indexOf(id);
    currState.links.splice(indexOfLink, 1);
    setState({...state, links: currState.links});
   }

   useEffect(() => {
    const disableSubmit = !(state.validation.label && state.validation.articleUrl);
    setState({...state, disableSubmit: disableSubmit}); 
   }, [state.validation])

  return (
    <div className="lg-flex lg-flex-justify-center xs-py1 xs-px1 lg-px0">
      {state.mode === "builder" ? (
        <Builder
          state={state}
          handleUrlLookup={handleUrlLookup}
          onLabelBlur={labelOnBlur}
          onUrlBlur={articleOnBlur}
          onUrlChange={onUrlChange}
          handleSave={handleSave}
          handleDelete={handleDeleteLink}
          handleLabelChange={handleLabelChange}
        />
      ) : (
        <Preview state={state} handleEdit={handleEdit} />
      )}
    </div>
  );
};

export default App;
