import { useState, useEffect } from 'react';
import { validateInput, calculateImpactIndicator } from '../../data/industry-ranges';
import type { InputRange } from '../../data/industry-ranges';

interface SmartInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  field: string;
  category: 'market' | 'luminaire';
  range: InputRange;
  baselineValue?: number;
  helpText?: string;
  className?: string;
  disabled?: boolean;
}

export default function SmartInput({ 
  label, 
  value, 
  onChange, 
  field, 
  category, 
  range, 
  baselineValue,
  helpText,
  className = '',
  disabled = false 
}: SmartInputProps) {
  const [inputValue, setInputValue] = useState(value.toString());
  const [showHelp, setShowHelp] = useState(false);

  // Update input value when prop changes
  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  // Validation
  const validation = validateInput(value, field, category);
  
  // Impact indicator
  const impact = baselineValue ? calculateImpactIndicator(value, baselineValue) : null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    const numericValue = parseFloat(newValue);
    if (!isNaN(numericValue)) {
      onChange(numericValue);
    }
  };

  const handleBlur = () => {
    // Ensure valid numeric value on blur
    const numericValue = parseFloat(inputValue);
    if (isNaN(numericValue)) {
      setInputValue(value.toString());
    }
  };

  const getValidationClasses = () => {
    if (!validation.isValid) {
      return 'border-red-500 focus:ring-red-500';
    }
    if (validation.severity === 'warning') {
      return 'border-yellow-400 focus:ring-yellow-400';
    }
    return 'border-border focus:ring-metric-blue';
  };

  const getImpactClasses = () => {
    if (!impact) return '';
    
    switch (impact.direction) {
      case 'increase':
        return impact.significance === 'major' ? 'text-red-600' : 'text-orange-500';
      case 'decrease':
        return impact.significance === 'major' ? 'text-green-600' : 'text-blue-500';
      default:
        return 'text-text-secondary';
    }
  };

  const formatImpactText = () => {
    if (!impact) return '';
    
    const sign = impact.percentage > 0 ? '+' : '';
    const arrow = impact.direction === 'increase' ? '↑' : impact.direction === 'decrease' ? '↓' : '→';
    
    return `${arrow} ${sign}${impact.percentage.toFixed(1)}%`;
  };

  return (
    <div className={`relative ${className}`}>
      {/* Label and Help Button */}
      <div className="flex items-center justify-between mb-1">
        <label className="block text-sm font-medium text-text-primary">
          {label}
          {range.unit && <span className="text-text-secondary ml-1">({range.unit})</span>}
        </label>
        
        <div className="flex items-center space-x-2">
          {/* Impact Indicator */}
          {impact && (
            <span className={`text-xs font-medium ${getImpactClasses()}`}>
              {formatImpactText()}
            </span>
          )}
          
          {/* Help Button */}
          <button
            type="button"
            onMouseEnter={() => setShowHelp(true)}
            onMouseLeave={() => setShowHelp(false)}
            className="text-text-secondary hover:text-metric-blue transition-colors"
            aria-label={`Help for ${label}`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Input Field */}
      <div className="relative">
        <input
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          disabled={disabled}
          step={range.unit === '%' ? '0.01' : range.unit === '$' ? '1' : '0.1'}
          className={`
            w-full px-3 py-2 rounded-md text-sm
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:border-transparent
            disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
            ${getValidationClasses()}
          `}
          placeholder={`Typical: ${range.typical}`}
        />
        
        {/* Industry Range Indicator */}
        <div className="mt-1 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 to-blue-400 rounded-full"
            style={{
              width: '100%',
              background: `linear-gradient(to right, 
                #f87171 0%, 
                #fbbf24 25%, 
                #34d399 50%, 
                #60a5fa 75%, 
                #a78bfa 100%
              )`
            }}
          />
          <div 
            className="absolute h-1 w-0.5 bg-text-primary"
            style={{
              left: `${Math.min(100, Math.max(0, ((value - range.min) / (range.max - range.min)) * 100))}%`,
              top: '0'
            }}
          />
        </div>
      </div>

      {/* Validation Message */}
      {validation.message && (
        <p className={`text-xs mt-1 ${
          validation.severity === 'error' ? 'text-red-600' : 
          validation.severity === 'warning' ? 'text-yellow-600' : 
          'text-text-secondary'
        }`}>
          {validation.message}
        </p>
      )}

      {/* Help Tooltip */}
      {showHelp && (
        <div className="absolute z-50 bottom-full left-0 mb-2 w-80 p-3 bg-white border border-border rounded-lg shadow-lg">
          <div className="text-sm">
            <p className="font-medium text-text-primary mb-1">{range.description}</p>
            {range.industryNote && (
              <p className="text-text-secondary mb-2">{range.industryNote}</p>
            )}
            {helpText && (
              <p className="text-metric-blue text-xs">{helpText}</p>
            )}
            
            <div className="mt-2 pt-2 border-t border-border-light">
              <div className="flex justify-between text-xs text-text-secondary">
                <span>Min: {range.min}{range.unit}</span>
                <span>Typical: {range.typical}{range.unit}</span>
                <span>Max: {range.max}{range.unit}</span>
              </div>
            </div>
          </div>
          
          {/* Tooltip Arrow */}
          <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white" />
        </div>
      )}
    </div>
  );
}