import { useState, useRef, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

import { getVideos } from '@actions';

import './styles.css';

const Home = () => {
  const [file, setFile] = useState(null);
  const [metadata, setMetadata] = useState({});
  const [uploadStatus, setUploadStatus] = useState(null);
  const { state, dispatch } = useOutletContext();
  const fileInputRef = useRef(null);
  const [uploads, setUploads] = useState({});

  useEffect(() => {
    let ignore = false;

    const setVids = async () => {
      const json = await getVideos(dispatch);
      const grouped = json.reduce((r, v) => {
        r[v.status] ||= [];
        r[v.status].push(v);

        return r;
      }, {});

      if (!ignore) setUploads(grouped);
    }

    setVids();

    return () => {
      ignore = true;
    };
  }, [uploads.length]);

  return (
    <div className="Home">
      { uploadStatus === 'success' &&
        <div className="upload-status">Uploaded successfully!</div>
      }
      <h1 className="title block">Hello {`${state.user?.profile?.name}`}</h1>
      <h2 className="subtitle block">Upload Content</h2>
      <div className="file has-name is-boxed">
        <label className="file-label">
          <input className="file-input" type="file" files={[file]} ref={fileInputRef} onChange={e => {
            setFile(e.target.files[0])
          }} />
            <span className="file-cta">
              <span className="file-icon">
                <i className="fas fa-upload"></i>
              </span>
              <span className="file-label">
                Choose a file…
              </span>
            </span>
            {
              file &&
              <span className="file-name">{file.name}</span>
            }
        </label>
      </div>
      {file &&
       <div className="metadata">
         <div className="field">
           <div className="control">
             <input onChange={e => setMetadata({...metadata, [e.target.name]: e.target.value}) } className="input" type="text" name="title" placeholder="title" />
           </div>
         </div>
         <div className="field">
           <div className="control">
             <input onChange={e => setMetadata({...metadata, [e.target.name]: e.target.value}) } className="input" type="text" name="description" placeholder="description" />
           </div>
         </div>
         <div className="field">
           <div className="control">
             <input onChange={e => setMetadata({...metadata, [e.target.name]: e.target.value}) } className="input" type="text" name="keywords" placeholder="keywords" />
           </div>
         </div>
         <div className="actions">
           <button className="button is-link" onClick={() => {
             const formData = new FormData();
             formData.append('file', file);
             formData.append('metadata', JSON.stringify({...metadata, language: window.navigator.language}));

             fetch(
               `${process.env.API_URI}/v1/videos`,
               {
                 method: 'POST',
                 credentials: 'include',
                 body: formData
               }
             ).then(async response => {
               if (response.ok) {
                 setUploadStatus('success');
                 return await response.json();
               }

               else {
                 setUploadStatus('failure');
               }
             })
           }}>Upload</button>
           <button className="button" onClick={() => {
             setFile(null);
             fileInputRef.current.value = null
           }
           }>Cancel</button>
         </div>
       </div>
      }
      <h2 className="subtitle block uploads">Your uploads</h2>
      <div className="card">
        <div className="card-content">
          <h2 class="title">Approved Content</h2>
          {!uploads.approved?.length ? <div className="no-videos">No approved videos</div>
          : uploads.approved?.map((u, index) => {
            const metadata = JSON.parse(u.metadata);

            return (
              <div key={index} className="UploadedVideo">
                <div className="subtitle">{metadata.title}</div>
                <div className="video"><video src={`https://gaza-care.com/${u.filename}`} controls /></div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="card pending">
        <div className="card-content">
          <h2 class="title">Pending Approval</h2>
          {!uploads.pending?.length ? <div className="no-videos">No pending videos</div> : uploads.pending?.map((u, index) => {
            const metadata = JSON.parse(u.metadata);

            return (
              <div key={index} className="UploadedVideo">
                <div className="subtitle">{metadata.title}</div>
                <div className="video"><video src={`https://gaza-care.com/${u.filename}`} controls /></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
