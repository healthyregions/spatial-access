import { useState, useEffect } from "react";

export const useUploadFile = (file: File | undefined) => {
  const [columns, setColumns] = useState<Array<string> | undefined>(undefined);
  const [resourceId, setResourceId] = useState<string | undefined>(undefined);
  const [error, setError] = useState<Error| null> (null)

  useEffect(() => {
    if (!file) return;
      const reader = new FileReader();
      reader.onload = (progressEvent) => {
        var text = reader.result as string;
        let firstLine = text?.split(/\r\n|\r|\n/).shift();
        setColumns(firstLine?.split(","));
        let formData = new FormData();

        formData.append("file",file);

        fetch("/uploadResource", {
          method: "POST",
          body: formData,
        })
          .then((resp) => resp.json())
          .then((resp) => {
            setResourceId(resp.resource_id)
            setError(null)
          })
          .catch((e) => setError(e));
      };

      reader.onerror = () => {
        setError(reader.error)
      };

      reader.readAsText(file, "UTF-8");
  }, [file]);
  return { columns, resourceId, error};
};
