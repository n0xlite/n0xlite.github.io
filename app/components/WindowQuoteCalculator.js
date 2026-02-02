// WindowQuoteCalculator.js
'use client';
import React, { useState, useEffect } from 'react';
import { Plus, Minus, ClipboardCopy, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';

const prices = {
  XL_UPPER_WINDOW: 23.64,
  L_UPPER_WINDOW: 16.06,
  M_UPPER_WINDOW: 8.59,
  S_UPPER_WINDOW: 6.85,
  XS_UPPER_WINDOW: 3.56,
  XL_LOWER_WINDOW: 17.98,
  L_LOWER_WINDOW: 11.43,
  M_LOWER_WINDOW: 6.49,
  S_LOWER_WINDOW: 4.31,
  XS_LOWER_WINDOW: 2.54,
  EXTERIOR_HALF_SCREEN: 2.72,
  WHOLE_INTERIOR_SCREEN: 3.12,
  EXTERIOR_HALF_SCREEN_INTERIOR: 4.00,
  SOLAR_SCREEN: 5.56,
  SCREW_SOLAR_SCREEN: 8,
  UPPER_WOODEN_SCREEN: 14,
  LOWER_WOODEN_SCREEN: 7,
  FIRST_STORY_GUTTER: 1,
  SECOND_STORY_GUTTER: 2,
};

const WindowQuoteCalculator = () => {

  const { toast } = useToast();

  const [quantities, setQuantities] = useState({
    XL_UPPER_WINDOW: 0, L_UPPER_WINDOW: 0, M_UPPER_WINDOW: 0, S_UPPER_WINDOW: 0, XS_UPPER_WINDOW: 0,
    XL_LOWER_WINDOW: 0, L_LOWER_WINDOW: 0, M_LOWER_WINDOW: 0, S_LOWER_WINDOW: 0, XS_LOWER_WINDOW: 0,
    EXTERIOR_HALF_SCREEN: 0, WHOLE_INTERIOR_SCREEN: 0,
    EXTERIOR_HALF_SCREEN_INTERIOR: 0, SOLAR_SCREEN: 0,
    SCREW_SOLAR_SCREEN: 0, UPPER_WOODEN_SCREEN: 0,
    LOWER_WOODEN_SCREEN: 0, FIRST_STORY_GUTTER: 0,
    SECOND_STORY_GUTTER: 0,
  });

  const [totals, setTotals] = useState({
    inOut: 0,
    outOnly: 0,
    gutters: 0,
  });

  // TODO Note functionality for PDF generation
  // const [notes, setNotes] = useState('');

  const isWindow = (key) => key.includes('WINDOW');
  const isScreen = (key) => key.includes('SCREEN');
  const isGutter = (key) => key.includes('GUTTER');

  const updateQuantity = (item, increment) => {
    setQuantities(prev => ({
      ...prev,
      [item]: Math.max(0, prev[item] + increment)
    }));
  };

  const resetItem = (item) => {
    setQuantities(prev => ({ ...prev, [item]: 0 }));
  };

  const resetAll = () => {
    setQuantities(Object.keys(quantities).reduce((acc, key) => {
      acc[key] = 0;
      return acc;
    }, {}));
  };

  const generateQuoteText = () => {
    const sections = {
      'Upper Windows': ['XL_UPPER_WINDOW', 'L_UPPER_WINDOW', 'M_UPPER_WINDOW', 'S_UPPER_WINDOW', 'XS_UPPER_WINDOW'],
      'Lower Windows': ['XL_LOWER_WINDOW', 'L_LOWER_WINDOW', 'M_LOWER_WINDOW', 'S_LOWER_WINDOW', 'XS_LOWER_WINDOW'],
      'Screens': [
        'EXTERIOR_HALF_SCREEN',
        'WHOLE_INTERIOR_SCREEN',
        'EXTERIOR_HALF_SCREEN_INTERIOR',
        'SOLAR_SCREEN',
        'SCREW_SOLAR_SCREEN',
        'UPPER_WOODEN_SCREEN',
        'LOWER_WOODEN_SCREEN'
      ],
      'Gutters': ['FIRST_STORY_GUTTER', 'SECOND_STORY_GUTTER']
    };

    const labels = {
      XL_UPPER_WINDOW: 'XL Upper',
      L_UPPER_WINDOW: 'L Upper',
      M_UPPER_WINDOW: 'M Upper',
      S_UPPER_WINDOW: 'S Upper',
      XS_UPPER_WINDOW: 'XS Upper',
      XL_LOWER_WINDOW: 'XL Lower',
      L_LOWER_WINDOW: 'L Lower',
      M_LOWER_WINDOW: 'M Lower',
      S_LOWER_WINDOW: 'S Lower',
      XS_LOWER_WINDOW: 'XS Lower',
      EXTERIOR_HALF_SCREEN: 'Half Screens',
      WHOLE_INTERIOR_SCREEN: 'Whole/Interior Screens',
      EXTERIOR_HALF_SCREEN_INTERIOR: 'Half Screens (remove from interior)',
      SOLAR_SCREEN: 'Solar Screens',
      SCREW_SOLAR_SCREEN: 'Screw-On Solar Screens',
      UPPER_WOODEN_SCREEN: 'Upper Wooden Screens',
      LOWER_WOODEN_SCREEN: 'Lower Wooden Screens',
      FIRST_STORY_GUTTER: 'Gutters (1st Story)',
      SECOND_STORY_GUTTER: 'Gutters (2nd Story)'
    };

    let quoteText = '';

    for (const [section, items] of Object.entries(sections)) {
      const sectionItems = items
        .filter(key => quantities[key] > 0)
        .map(key => `${labels[key]}: ${section == 'Gutters' ? `${quantities[key]} ft` : quantities[key]}`);

      if (sectionItems.length > 0) {
        quoteText += `${sectionItems.join('\n')}\n`;
      }
    }

    quoteText += `\n`;
    if (totals.inOut > 0) {
      quoteText += `In/Out: $${totals.inOut.toFixed(2)}\n`;
    }
    if (totals.outOnly > 0) {
      quoteText += `Out Only: $${totals.outOnly.toFixed(2)}\n`;
    }
    if (totals.gutters > 0) {
      quoteText += `Gutter Cleaning: $${totals.gutters.toFixed(2)}\n`;
    }

    return quoteText;
  };

  const copyToClipboard = async (text) => {
    // Prefer the async Clipboard API when available
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers / contexts
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        textarea.setSelectionRange(0, textarea.value.length);
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      toast({
        title: 'Success',
        description: 'Bid copied to clipboard',
      });
    } catch (err) {
      console.error('Clipboard error:', err);
      toast({
        title: 'Failed',
        description: 'Could not copy to clipboard',
        variant: 'destructive',
      });
    }
  };

  // Calculation logic
  useEffect(() => {
    const windowsTotal = Object.keys(quantities).reduce((acc, key) => {
      if (isWindow(key)) return acc + (quantities[key] * prices[key]);
      return acc;
    }, 0);

    const screensTotal = Object.keys(quantities).reduce((acc, key) => {
      if (isScreen(key)) return acc + (quantities[key] * prices[key]);
      return acc;
    }, 0);

    const guttersTotal = Object.keys(quantities).reduce((acc, key) => {
      if (isGutter(key)) return acc + (quantities[key] * prices[key]);
      return acc;
    }, 0);

    const inOutTotal = windowsTotal + screensTotal;
    const outOnlyTotal = (windowsTotal * 0.67) + screensTotal;

    setTotals({
      inOut: inOutTotal,
      outOnly: outOnlyTotal,
      gutters: guttersTotal,
    });
  }, [quantities]);

  // Component for consistent item display
  const CounterItem = ({ label, description, itemKey, increment = 1, showTenButtons = false }) => (
    <div className="w-full p-4 bg-white rounded-lg shadow-sm mb-2">
      <div className="flex flex-col space-y-3 items-center text-center">
        <div className="w-full">
          <h3 className="text-lg font-semibold">{label}</h3>
          <p className="text-sm text-gray-600 px-4">{description}</p>
        </div>
        <div className="flex items-center space-x-3">
          {showTenButtons && (
            <Button
              onClick={() => updateQuantity(itemKey, -10)}
              variant="outline"
              className="h-12 px-3 rounded-full"
            >
              <Minus className="h-6 w-6" /><Minus className="h-6 w-6" />
            </Button>
          )}
          <Button
            onClick={() => updateQuantity(itemKey, -increment)}
            variant="outline"
            className="h-12 w-12 rounded-full"
          >
            <Minus className="h-6 w-6" />
          </Button>
          <span className="text-xl font-semibold w-8 text-center">
            {quantities[itemKey]}
          </span>
          <Button
            onClick={() => updateQuantity(itemKey, increment)}
            variant="outline"
            className="h-12 w-12 rounded-full"
          >
            <Plus className="h-6 w-6" />
          </Button>
          {showTenButtons && (
            <Button
              onClick={() => updateQuantity(itemKey, 10)}
              variant="outline"
              className="h-12 px-3 rounded-full"
            >
              <Plus className="h-6 w-6" /><Plus className="h-6 w-6" />
            </Button>
          )}
          <Button
            onClick={() => resetItem(itemKey)}
            variant="ghost"
            className="h-12 w-12 rounded-full"
          >
            <RotateCcw className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="min-h-screen w-screen -mx-4 bg-gray-50 pb-10">
        <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-10">
          <div className="p-4 text-center">
            <h1 className="text-xl font-bold">Bid Calculator</h1>
          </div>
        </div>

        <div className="pt-16 px-4 pb-36">
          {/* Windows Section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 text-center">Upper Windows</h2>
            {[
              ['XL_UPPER_WINDOW', 'Extra Large Upper Pane', '> 27 sqft'],
              ['L_UPPER_WINDOW', 'Large Upper Pane', '13 - 26 sqft'],
              ['M_UPPER_WINDOW', 'Medium Upper Pane', '4 - 12 sqft'],
              ['S_UPPER_WINDOW', 'Small Upper Pane', '1 - 3 sqft'],
              ['XS_UPPER_WINDOW', 'Extra Small Upper Pane', '< 1 sqft']
            ].map(([key, label, desc]) => (
              <CounterItem
                key={key}
                label={label}
                itemKey={key}
                description={desc}
                showTenButtons={key === 'XS_UPPER_WINDOW'}
              />
            ))}
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 text-center">Lower Windows</h2>
            {[
              ['XL_LOWER_WINDOW', 'Extra Large Lower Pane', '> 27 sqft'],
              ['L_LOWER_WINDOW', 'Large Lower Pane', '13 - 26 sqft'],
              ['M_LOWER_WINDOW', 'Medium Lower Pane', '4 - 12 sqft'],
              ['S_LOWER_WINDOW', 'Small Lower Pane', '1 - 3 sqft'],
              ['XS_LOWER_WINDOW', 'Extra Small Lower Pane', '< 1 sqft']
            ].map(([key, label, desc]) => (
              <CounterItem
                key={key}
                label={label}
                itemKey={key}
                description={desc}
                showTenButtons={key === 'XS_LOWER_WINDOW'}
              />
            ))}
          </div>

          {/* Screens Section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 text-center">Screens</h2>
            {[
              ['EXTERIOR_HALF_SCREEN', 'Half Screens'],
              ['EXTERIOR_HALF_SCREEN_INTERIOR', 'Half Screens', 'Remove from inside'],
              ['WHOLE_INTERIOR_SCREEN', 'Full Screens', 'Interior or exterior'],
              ['SOLAR_SCREEN', 'Solar Screens'],
              ['SCREW_SOLAR_SCREEN', 'Screw-On Solar Screens'],
              ['UPPER_WOODEN_SCREEN', 'Upper Wooden Screens'],
              ['LOWER_WOODEN_SCREEN', 'Lower Wooden Screens'],
            ].map(([key, label, desc]) => (
              <CounterItem
                key={key}
                label={label}
                itemKey={key}
                description={desc}
              />
            ))}
          </div>

          {/* Gutters Section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 text-center">Gutters</h2>
            {[
              ['FIRST_STORY_GUTTER', 'First Story Gutters'],
              ['SECOND_STORY_GUTTER', 'Second Story Gutters'],
            ].map(([key, label]) => (
              <CounterItem
                key={key}
                label={label}
                itemKey={key}
                increment={10}
                description={'Linear feet rounded to nearest ten'}
              />
            ))}
          </div>
        </div>

        {/* Fixed bottom section for totals and actions */}
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t">
          <div className="p-4 space-y-2">
            <div className="flex justify-between text-lg font-bold">
              <span>In/Out:</span>
              <span>${totals.inOut.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Out Only:</span>
              <span>${totals.outOnly.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Gutters:</span>
              <span>${totals.gutters.toFixed(2)}</span>
            </div>

            <div className="flex space-x-2 pt-2 pb-2">
              <Button
                onClick={resetAll}
                variant="destructive"
                className="flex-1 h-12"
              >
                <RotateCcw className="mr-2 h-5 w-5" />
                Reset All
              </Button>
              <Button
                onClick={() => copyToClipboard(generateQuoteText())}
                className="flex-1 h-12"
              >
                <ClipboardCopy className="mr-2 h-5 w-4" />
                Copy Bid
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default WindowQuoteCalculator;