// WindowQuoteCalculator.js
'use client';
import React, { useState, useMemo } from 'react';
import { RotateCcw, Copy } from 'lucide-react';

const PRICES = {
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
  EXTERIOR_HALF_SCREEN_INTERIOR: 4.0,
  SOLAR_SCREEN: 5.56,
  SCREW_SOLAR_SCREEN: 8,
  UPPER_WOODEN_SCREEN: 14,
  LOWER_WOODEN_SCREEN: 7,
  FIRST_STORY_GUTTER: 1,
  SECOND_STORY_GUTTER: 2,
};

const ITEMS_CONFIG = {
  upperWindows: [
    { key: 'XL_UPPER_WINDOW', label: 'XL Upper', desc: '> 27 sqft' },
    { key: 'L_UPPER_WINDOW', label: 'L Upper', desc: '13 - 26 sqft' },
    { key: 'M_UPPER_WINDOW', label: 'M Upper', desc: '4 - 12 sqft' },
    { key: 'S_UPPER_WINDOW', label: 'S Upper', desc: '1 - 3 sqft' },
    {
      key: 'XS_UPPER_WINDOW',
      label: 'XS Upper',
      desc: '< 1 sqft',
      showTens: true,
    },
  ],
  lowerWindows: [
    { key: 'XL_LOWER_WINDOW', label: 'XL Lower', desc: '> 27 sqft' },
    { key: 'L_LOWER_WINDOW', label: 'L Lower', desc: '13 - 26 sqft' },
    { key: 'M_LOWER_WINDOW', label: 'M Lower', desc: '4 - 12 sqft' },
    { key: 'S_LOWER_WINDOW', label: 'S Lower', desc: '1 - 3 sqft' },
    {
      key: 'XS_LOWER_WINDOW',
      label: 'XS Lower',
      desc: '< 1 sqft',
      showTens: true,
    },
  ],
  screens: [
    { key: 'EXTERIOR_HALF_SCREEN', label: 'Half Screens' },
    {
      key: 'EXTERIOR_HALF_SCREEN_INTERIOR',
      label: 'Half Screens',
      desc: 'Remove from inside',
    },
    {
      key: 'WHOLE_INTERIOR_SCREEN',
      label: 'Full Screens',
      desc: 'Interior or exterior',
    },
    { key: 'SOLAR_SCREEN', label: 'Solar Screens' },
    { key: 'SCREW_SOLAR_SCREEN', label: 'Screw-On Solar Screens' },
    { key: 'UPPER_WOODEN_SCREEN', label: 'Upper Wooden Screens' },
    { key: 'LOWER_WOODEN_SCREEN', label: 'Lower Wooden Screens' },
  ],
  gutters: [
    {
      key: 'FIRST_STORY_GUTTER',
      label: 'First Story',
      desc: 'Linear feet rounded to nearest ten',
      increment: 10,
    },
    {
      key: 'SECOND_STORY_GUTTER',
      label: 'Second Story',
      desc: 'Linear feet rounded to nearest ten',
      increment: 10,
    },
  ],
};

const initQuantities = () =>
  Object.keys(PRICES).reduce((acc, key) => ({ ...acc, [key]: 0 }), {});

const WindowQuoteCalculator = () => {
  const [quantities, setQuantities] = useState(initQuantities);
  const [toast, setToast] = useState('');

  const updateQty = (key, delta) =>
    setQuantities((prev) => ({
      ...prev,
      [key]: Math.max(0, prev[key] + delta),
    }));

  const resetItem = (key) => setQuantities((prev) => ({ ...prev, [key]: 0 }));
  const resetAll = () => setQuantities(initQuantities());

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 3000);
  };

  const calcTotals = () => {
    const windows = Object.entries(quantities)
      .filter(([k]) => k.includes('WINDOW'))
      .reduce((sum, [k, qty]) => sum + qty * PRICES[k], 0);

    const screens = Object.entries(quantities)
      .filter(([k]) => k.includes('SCREEN'))
      .reduce((sum, [k, qty]) => sum + qty * PRICES[k], 0);

    const gutters = Object.entries(quantities)
      .filter(([k]) => k.includes('GUTTER'))
      .reduce((sum, [k, qty]) => sum + qty * PRICES[k], 0);

    return {
      inOut: windows + screens,
      outOnly: windows * 0.67 + screens,
      gutters,
    };
  };

  const totals = useMemo(() => calcTotals(), [quantities]);

  const generateQuote = () => {
    const lines = [];

    Object.entries(ITEMS_CONFIG).forEach(([section, items]) => {
      items.forEach(({ key, label, desc }) => {
        if (quantities[key] > 0) {
          const isGutter = section === 'gutters';
          const value = isGutter ? `${quantities[key]} ft` : quantities[key];
          const fullLabel = desc ? `${label} (${desc})` : label;
          lines.push(`${fullLabel}: ${value}`);
        }
      });
    });

    if (lines.length) lines.push('');
    if (totals.inOut > 0) lines.push(`In/Out: $${totals.inOut.toFixed(2)}`);
    if (totals.outOnly > 0)
      lines.push(`Out Only: $${totals.outOnly.toFixed(2)}`);
    if (totals.gutters > 0)
      lines.push(`Gutter Cleaning: $${totals.gutters.toFixed(2)}`);

    return lines.join('\n');
  };

  const copyQuote = async () => {
    try {
      await navigator.clipboard.writeText(generateQuote());
      showToast('Bid copied to clipboard');
    } catch {
      showToast('Could not copy to clipboard');
    }
  };

  const Counter = ({ item }) => {
    const { key, label, desc, increment = 1, showTens = false } = item;
    return (
      <div
        style={{
          backgroundColor: '#1e1e1e',
          border: '1px solid #444',
          borderRadius: '8px',
          marginBottom: '12px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '16px',
            borderBottom: '1px solid #444',
            textAlign: 'center',
          }}
        >
          <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#fff' }}>
            {label}
          </h3>
          {desc && (
            <p style={{ margin: 0, fontSize: '14px', color: '#999' }}>
              {desc}
            </p>
          )}
        </div>
        <div
          style={{
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          {showTens && (
            <button
              onClick={() => updateQty(key, -10)}
              style={buttonStyle}
              aria-label="Decrease by 10"
            >
              --
            </button>
          )}
          <button
            onClick={() => updateQty(key, -increment)}
            style={buttonStyle}
            aria-label="Decrease"
          >
            -
          </button>
          <span
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              minWidth: '40px',
              textAlign: 'center',
              color: '#fff',
            }}
          >
            {quantities[key]}
          </span>
          <button
            onClick={() => updateQty(key, increment)}
            style={buttonStyle}
            aria-label="Increase"
          >
            +
          </button>
          {showTens && (
            <button
              onClick={() => updateQty(key, 10)}
              style={buttonStyle}
              aria-label="Increase by 10"
            >
              ++
            </button>
          )}
          <button
            onClick={() => resetItem(key)}
            style={{ ...buttonStyle, marginLeft: '8px' }}
            aria-label="Reset item"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#121212',
        color: '#fff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#333',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '8px',
            zIndex: 1000,
            border: '1px solid #444',
          }}
        >
          {toast}
        </div>
      )}

      <div
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          padding: '20px',
          paddingBottom: '200px',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            marginBottom: '24px',
          }}
        >
          <img
            src="/logo_white.png"
            alt="Company Logo"
            style={{
              maxWidth: '180px',
              height: 'auto',
            }}
          />
        </div>

        <section style={{ marginBottom: '32px' }}>
          <h2
            style={{
              fontSize: '20px',
              marginBottom: '16px',
              textAlign: 'center',
            }}
          >
            Upper Windows
          </h2>
          {ITEMS_CONFIG.upperWindows.map((item) => (
            <Counter key={item.key} item={item} />
          ))}
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2
            style={{
              fontSize: '20px',
              marginBottom: '16px',
              textAlign: 'center',
            }}
          >
            Lower Windows
          </h2>
          {ITEMS_CONFIG.lowerWindows.map((item) => (
            <Counter key={item.key} item={item} />
          ))}
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2
            style={{
              fontSize: '20px',
              marginBottom: '16px',
              textAlign: 'center',
            }}
          >
            Screens
          </h2>
          {ITEMS_CONFIG.screens.map((item) => (
            <Counter key={item.key} item={item} />
          ))}
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2
            style={{
              fontSize: '20px',
              marginBottom: '16px',
              textAlign: 'center',
            }}
          >
            Gutters
          </h2>
          {ITEMS_CONFIG.gutters.map((item) => (
            <Counter key={item.key} item={item} />
          ))}
        </section>
      </div>

      <footer
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#1e1e1e',
          borderTop: '1px solid #444',
          padding: '16px',
        }}
      >
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              marginBottom: '16px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px',
                borderBottom: '1px solid #444',
              }}
            >
              <span>In/Out:</span>
              <span style={{ fontWeight: 'bold' }}>
                ${totals.inOut.toFixed(2)}
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px',
                borderBottom: '1px solid #444',
              }}
            >
              <span>Out Only:</span>
              <span style={{ fontWeight: 'bold' }}>
                ${totals.outOnly.toFixed(2)}
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px',
              }}
            >
              <span>Gutters:</span>
              <span style={{ fontWeight: 'bold' }}>
                ${totals.gutters.toFixed(2)}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={resetAll}
              style={{
                ...actionButtonStyle,
                flex: 1,
                backgroundColor: '#d32f2f',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
              aria-label="Reset all"
            >
              <RotateCcw size={18} />
              Reset All
            </button>
            <button
              onClick={copyQuote}
              style={{
                ...actionButtonStyle,
                flex: 1,
                backgroundColor: '#2196f3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
              aria-label="Copy bid"
            >
              <Copy size={18} />
              Copy Bid
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

const buttonStyle = {
  backgroundColor: '#333',
  color: '#fff',
  border: '1px solid #555',
  borderRadius: '6px',
  padding: '8px 16px',
  fontSize: '16px',
  cursor: 'pointer',
  transition: 'background-color 0.2s',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const actionButtonStyle = {
  backgroundColor: '#2196f3',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  padding: '14px 24px',
  fontSize: '16px',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'opacity 0.2s',
};

export default WindowQuoteCalculator;