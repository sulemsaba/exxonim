import { CONFIG } from 'src/config-global';

import { NotFoundView } from 'src/sections/error';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Page not found | ${CONFIG.appName}`}</title>

      <NotFoundView />
    </>
  );
}
