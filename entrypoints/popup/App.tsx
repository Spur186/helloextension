import { useState, useEffect } from 'react';
import reactLogo from '@/assets/react.svg';
import wxtLogo from '/wxt.svg';
import './App.css';
import NewLogin from './Newlogin.tsx';
import { ArrowRight, Lock, LockOpen,CircleSlash,ChevronDown } from 'lucide-react';
function App() {
  const [website,setWebsite] = useState('');
  const [blockedSites,setblockedsites] = useState<string[]>([]);
  const [passwordInput,setPasswordInput] = useState('')
  const [isLocked,setIsLocked] = useState<boolean>(true);
  const [password,setPassword] = useState('')
  const [password_list,setpassword_list] = useState<string[]>([]);
  const [showNewLogin, setShowNewLogin] = useState(false);
  const [showBlockedSites, setShowBlockedSites] = useState(false);
  const  handleClick = () => {
    setShowNewLogin(true);

  };


  useEffect(() => {
    loadBlockedSites();
  }, []);
  useEffect(() => {
    browser.storage.session?.get(["unlocked"], (result) => {
      if (result.unlocked) {
        setIsLocked(false);
      }
    });
  }, []);


async function loadBlockedSites() {
    const result = await browser.storage.local.get('blockedSites');

    const sites = (result.blockedSites as string[] | undefined) ?? [];
    setblockedsites(sites);
  }
//Adds website to array, and puts that array into browserstoragelocal
async function addWebsite() {
    if (website.trim() === '') {
      return;
    }

    const result = await browser.storage.local.get('blockedSites');

    const sites = (result.blockedSites as string[] | undefined) ?? [];
    sites.push(website);

    await browser.storage.local.set({
      blockedSites: sites,
    });

  setblockedsites(sites);
  setWebsite('');
}
async function deletewebsite (){
  setblockedsites([])
  await browser.storage.local.set({
      blockedSites:[],
    });
}
async function EnterSite (){
  if (password_list.includes(passwordInput)){
    await browser.storage.session.set({
      unlocked: true
    });
      setIsLocked(false) 

  }else {
    alert("Invalid Password")
  }

}
async function addPassword (newPass:string){
  if (!password_list.includes(newPass)){
    setpassword_list(prev => [...prev, newPass]);
    setShowNewLogin(false);

  }
 
}
    if (showNewLogin) {
    return <NewLogin addPassword={addPassword} />;
  }

if (isLocked) {
  return(
  
    <div className="input-container">
      <div className={`lock-icon ${isLocked ? 'locked' : 'unlocked'}`}>
  {isLocked ? <Lock size={32} /> : <LockOpen size={32} />}
</div>
      <h1>Welcome</h1>
        <input
          type="password"
          placeholder="Enter password"
          value={passwordInput}
          onChange={(event) => setPasswordInput(event.target.value)}
        />
  <button
    className="enter-icon"
    onClick={EnterSite}
    aria-label="Enter"
  >
    <ArrowRight size={20} />
  </button>
        <button className = "NewHereButton" onClick={handleClick}>
          <span style={{ textDecoration: 'underline' }}>New here?</span>
        </button>
     </div>
  )
}
return (
    <>
      <div className="login-container">
      <input type="text"
      placeholder='Website to be blocked'
      value = {website}
      onChange={(event) => setWebsite(event.target.value)}
      />
  <button
    className="enter-icon3"
    onClick={addWebsite}
    aria-label="Enter"
  >
    <CircleSlash size={20} />
  </button>
<div className="dropdown-container">
  <button
    className="dropdown-button"
    onClick={() => setShowBlockedSites(!showBlockedSites)}
  >
    Blocked Websites ({blockedSites.length})
    <ChevronDown
      size={18}
      className={showBlockedSites ? 'rotate' : ''}
    />
  </button>

  {showBlockedSites && (
    <div className="dropdown-content">
      <ul className="dropdown-list">
        {blockedSites.length === 0 ? (
          <li>No blocked websites</li>
        ) : (
          blockedSites.map((site, index) => (
            <li key={index}>{site}</li>
          ))
        )}
      </ul>

      <button
        className="clear-list-button"
        onClick={deletewebsite}
        disabled={blockedSites.length === 0}
      >
        Clear List
      </button>
    </div>
  )}
</div>
  
      </div>
      

    </>
  );
}



export default App;
