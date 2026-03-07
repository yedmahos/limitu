import fs from 'fs';

let auth = fs.readFileSync('c:/Users/soham/OneDrive/Desktop/coding/lim/app/src/pages/Auth.jsx', 'utf8');

// For SignIn
let signin = auth.replace('export default function Auth() {', 'export default function SignIn() {\n  const isSignUp = false;');
signin = signin.replace('const [isSignUp, setIsSignUp] = useState(false);', '');

const modeToggleRegex = /\{\/\*\s*Mode toggle pills\s*\*\/\s*\}[\s\S]*?(?=\{\/\*\s*Heading\s*\*\/\s*\})/;

const signInToggle = `{\/\* Mode toggle pills \*\/}
            <div className="flex bg-bone/[0.03] rounded-2xl p-1 mb-10 border border-bone/[0.04]">
              <div className="flex-1 py-2.5 text-center rounded-xl font-display font-bold text-[12px] tracking-wide transition-all duration-300 cursor-default bg-lime text-ink shadow-[0_2px_12px_rgba(200,241,53,0.15)]">
                Sign In
              </div>
              <Link to="/signup" className="flex-1 py-2.5 text-center rounded-xl font-display font-bold text-[12px] tracking-wide transition-all duration-300 cursor-pointer text-bone/30 hover:text-bone/50">
                Sign Up
              </Link>
            </div>

            `;
signin = signin.replace(modeToggleRegex, signInToggle);
fs.writeFileSync('c:/Users/soham/OneDrive/Desktop/coding/lim/app/src/pages/SignIn.jsx', signin);

// For SignUp
let signup = auth.replace('export default function Auth() {', 'export default function SignUp() {\n  const isSignUp = true;');
signup = signup.replace('const [isSignUp, setIsSignUp] = useState(false);', '');

const signUpToggle = `{\/\* Mode toggle pills \*\/}
            <div className="flex bg-bone/[0.03] rounded-2xl p-1 mb-10 border border-bone/[0.04]">
              <Link to="/signin" className="flex-1 py-2.5 text-center rounded-xl font-display font-bold text-[12px] tracking-wide transition-all duration-300 cursor-pointer text-bone/30 hover:text-bone/50">
                Sign In
              </Link>
              <div className="flex-1 py-2.5 text-center rounded-xl font-display font-bold text-[12px] tracking-wide transition-all duration-300 cursor-default bg-lime text-ink shadow-[0_2px_12px_rgba(200,241,53,0.15)]">
                Sign Up
              </div>
            </div>

            `;
signup = signup.replace(modeToggleRegex, signUpToggle);
fs.writeFileSync('c:/Users/soham/OneDrive/Desktop/coding/lim/app/src/pages/SignUp.jsx', signup);

console.log('Pages generated successfully!');
