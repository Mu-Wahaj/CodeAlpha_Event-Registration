// Ink-stamp badge for registration status. Plays a drop-and-settle animation on mount.
import React from 'react';

export default function Stamp({ status }) {
  const isConfirmed = status === 'registered';
  return (
    <span
      className={`stamp animate-stamp ${isConfirmed ? 'text-sage' : 'text-stamp'}`}
    >
      {isConfirmed ? 'Confirmed' : 'Cancelled'}
    </span>
  );
}
