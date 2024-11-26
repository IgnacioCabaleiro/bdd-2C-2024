import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Product Management System', () => {
  render(<App />);
  const headerElement = screen.getByText(/Product Management System/i);
  expect(headerElement).toBeInTheDocument();
});