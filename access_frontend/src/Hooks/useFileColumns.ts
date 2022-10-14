import { useState, useEffect } from "react";

export const useFileColumns = (file: File | undefined) => {
  const [columns, setColumns] = useState<Array<string> | undefined>(undefined);
  const [error, setError] = useState<Error| null> (null)

  useEffect(() => {
    if (!file) return;
      const reader = new FileReader();
      reader.onload = (progressEvent) => {
        var text = reader.result as string;
        let firstLine = text?.split(/\r\n|\r|\n/).shift();
        setColumns(firstLine?.split(","));
      }
      reader.onerror = () => {
        setError(reader.error)
      };

      reader.readAsText(file, "UTF-8");
  }, [file]);
  return { columns, error};
};
