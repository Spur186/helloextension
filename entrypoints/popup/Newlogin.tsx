import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import './App.css';
 
type NewLoginProps = {
  addPassword: (password: string) => void;
};

function NewLogin({ addPassword }: NewLoginProps) {
  const [newPass, setnewPass] = useState('');
return (
  <div>
    <h4>Please create your parental password:</h4>

    <div className="input-container">
      <input
        type="password"
        placeholder="Type here"
        value={newPass}
        onChange={(event) => setnewPass(event.target.value)}
      />

      <button
        type="button"
        onClick={() => addPassword(newPass)}
        className="enter-icon2"
        aria-label="Create password"
      >
        <ArrowRight size={20} />
      </button>
    </div>
  </div>
);
}
export default NewLogin;
