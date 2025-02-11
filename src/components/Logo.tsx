import React from 'react';

export default function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <img 
      src="https://ortealnkwvhxrpbbhrpi.supabase.co/storage/v1/object/public/project-images/bd4c532c-377d-41d0-a20f-28770651f0d9/0.062106184467645376.png" 
      alt="AMLYL Logo" 
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
}
