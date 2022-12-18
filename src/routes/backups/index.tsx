import { component$, Resource } from "@builder.io/qwik";
import {
  DocumentHead,
  RequestHandler,
  useEndpoint,
} from "@builder.io/qwik-city";
import { InputCopy } from "~/components/input-copy/input-copy";
import Table from "~/components/table/Table";

export const onGet: RequestHandler<{
  backupId: string;
  history: {
    "Created at": string;
    "Backup ID": string;
}[];
}> = async (req) => {
  const { deriveEntropy } = await import("~/utils/backups");
  const { parse } = await import("accept-language-parser");
  const langs = parse(req.request.headers.get("accept-language") || "en-US");
  const backupId = await deriveEntropy("app-lnd-backup-id");
  const backupHistory = await fetch(
    `https://account.runcitadel.space/api/get-backups`,
    {
      headers: new Headers({
        "Content-type": "application/json",
      }),
      body: JSON.stringify({
        name: backupId,
      }),
      method: "POST",
    }
  );
  const backupData = (await backupHistory.json()) as {
    data: {
      created_at: string;
      key: string;
      backup_id: string;
    }[];
  };
  return {
    backupId,
    history: backupData.data.map((backup) => ({
      "Created at": new Date(backup.created_at).toLocaleString(langs[0].code || "en-US"),
      "Backup ID": backup.backup_id,
    })),
  };
};

export default component$(() => {
  const backupData = useEndpoint<typeof onGet>();
  return (
    <div class="h-screen w-screen flex flex-col justify-center items-center text-center dark:bg-slate-900 dark:text-white">
      <h1 class="font-bold text-3xl mx-6 mb-6">Manage backups</h1>
      <p class="mx-6 mb-8 max-w-md">
        We are automatically backing up your channels every time you open/close
        a new channel and at random intervals. You can view previous backups
        here and restore them.
      </p>
      <Resource
        value={backupData}
        onPending={() => (
          <table class="max-h-[80vh] overflow-scroll">
            <tr>
              <th>Backup ID</th>
              <th>Date</th>
              <th>Restore</th>
            </tr>
            <tr>
              <td>Loading</td>
              <td>Loading</td>
              <td>Loading</td>
            </tr>
          </table>
        )}
        onRejected={() => (
          <table class="max-h-[80vh] overflow-scroll">
            <tr>
              <th>Backup ID</th>
              <th>Date</th>
              <th>Restore</th>
            </tr>
            <tr>
              <td>Loading</td>
              <td>Loading</td>
              <td>Loading</td>
            </tr>
          </table>
        )}
        onResolved={(backup) => {
          return <Table data={backup.history} rowsPerPage={10} onRestore$={() => {alert("TODO!");} } />;
        }}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "LND on Citadel",
};
