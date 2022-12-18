import { component$, PropFunction, Signal, useSignal, useTask$ } from "@builder.io/qwik";

export const calculateRange = (
  data: unknown[],
  rowsPerPage: number,
  currentPage: Signal<number>,
  maxDisplayedButtons: number = 5
) => {
  const range = [];
  // Fail if maxDisplayedButtons is even or less than 5
  if (maxDisplayedButtons % 2 === 0 || maxDisplayedButtons < 5) {
    throw new Error("maxDisplayedButtons must be an odd number greater than 5");
  }
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const result = [];
  if (totalPages <= maxDisplayedButtons) {
    for (let i = 1; i <= totalPages; i++) {
      result.push(i);
    }
  } else {
    // If the current page is less than or equal to the maxDisplayedButtons / 2
    // Then the first button should be 1
    // And the last button should be maxDisplayedButtons
    if (currentPage.value <= Math.floor(maxDisplayedButtons / 2)) {
      for (let i = 1; i <= maxDisplayedButtons; i++) {
        result.push(i);
      }
    } else if (
      currentPage.value >=
      totalPages - Math.floor(maxDisplayedButtons / 2)
    ) {
      // If the current page is greater than or equal to the total pages minus the maxDisplayedButtons / 2
      // Then the first button should be the total pages minus the maxDisplayedButtons
      // And the last button should be the total pages
      for (let i = totalPages - maxDisplayedButtons + 1; i <= totalPages; i++) {
        result.push(i);
      }
    } else {
      // Otherwise, the first button should be the current page minus the maxDisplayedButtons / 2
      // And the last button should be the current page plus the maxDisplayedButtons / 2
      for (
        let i = currentPage.value - Math.floor(maxDisplayedButtons / 2);
        i <= currentPage.value + Math.floor(maxDisplayedButtons / 2);
        i++
      ) {
        result.push(i);
      }
    }
  }
  return result;
};

export const sliceData = <T extends unknown>(
  data: T[],
  page: number,
  rowsPerPage: number
) => {
  return data.slice((page - 1) * rowsPerPage, page * rowsPerPage);
};

const Table = component$(
  <T extends Record<string, string | number>>({
    data,
    rowsPerPage,
    onRestore$,
  }: {
    data: T[];
    rowsPerPage: number;
    onRestore$: PropFunction<(element: T) => void>;
  }) => {
    const page = useSignal(1);

    const tableRange = calculateRange(data, rowsPerPage, page, 7);
    const slice = useSignal<T[]>([]);

    useTask$(({ track }) => {
      track(() => page.value);
      const newSlice = sliceData(data, page.value, rowsPerPage);
      slice.value = [...newSlice];
    });

    return (
      <>
        <table>
          <thead>
            <tr>
              {Object.keys(data[0]).map((elem) => (
                <th class="p-1">{elem}</th>
              ))}
              <th class="p-1">Restore</th>
            </tr>
          </thead>
          <tbody>
            {slice.value.map((el) => (
              <tr>
                {Object.values(el).map((elem) => (
                  <td class="p-1">{elem}</td>
                ))}
              <td class="p-1"><button onClick$={() => onRestore$(el)}>Restore</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div class="mt-2">
          {tableRange.map((el, index) => (
            <button
              key={index}
              disabled={page.value === el}
              className={`m-1 rounded bg-slate-100 dark:bg-slate-700 w-8 h-8 disabled:bg-blue-500 dark:disabled:bg-blue-500`}
              onClick$={() => {
                page.value = el;
              }}
            >
              {el}
            </button>
          ))}
        </div>
      </>
    );
  }
);

export default Table;
