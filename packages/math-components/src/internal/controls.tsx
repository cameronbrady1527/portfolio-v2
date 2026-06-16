"use client";

/**
 * The shared control grammar for every interactive figure, so the whole set
 * reads and behaves consistently:
 *
 * - <ControlSlider> — one labelled range row (label · slider · value at end),
 *   tabular value, accessible name from the label. The displayed value may
 *   differ from the slider position (e.g. show the angle BETWEEN two lines while
 *   the slider drives one line's direction).
 * - <ViewSwitcher> — the ONE segmented-control idiom: a `radiogroup` of chips
 *   with roving tabindex + arrow-key cycling. Used wherever a tool flips between
 *   views of the SAME figure (never to cram different figures together).
 */
import { useId } from "react";

export function ControlSlider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  display,
  valueText,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  /** Text shown at the row's end (defaults to the raw value). */
  display?: string;
  /** aria-valuetext for the slider (defaults to `display`). */
  valueText?: string;
}) {
  const id = useId();
  const shown = display ?? String(value);
  return (
    <div className="cbmc-control-row">
      <label htmlFor={id} className="cbmc-control-label">
        {label}
      </label>
      <input
        id={id}
        className="cbmc-range"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={valueText ?? shown}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <span className="cbmc-control-value">{shown}</span>
    </div>
  );
}

export interface ViewOption<T extends string> {
  value: T;
  label: string;
}

export function ViewSwitcher<T extends string>({
  label,
  value,
  options,
  onChange,
  style,
}: {
  label: string;
  value: T;
  options: ViewOption<T>[];
  onChange: (v: T) => void;
  style?: React.CSSProperties;
}) {
  const idx = options.findIndex((o) => o.value === value);
  const move = (delta: number) =>
    onChange(options[(idx + delta + options.length) % options.length].value);
  return (
    <div
      className="cbmc-controls"
      role="radiogroup"
      aria-label={label}
      style={{ marginTop: "0.5rem", ...style }}
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          tabIndex={value === o.value ? 0 : -1}
          className="cbmc-chip"
          onClick={() => onChange(o.value)}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowDown") {
              e.preventDefault();
              move(1);
            } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
              e.preventDefault();
              move(-1);
            }
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
