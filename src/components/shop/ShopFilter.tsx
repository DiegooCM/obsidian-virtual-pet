import { useState } from "react";
import { Filter, Filters } from "src/types";

interface ShopFilterI {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

export function ShopFilter({filters, setFilters}: ShopFilterI) {
  const AccordionFilter = ({filter}: {filter:Filter}) => {
    const [accordionContentClassName, setAccordionContentClassName] = useState("accordion-content accordion-closed");

    return (
      <div className="accordion">
        <div className="accordion-info" onClick = {() => {
          accordionContentClassName !== "accordion-content" ? 
            setAccordionContentClassName("accordion-content") : 
            setAccordionContentClassName("accordion-content accordion-closed");
        }}>
          <h3>{filter.category}</h3>
          <span>{">"}</span>
        </div>
        <div className={accordionContentClassName}>
          {
            Object.entries(filter.options).map(([key, val]) => {
              return (
                <div className="accordion-item" key={key}>
                  <input type={"checkbox"} checked={val} onChange={
                    () => {
                      // Changes the filter option
                      const newFilter = {
                        ...filter,
                        "options": {...filter.options, [key]: !filter.options[key]}
                      }
                      const newFilters = filters.map((filter) => filter.category === newFilter.category ? newFilter : filter)
                      setFilters(newFilters)
                    }
                  }/>
                  <span>
                    {key}
                  </span>
                </div>
              )})
          }
        </div>
      </div>
    );
  }

  return (
    <div className="filter">
      {filters?.map((filter) => {
        return (
          <AccordionFilter filter={filter} key={filter.category}/>
        )
      }) 
      }
    </div>
  )
}
