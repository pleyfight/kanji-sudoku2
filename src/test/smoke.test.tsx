import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HomeMenu } from '../components/HomeMenu';

describe('smoke', () => {
  it('renders the landing screen', () => {
    render(
      <HomeMenu
        onSelectDifficulty={() => undefined}
        language="en"
      />
    );
    expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument();
  });
});
