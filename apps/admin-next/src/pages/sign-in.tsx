import { CONFIG } from 'src/config-global';

import { SignInSimpleView } from 'src/sections/auth/sign-in-simple-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Sign in - ${CONFIG.appName}`}</title>
      <meta
        name="description"
        content="Sign in to the Exxonim admin dashboard to manage content, clients, and site settings."
      />

      <SignInSimpleView />
    </>
  );
}
