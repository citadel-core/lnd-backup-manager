import { component$, Resource } from "@builder.io/qwik";
import {
  DocumentHead,
  Link,
  RequestHandler,
  useEndpoint,
} from "@builder.io/qwik-city";
import { InputCopy } from "~/components/input-copy/input-copy";

export const onGet: RequestHandler<{ backupId: string }> = async () => {
  const { deriveEntropy } = await import("~/utils/backups");
  return {
    backupId: await deriveEntropy("app-lnd-backup-id"),
  };
};

export default component$(() => {
  const backupData = useEndpoint<{ backupId: string }>();
  return (
    <div class="h-screen w-screen flex flex-col justify-center items-center text-center dark:bg-slate-900 dark:text-white">
      <img src="/lnd-logo.png" class="m-8 max-h-40" />
      <h1 class="font-bold text-3xl mx-6 mb-6">
        Your Lightning node is running
      </h1>
      <p class="mx-6">
        Your node is now running and accessible through the Citadel dashboard
        and with various apps on your node.
      </p>
      <p class="mx-6">
        Your channels are automatically being backed up by us. Your backup ID is
        displayed below:
      </p>
      <Resource
        value={backupData}
        onPending={() => <InputCopy value={"Loading..."} />}
        onRejected={() => <div>Error</div>}
        onResolved={(backup) => <InputCopy value={backup.backupId} />}
      />
      <Link class="mt-4" href="/backups">
        Manage backups
      </Link>
    </div>
  );
});

export const head: DocumentHead = {
  title: "LND on Citadel",
};
