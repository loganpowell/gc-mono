import { useState, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';

import './styles.css';

const Home = () => {
  const [file, setFile] = useState(null);
  const [metadata, setMetadata] = useState({});
  const [uploadStatus, setUploadStatus] = useState(null);
  const { state, dispatch } = useOutletContext();
  const fileInputRef = useRef(null);

  return (
    <div className="Home">
      { uploadStatus === 'success' &&
        <div className="upload-status">Uploaded successfully!</div>
      }
      <h1 className="title block">Hello {`${state.user?.profile?.name}`}</h1>
      <h2 className="subtitle block">Upload Content</h2>
      <div class="file has-name is-boxed">
        <label class="file-label">
          <input class="file-input" type="file" files={[file]} ref={fileInputRef} onChange={e => {
            setFile(e.target.files[0])
          }} />
            <span class="file-cta">
              <span class="file-icon">
                <i class="fas fa-upload"></i>
              </span>
              <span class="file-label">
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
    </div>
  );
};

export default Home;
