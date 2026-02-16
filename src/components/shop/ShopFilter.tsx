import { Filter, Filters } from "src/types";

type ShopFilterT = {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
};

type AccordionFilterT = ShopFilterT & {
  filter: Filter;
};

type AccordionItemI = AccordionFilterT & {
  optionKey: string;
  optionVal: boolean;
};

export function ShopFilter({ filters, setFilters }: ShopFilterT) {
  return (
    <div className="vpet-shop-filter">
      {filters?.map((filter) => {
        return (
          <AccordionFilter
            filter={filter}
            filters={filters}
            setFilters={setFilters}
            key={filter.category}
          />
        );
      })}
    </div>
  );
}

const AccordionFilter = ({ filter, filters, setFilters }: AccordionFilterT) => {
  return (
    <div className="vpet-accordion">
      <div
        className="vpet-accordion__info"
        onClick={() => {
          // Set the isOpen value in the filter to the opposite
          const newFilters = filters.map((filterMapped) =>
            filterMapped === filter
              ? { ...filterMapped, isOpen: !filterMapped.isOpen }
              : filterMapped,
          );
          setFilters(newFilters);
        }}
      >
        <h3>{filter.category}</h3>
        <span>{">"}</span>
      </div>
      <ul
        className={
          filter.isOpen
            ? "vpet-accordion__content"
            : "vpet-accordion__content vpet-accordion__content_closed"
        }
      >
        {Object.entries(filter.options).map(([optionKey, optionVal]) => (
          <AccordionItem
            filter={filter}
            filters={filters}
            setFilters={setFilters}
            optionKey={optionKey}
            optionVal={optionVal}
            key={optionKey}
          />
        ))}
      </ul>
    </div>
  );
};

const AccordionItem = ({
  filter,
  filters,
  setFilters,
  optionKey,
  optionVal,
}: AccordionItemI) => {
  return (
    <li className="vpet-accordion__item" key={optionKey}>
      <input
        type={"checkbox"}
        checked={optionVal}
        onChange={() => {
          // Changes the filter option
          const newFilter = {
            ...filter,
            options: {
              ...filter.options,
              [optionKey]: !filter.options[optionKey],
            },
          };
          const newFilters = filters.map((filter) =>
            filter.category === newFilter.category ? newFilter : filter,
          );
          setFilters(newFilters);
        }}
      />
      <span>{optionKey}</span>
    </li>
  );
};
