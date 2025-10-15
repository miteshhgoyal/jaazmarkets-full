// Universal filtering, searching, and sorting hook
import { useMemo, useState, useCallback } from "react";

// Debounce hook for search performance
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useMemo(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [value, delay]);

  return debouncedValue;
};

export const useDataFilter = ({
  data = [],
  searchConfig = {},
  sortConfig = {},
  filterConfig = {},
  initialSearch = "",
  initialSort = "default",
  initialFilters = {},
  debounceMs = 300,
}) => {
  // States
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [sortBy, setSortBy] = useState(initialSort);
  const [filters, setFilters] = useState(initialFilters);

  // Debounced search term for performance
  const debouncedSearchTerm = useDebounce(searchTerm, debounceMs);

  // Generic search function
  const searchData = useCallback((items, term, config) => {
    if (!term || !config.fields) return items;

    const searchTerm = term.toLowerCase();

    return items.filter((item) => {
      return config.fields.some((field) => {
        const value = getNestedValue(item, field);
        if (value === null || value === undefined) return false;

        const stringValue = String(value).toLowerCase();

        // Support different search types
        switch (config.type) {
          case "exact":
            return stringValue === searchTerm;
          case "startsWith":
            return stringValue.startsWith(searchTerm);
          case "fuzzy":
            return fuzzyMatch(stringValue, searchTerm);
          default:
            return stringValue.includes(searchTerm);
        }
      });
    });
  }, []);

  // Generic sort function
  const sortData = useCallback((items, sortKey, config) => {
    if (!sortKey || sortKey === "default" || !config.options) return items;

    const sortOption = config.options[sortKey];
    if (!sortOption) return items;

    return [...items].sort((a, b) => {
      const aValue = getNestedValue(a, sortOption.field);
      const bValue = getNestedValue(b, sortOption.field);

      // Handle different data types
      switch (sortOption.type) {
        case "number":
          return sortOption.direction === "desc"
            ? parseFloat(bValue) - parseFloat(aValue)
            : parseFloat(aValue) - parseFloat(bValue);

        case "date":
          const aDate = new Date(aValue);
          const bDate = new Date(bValue);
          return sortOption.direction === "desc"
            ? bDate - aDate
            : aDate - bDate;

        case "string":
        default:
          const aStr = String(aValue).toLowerCase();
          const bStr = String(bValue).toLowerCase();
          if (sortOption.direction === "desc") {
            return bStr.localeCompare(aStr);
          }
          return aStr.localeCompare(bStr);
      }
    });
  }, []);

  // Generic filter function
  const filterData = useCallback((items, filterValues, config) => {
    if (!filterValues || Object.keys(filterValues).length === 0) return items;

    return items.filter((item) => {
      return Object.entries(filterValues).every(([filterKey, filterValue]) => {
        if (!filterValue || filterValue === "all") return true;

        const filterConfig = config[filterKey];
        if (!filterConfig) return true;

        const itemValue = getNestedValue(item, filterConfig.field);

        switch (filterConfig.type) {
          case "exact":
            return itemValue === filterValue;
          case "array":
            return Array.isArray(itemValue) && itemValue.includes(filterValue);
          case "range":
            const numValue = parseFloat(itemValue);
            const [min, max] = filterValue.split("-").map(Number);
            return numValue >= min && numValue <= max;
          case "boolean":
            return Boolean(itemValue) === (filterValue === "true");
          default:
            return String(itemValue)
              .toLowerCase()
              .includes(String(filterValue).toLowerCase());
        }
      });
    });
  }, []);

  // Process data through all filters
  const processedData = useMemo(() => {
    let result = [...data];

    // Apply search
    if (searchConfig.fields) {
      result = searchData(result, debouncedSearchTerm, searchConfig);
    }

    // Apply filters
    if (Object.keys(filterConfig).length > 0) {
      result = filterData(result, filters, filterConfig);
    }

    // Apply sorting
    if (sortConfig.options) {
      result = sortData(result, sortBy, sortConfig);
    }

    return result;
  }, [
    data,
    debouncedSearchTerm,
    filters,
    sortBy,
    searchData,
    filterData,
    sortData,
    searchConfig,
    filterConfig,
    sortConfig,
  ]);

  // Helper functions
  const setFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setSortBy(initialSort);
    setFilters(initialFilters);
  }, [initialSort, initialFilters]);

  const hasActiveFilters = useMemo(() => {
    return (
      searchTerm !== "" ||
      sortBy !== initialSort ||
      Object.keys(filters).some((key) => filters[key] !== initialFilters[key])
    );
  }, [searchTerm, sortBy, filters, initialSort, initialFilters]);

  return {
    // Processed data
    data: processedData,

    // Search
    searchTerm,
    setSearchTerm,

    // Sort
    sortBy,
    setSortBy,

    // Filters
    filters,
    setFilter,
    setFilters,

    // Utilities
    clearFilters,
    hasActiveFilters,
    totalCount: data.length,
    filteredCount: processedData.length,
  };
};

// Utility functions
const getNestedValue = (obj, path) => {
  return path.split(".").reduce((current, key) => current?.[key], obj);
};

const fuzzyMatch = (text, pattern) => {
  const regex = new RegExp(pattern.split("").join(".*"), "i");
  return regex.test(text);
};
