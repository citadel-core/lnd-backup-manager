import { component$, Signal, useClientEffect$ } from "@builder.io/qwik";

const TableFooter = component$(
  <T extends unknown>({
    range,
    page,
    slice,
  }: {
    page: Signal<number>;
    slice: Signal<T[]>;
    range: Signal<number[]>;
  }) => {
    useClientEffect$(() => {
      if (slice.value.length < 1 && page.value !== 1) {
        page.value--;
      }
    });
    return (
      <div>
        {range.value.map((el, index) => (
          <button
            key={index}
            className={` ${
              page.value === index ? "active" : "styles.inactiveButton"
            }`}
            onClick$={() => {
              page.value = index;
            }}
          >
            {el}
          </button>
        ))}
      </div>
    );
  }
);

export default TableFooter;
