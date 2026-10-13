import { useState, useEffect } from 'react';
import reactLogo from '@/assets/react.svg';
import wxtLogo from '/wxt.svg';
import './App.css';
import NewLogin from './Newlogin.tsx';
import { ArrowRight, Lock, LockOpen,CircleSlash,ChevronDown } from 'lucide-react';
function App() {
  //almost all state variables created here
  const [website,setWebsite] = useState('');
  const [blockedSites,setblockedsites] = useState<string[]>([]);
  const [passwordInput,setPasswordInput] = useState('')
  const [isLocked,setIsLocked] = useState<boolean>(true);
  const [password,setPassword] = useState('')
  const [password_list,setpassword_list] = useState<string[]>([]);
  const [showNewLogin, setShowNewLogin] = useState(false);
  const [showBlockedSites, setShowBlockedSites] = useState(false);
  const [redirectSite, setRedirectSite] = useState('');
  const [redirectSites, setRedirectSites] = useState<string[]>([]);
  const [showRedirectSites, setShowRedirectSites] = useState(false);
  const  handleClick = () => {
    setShowNewLogin(true);

  };

//useeffect for inital loading of blocked and redirect sites from browser storage
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
useEffect(() => {
  loadRedirectSites();
}, []);
//almost all functions for adding, deleting, and loading blocked and redirect sites are created here
async function loadRedirectSites() {
  const result = await browser.storage.local.get('redirectSites');

  setRedirectSites(
    (result.redirectSites as string[] | undefined) ?? []
  );
}

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
//this one communicates with newlogin to add passwords to the password list, the ! is j so theres no duplicates and stuff
async function addPassword (newPass:string){
  if (!password_list.includes(newPass)){
    setpassword_list(prev => [...prev, newPass]);
    setShowNewLogin(false);

  }
 
}
async function addRedirectSite() {
  if (redirectSite.trim() === '') return;

  let url: URL;

  try {
    url = new URL(
      redirectSite.startsWith('http')
        ? redirectSite
        : `https://${redirectSite}`
    );

    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error('Invalid protocol');
    }
  } catch {
    alert('Enter a valid website URL');
    return;
  }

  const result = await browser.storage.local.get('redirectSites');

  const sites = (result.redirectSites as string[] | undefined) ?? [];

  if (!sites.includes(url.href)) {
    const updatedSites = [...sites, url.href];

    await browser.storage.local.set({
      redirectSites: updatedSites,
    });

    setRedirectSites(updatedSites);
  }

  setRedirectSite('');
}
async function deleteRedirectSites() {
  await browser.storage.local.set({
    redirectSites: [],
  });

  setRedirectSites([]);
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

      

      <div className="input-container">
        <input
          type="text"
          placeholder="Website to be blocked"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />

        <button
          className="enter-icon"
          onClick={addWebsite}
          aria-label="Block website"
        >
          <CircleSlash size={20} />
        </button>
      </div>

      <div className="dropdown-container">
        <button
          className="dropdown-button"
          onClick={() => setShowBlockedSites(!showBlockedSites)}
          aria-expanded={showBlockedSites}
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

      

      <div className="input-container">
        <input
          type="text"
          placeholder="Website to redirect to"
          value={redirectSite}
          onChange={(event) => setRedirectSite(event.target.value)}
        />

        <button
          className="enter-icon"
          onClick={addRedirectSite}
          aria-label="Add redirect website"
        >
          <ArrowRight size={20} />
        </button>
      </div>

      <div className="dropdown-container">
        <button
          className="dropdown-button"
          onClick={() => setShowRedirectSites(!showRedirectSites)}
          aria-expanded={showRedirectSites}
        >
          Redirect Websites ({redirectSites.length})

          <ChevronDown
            size={18}
            className={showRedirectSites ? 'rotate' : ''}
          />
        </button>

        {showRedirectSites && (
          <div className="dropdown-content">

            <ul className="dropdown-list">
              {redirectSites.length === 0 ? (
                <li>No redirect websites</li>
              ) : (
                redirectSites.map((site, index) => (
                  <li key={index}>{site}</li>
                ))
              )}
            </ul>

            <button
              className="clear-list-button"
              onClick={deleteRedirectSites}
              disabled={redirectSites.length === 0}
            >
              Clear List
            </button>


          </div>
          
        )}
                    <button onClick = {() => {
              setIsLocked(true)
              browser.storage.session?.set({
                unlocked: false
              });
            }} className="lock-button">

              Lock app?
            </button>
      </div>

    </div>
  </>
);
}



export default App;
