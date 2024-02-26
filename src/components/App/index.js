import './styles.css';

import Logo from '@assets/images/logo.png';

const App = () => {
  return (
    <div className="App">
      <div className="logo">
        <img src={Logo} alt="gaza care logo" />
      </div>
      <div className="field">
        <div className="control">
          <input className="input" type="text" placeholder="search" />
        </div>  
      </div>
      <div className="videos">
        <video src="https://gaza-care.com/AR_UKR001_BURN_V4.03.mp4" />
      </div>
    </div>
  )
};

export default App;
