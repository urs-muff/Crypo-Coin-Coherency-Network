// File: src/components/GenericPropertyEditor.tsx

import React, { useState } from 'react';
import { Value } from '../types/ConceptTypes';

interface GenericPropertyEditorProps {
  propertyKey: string;
  propertyValue: Value;
  onUpdate: (key: string, value: Value) => void;
  onDelete?: () => void;
}

export const GenericPropertyEditor: React.FC<GenericPropertyEditorProps> = ({
  propertyKey,
  propertyValue,
  onUpdate,
  onDelete
}) => {
  const [key, setKey] = useState(propertyKey);
  const [value, setValue] = useState(() => {
    if (typeof propertyValue === 'object' && propertyValue !== null) {
      return JSON.stringify(propertyValue, null, 2);
    }
    return String(propertyValue);
  });

  const handleUpdate = () => {
    let parsedValue: Value = value;
    try {
      parsedValue = JSON.parse(value);
    } catch {
      // If it's not valid JSON, use the string value as is
    }
    onUpdate(key, parsedValue);
  };

  return (
    <div className="property-editor">
      <input
        value={key}
        onChange={(e) => setKey(e.target.value)}
        onBlur={handleUpdate}
      />
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleUpdate}
      />
      {onDelete && (
        <button onClick={onDelete}>Delete</button>
      )}
    </div>
  );
};