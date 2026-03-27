import { CONFIG } from 'src/config-global';

import { AdminWorkspaceView } from 'src/sections/admin/view/admin-workspace-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Admin Workspace - ${CONFIG.appName}`}</title>
      <meta
        name="description"
        content="Material Kit powered study workspace for Exxonim admin flows."
      />

      <AdminWorkspaceView />
    </>
  );
}
