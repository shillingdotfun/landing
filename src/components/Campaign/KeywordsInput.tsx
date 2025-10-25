// src/components/Campaign/KeywordsInput.tsx

import React from 'react';
import { FaTrash } from 'react-icons/fa6';

import { CAMPAIGN_CONSTANTS } from '../../utils/constants';

import GenericTextInput from '../Common/inputs/GenericTextInput';
import Button from '../Common/Button';

interface KeywordsInputProps {
  keywords: string[];
  onKeywordChange: (index: number, value: string) => void;
  onAddKeyword: () => void;
  onRemoveKeyword: (index: number) => void;
  errors?: string[];
}

export const KeywordsInput: React.FC<KeywordsInputProps> = ({
  keywords,
  onKeywordChange,
  onAddKeyword,
  onRemoveKeyword,
  errors,
}) => {
  const canAddMore = keywords.length < CAMPAIGN_CONSTANTS.MAX_KEYWORDS;
  const canRemove = keywords.length > CAMPAIGN_CONSTANTS.MIN_KEYWORDS;

  return (
    <div className="mb-8">
      <div className="block mb-2">
        Keywords <span className="text-red-400">*</span>
      </div>
      
      {keywords.map((keyword, index) => (
        <div key={index} className="flex flex-row gap-2">
          <GenericTextInput
            value={keyword}
            onChange={(e) => onKeywordChange(index, e.target.value)}
            placeholder="DegenDAO"
          />
          {canRemove && (
            <Button
              icon={<FaTrash />}
              onClick={() => onRemoveKeyword(index)}
              className="mb-4"
            />
          )}
        </div>
      ))}
      
      {canAddMore && (
        <Button
          label="+ Add Keyword"
          onClick={onAddKeyword}
        />
      )}
      
      {errors && errors.length > 0 && (
        <p className="mt-2 text-sm text-red-400">
          {errors.join(', ')}
        </p>
      )}
    </div>
  );
};