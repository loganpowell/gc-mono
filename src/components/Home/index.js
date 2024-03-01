import { useState } from 'react';

const Home = () => {
  const [file, setFile] = useState(null);

  return (
    <div className="Home">
      <h1>Upload a video:</h1>
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      {file &&
       <button onClick={() => {
         const formData = new FormData();
         formData.append('file', file);

         fetch(
           `${process.env.API_URI}/v1/videos`,
           {
             method: 'POST',
             body: formData
           }
         )
       }}>Upload</button>
      }
    </div>
  );
};

export default Home;
