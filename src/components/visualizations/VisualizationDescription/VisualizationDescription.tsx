import React from 'react';

type AltTextWrapperProps<T extends object> = {
  description?: React.ReactNode;
  descriptionId?: string;
  tableLabel: string;
  data: Array<T>;
};

export function VisualizationDescription<T extends object>({
  description,
  descriptionId,
  data,
  tableLabel,
  children,
}: React.PropsWithChildren<AltTextWrapperProps<T>>) {
  return (
    <>
      {children}
      {description !== undefined && descriptionId !== undefined ? (
        <div id={descriptionId}>{description}</div>
      ) : undefined}
      <table className="sr-only">
        <caption>{tableLabel}</caption>
        <thead>
          <tr>
            {Object.keys(data[0]).map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={JSON.stringify(d)}>
              {Object.values(d).map((value) => (
                <td>{(value || '').toString()}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
