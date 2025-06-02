import { useAppContext } from '../../context/AppContext';
import SmartInput from './SmartInput';
import { luminaireRanges } from '../../data/industry-ranges';

interface LuminaireInputsProps {
  title: string;
  type: 'baseline' | 'proposed';
  icon: string;
  bgColor: string;
}

export default function LuminaireInputs({ title, type, icon, bgColor }: LuminaireInputsProps) {
  const { state, dispatch } = useAppContext();
  
  const luminaire = state.inputs[type];
  const compareWith = type === 'baseline' ? state.inputs.proposed : state.inputs.baseline;

  const handleInputChange = (field: string, value: number) => {
    dispatch({ 
      type: 'UPDATE_LUMINAIRE_INPUT', 
      luminaire: type, 
      field, 
      value 
    });
  };

  // Calculate efficacy (lumens per watt)
  const efficacy = luminaire.wattage > 0 ? luminaire.flux / luminaire.wattage : 0;
  const compareEfficacy = compareWith.wattage > 0 ? compareWith.flux / compareWith.wattage : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
      {/* Header */}
      <div className={`${bgColor} text-white p-md`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{icon}</span>
            <div>
              <h3 className="font-semibold text-lg">{title}</h3>
              <p className="text-sm opacity-90">
                {type === 'baseline' ? 'Current lighting system' : 'Proposed LED upgrade'}
              </p>
            </div>
          </div>
          
          {/* Efficacy Display */}
          <div className="text-right">
            <div className="text-sm opacity-90">Efficacy</div>
            <div className="text-xl font-bold">
              {efficacy.toFixed(0)} <span className="text-sm">lm/W</span>
            </div>
          </div>
        </div>
      </div>

      {/* Input Fields */}
      <div className="p-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
          {/* Performance Specifications */}
          <div className="space-y-lg">
            <h4 className="font-medium text-text-primary text-sm uppercase tracking-wide border-b border-border-light pb-2">
              Performance
            </h4>
            
            <SmartInput
              label="Power Consumption"
              value={luminaire.wattage}
              onChange={(value) => handleInputChange('wattage', value)}
              field="wattage"
              category="luminaire"
              range={luminaireRanges.wattage}
              baselineValue={compareWith.wattage}
              helpText="Total electrical power consumed by each luminaire including driver losses"
            />

            <SmartInput
              label="Light Output"
              value={luminaire.flux}
              onChange={(value) => handleInputChange('flux', value)}
              field="flux"
              category="luminaire"
              range={luminaireRanges.flux}
              baselineValue={compareWith.flux}
              helpText="Initial lumens delivered by each luminaire when new"
            />

            <SmartInput
              label="Quantity"
              value={luminaire.qty}
              onChange={(value) => handleInputChange('qty', value)}
              field="qty"
              category="luminaire"
              range={luminaireRanges.qty}
              baselineValue={compareWith.qty}
              helpText="Total number of luminaires in the project"
            />
          </div>

          {/* Lifetime & Reliability */}
          <div className="space-y-lg">
            <h4 className="font-medium text-text-primary text-sm uppercase tracking-wide border-b border-border-light pb-2">
              Lifetime & Reliability
            </h4>
            
            <SmartInput
              label="L90 Lifetime"
              value={luminaire.l90Lifetime}
              onChange={(value) => handleInputChange('l90Lifetime', value)}
              field="l90Lifetime"
              category="luminaire"
              range={luminaireRanges.l90Lifetime}
              baselineValue={compareWith.l90Lifetime}
              helpText="Hours until light output drops to 90% - used for maintenance scheduling"
            />

            <SmartInput
              label="L70 Lifetime"
              value={luminaire.l70Lifetime}
              onChange={(value) => handleInputChange('l70Lifetime', value)}
              field="l70Lifetime"
              category="luminaire"
              range={luminaireRanges.l70Lifetime}
              baselineValue={compareWith.l70Lifetime}
              helpText="Hours until light output drops to 70% - typically end-of-useful-life"
            />

            <SmartInput
              label="Unit Cost"
              value={luminaire.cost}
              onChange={(value) => handleInputChange('cost', value)}
              field="cost"
              category="luminaire"
              range={luminaireRanges.cost}
              baselineValue={compareWith.cost}
              helpText="Purchase price per luminaire including installation materials"
            />
          </div>
        </div>

        {/* Environmental Impact */}
        <div className="mt-lg pt-lg border-t border-border-light">
          <h4 className="font-medium text-text-primary text-sm uppercase tracking-wide mb-lg">
            Environmental Impact
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            <SmartInput
              label="Manufacturing GWP"
              value={luminaire.gwp}
              onChange={(value) => handleInputChange('gwp', value)}
              field="gwp"
              category="luminaire"
              range={luminaireRanges.gwp}
              baselineValue={compareWith.gwp}
              helpText="Carbon footprint from raw materials, manufacturing, and transport to site"
            />

            <SmartInput
              label="End-of-Life GWP"
              value={luminaire.eol}
              onChange={(value) => handleInputChange('eol', value)}
              field="eol"
              category="luminaire"
              range={luminaireRanges.eol}
              baselineValue={compareWith.eol}
              helpText="Carbon impact from disposal, recycling, or waste processing"
            />
          </div>
        </div>

        {/* Calculated Metrics */}
        <div className="mt-lg pt-lg border-t border-border-light">
          <h4 className="font-medium text-text-primary text-sm uppercase tracking-wide mb-md">
            Calculated Performance
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
            <div className="bg-bg-primary p-md rounded-md text-center">
              <div className="text-xs text-text-secondary uppercase tracking-wide">Efficacy</div>
              <div className="text-lg font-semibold text-text-primary">
                {efficacy.toFixed(1)} <span className="text-sm">lm/W</span>
              </div>
              {compareEfficacy > 0 && (
                <div className={`text-xs ${efficacy > compareEfficacy ? 'text-green-600' : 'text-red-600'}`}>
                  {efficacy > compareEfficacy ? '+' : ''}{((efficacy - compareEfficacy) / compareEfficacy * 100).toFixed(1)}%
                </div>
              )}
            </div>

            <div className="bg-bg-primary p-md rounded-md text-center">
              <div className="text-xs text-text-secondary uppercase tracking-wide">Total Power</div>
              <div className="text-lg font-semibold text-text-primary">
                {(luminaire.wattage * luminaire.qty / 1000).toFixed(1)} <span className="text-sm">kW</span>
              </div>
            </div>

            <div className="bg-bg-primary p-md rounded-md text-center">
              <div className="text-xs text-text-secondary uppercase tracking-wide">Total Lumens</div>
              <div className="text-lg font-semibold text-text-primary">
                {(luminaire.flux * luminaire.qty / 1000).toFixed(0)} <span className="text-sm">klm</span>
              </div>
            </div>

            <div className="bg-bg-primary p-md rounded-md text-center">
              <div className="text-xs text-text-secondary uppercase tracking-wide">Total Cost</div>
              <div className="text-lg font-semibold text-text-primary">
                ${(luminaire.cost * luminaire.qty).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Preset Buttons */}
        <div className="mt-lg pt-lg border-t border-border-light">
          <h4 className="font-medium text-text-primary text-sm mb-md">Quick Presets</h4>
          <div className="flex flex-wrap gap-2">
            {type === 'baseline' ? (
              <>
                <button
                  onClick={() => {
                    handleInputChange('wattage', 32);
                    handleInputChange('flux', 2800);
                    handleInputChange('l90Lifetime', 24000);
                    handleInputChange('l70Lifetime', 36000);
                    handleInputChange('gwp', 8);
                    handleInputChange('cost', 180);
                  }}
                  className="px-3 py-1 text-sm bg-gray-600 text-white rounded-md hover:bg-opacity-90 transition-colors"
                >
                  T8 Fluorescent
                </button>
                <button
                  onClick={() => {
                    handleInputChange('wattage', 150);
                    handleInputChange('flux', 15000);
                    handleInputChange('l90Lifetime', 15000);
                    handleInputChange('l70Lifetime', 20000);
                    handleInputChange('gwp', 25);
                    handleInputChange('cost', 320);
                  }}
                  className="px-3 py-1 text-sm bg-yellow-600 text-white rounded-md hover:bg-opacity-90 transition-colors"
                >
                  Metal Halide
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    handleInputChange('wattage', 25);
                    handleInputChange('flux', 3000);
                    handleInputChange('l90Lifetime', 54000);
                    handleInputChange('l70Lifetime', 100000);
                    handleInputChange('gwp', 18);
                    handleInputChange('cost', 240);
                  }}
                  className="px-3 py-1 text-sm bg-metric-blue text-white rounded-md hover:bg-opacity-90 transition-colors"
                >
                  Standard LED
                </button>
                <button
                  onClick={() => {
                    handleInputChange('wattage', 20);
                    handleInputChange('flux', 3200);
                    handleInputChange('l90Lifetime', 60000);
                    handleInputChange('l70Lifetime', 120000);
                    handleInputChange('gwp', 22);
                    handleInputChange('cost', 320);
                  }}
                  className="px-3 py-1 text-sm bg-metric-green text-white rounded-md hover:bg-opacity-90 transition-colors"
                >
                  High-Efficiency LED
                </button>
                <button
                  onClick={() => {
                    handleInputChange('wattage', 80);
                    handleInputChange('flux', 12000);
                    handleInputChange('l90Lifetime', 50000);
                    handleInputChange('l70Lifetime', 100000);
                    handleInputChange('gwp', 45);
                    handleInputChange('cost', 580);
                  }}
                  className="px-3 py-1 text-sm bg-metric-purple text-white rounded-md hover:bg-opacity-90 transition-colors"
                >
                  High Bay LED
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}