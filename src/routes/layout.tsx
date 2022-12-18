import { component$, Slot } from "@builder.io/qwik";
//import Header from '../components/header/header';

export default component$(() => {
  return (
    <>
      <main>
        {/*<Header />*/}
        <section>
          <Slot />
        </section>
      </main>
      <footer>
        <span class="absolute bottom-4 right-4 text-gray-600 dark:text-gray-600">
          Powered by Citadel
        </span>
      </footer>
    </>
  );
});
