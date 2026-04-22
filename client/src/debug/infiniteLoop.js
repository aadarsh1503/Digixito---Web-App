import { useEffect } from "react";

const useBuggy = (filters) => {
  useEffect(() => {
    fetchTasks(filters);
  }, [filters]);
};

const useFixed = (filters) => {
  useEffect(() => {
    fetchTasks(filters);
  }, [JSON.stringify(filters)]);
};
