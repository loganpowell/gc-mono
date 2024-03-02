import { useState } from 'react';

const Home = () => {
  const [file, setFile] = useState(null);
  const [metadata, setMetadata] = useState({});

  return (
    <div className="Home">
      <h1>Upload a video:</h1>
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      {file &&
       <div>
         <input onChange={e => setMetadata({...metadata, [e.target.name]: e.target.value}) } className="input" type="text" name="title" placeholder="title" />
         <input onChange={e => setMetadata({...metadata, [e.target.name]: e.target.value}) } className="input" type="text" name="description" placeholder="description" />
         <input onChange={e => setMetadata({...metadata, [e.target.name]: e.target.value}) } className="input" type="text" name="keywords" placeholder="keywords" />
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
           )
         }}>Upload</button>
       </div>
      }
    </div>
  );
};

export default Home;
