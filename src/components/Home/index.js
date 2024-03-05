import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';

import './styles.css';

const Home = () => {
  const [file, setFile] = useState(null);
  const [metadata, setMetadata] = useState({});
  const [uploadStatus, setUploadStatus] = useState(null);
  const { state, dispatch } = useOutletContext();

  return (
    <div className="Home">
      { uploadStatus === 'success' &&
        <div className="upload-status">Uploaded successfully!</div>
      }
      <h1>Hello {`${state.user.name}, `}Upload a video:</h1>
      <input type="file" onChange={e => setFile(e.target.files[0])} />
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
         <button onClick={() => {
           const formData = new FormData();
           formData.append('file', file);
           formData.append('metadata', JSON.stringify(metadata));

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
       </div>
      }
    </div>
  );
};

export default Home;
