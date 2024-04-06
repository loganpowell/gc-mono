import { useState, useRef, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Card } from "@ui/card";
import { getVideos, uploadVideo, deleteVideo } from "@actions";

import FlashMessage from "@components/FlashMessage";

const Home = () => {
  const [file, setFile] = useState(null as File | null);
  const [metadata, setMetadata] = useState({});
  // @ts-ignore
  const { state, dispatch } = useOutletContext();
  const fileInputRef = useRef(null as HTMLFormElement["file"]);

  const clearForm = () => {
    fileInputRef.current.value = "";
    setFile(null);
    setMetadata({});
  };

  useEffect(() => {
    getVideos(dispatch);
  }, []);

  useEffect((): void => {
    if (Object.keys(state.flashMessage).length < 1) return;

    const timeout = setTimeout(() => {
      dispatch({ type: "CLEAR_FLASH_MESSAGE" });
    }, state.flashMessage.flashDuration);

    // @ts-ignore
    return () => {
      clearTimeout(timeout);
    };
  }, [state.flashMessage]);

  if (state.uploadingVideo) return <span className="bulma-loader-mixin"></span>;

  return (
    <div className="Home">
      {Object.keys(state.flashMessage).length > 0 && (
        <FlashMessage {...state.flashMessage} />
      )}
      <h1 className="title block">Hello {`${state.user?.profile?.name}`}</h1>
      <h2 className="subtitle block">Upload Content</h2>
      <div className="file has-name is-boxed">
        <label className="file-label">
          <input
            className="file-input"
            type="file"
            // files={[file]}
            ref={fileInputRef}
            onChange={(e) => {
              setFile(e.target?.files ? e.target.files[0] : null);
            }}
          />
          <span className="file-cta">
            <span className="file-icon">
              <i className="fas fa-upload"></i>
            </span>
            <span className="file-label">Choose a file…</span>
          </span>
          {file && <span className="file-name">{file.name}</span>}
        </label>
      </div>
      {file && (
        <div className="metadata">
          <div className="field">
            <div className="control">
              <input
                onChange={(e) =>
                  setMetadata({ ...metadata, [e.target.name]: e.target.value })
                }
                className="input"
                type="text"
                name="title"
                placeholder="title"
              />
            </div>
          </div>
          <div className="field">
            <div className="control">
              <input
                onChange={(e) =>
                  setMetadata({ ...metadata, [e.target.name]: e.target.value })
                }
                className="input"
                type="text"
                name="description"
                placeholder="description"
              />
            </div>
          </div>
          <div className="field">
            <div className="control">
              <input
                onChange={(e) =>
                  setMetadata({ ...metadata, [e.target.name]: e.target.value })
                }
                className="input"
                type="text"
                name="keywords"
                placeholder="keywords"
              />
            </div>
          </div>
          <div className="actions">
            <button
              className="button is-link"
              onClick={() => {
                uploadVideo(dispatch, {
                  file,
                  metadata,
                  language: window.navigator.language,
                });
                clearForm();
              }}
            >
              Upload
            </button>
            <button
              className="button"
              onClick={() => {
                clearForm();
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <h2 className="subtitle block uploads">Your uploads</h2>
      <div className="card">
        <div className="">
          <h2 className="">Approved Content</h2>
          {!state.uploads?.approved?.length ? (
            <div className="no-videos">No approved videos</div>
          ) : (
            state?.uploads.approved?.map((u, index) => {
              const metadata = JSON.parse(u.metadata);

              return (
                <div key={index} className="flex flex-col max-w-xl md:mx-auto">
                  <div className="video">
                    <Card
                      video={`${process.env.API_URI}/v1/stream/${u.filename}`}
                      title={metadata.title}
                      description={metadata.description}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      <div className="card pending">
        <div className="card-content">
          <h2 className="title">Pending Approval</h2>
          {!state.uploads?.pending?.length ? (
            <div className="no-videos">No pending videos</div>
          ) : (
            state.uploads?.pending?.map((u, index) => {
              const metadata = JSON.parse(u.metadata);

              return (
                <div key={index} className="UploadedVideo">
                  <div className="flex-container">
                    <div className="subtitle">{metadata.title}</div>
                    <div className="delete-button">
                      <button
                        className="delete is-large"
                        onClick={() => deleteVideo(dispatch, u.id)}
                      ></button>
                    </div>
                  </div>
                  <div className="video">
                    <video
                      src={`${process.env.API_URI}/v1/stream/${u.filename}`}
                      controls
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
