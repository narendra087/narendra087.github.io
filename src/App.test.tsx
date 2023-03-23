import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import App from './App';

test('render main text', () => {
  render(<App />);
  const linkElement = screen.getByText(/Github Repository Explorer/i);
  expect(linkElement).toBeInTheDocument();
});

test('enter event handler', () => {
  render(<App />);
  const input = screen.getByTestId("input");
  fireEvent.change(input, { target: { value: "abc" } });
  fireEvent.keyDown(input, {key: 'Enter', code: 13, charCode: 13})
  
  const loading = screen.getByTestId('loading');
  expect(loading).toBeInTheDocument();
});

test('submit event', () => {
  render(<App />);
  const input = screen.getByTestId("input");
  const button = screen.getByTestId("button");
  fireEvent.change(input, { target: { value: "abc" } });
  fireEvent.click(button)
  
  const loading = screen.getByTestId('loading');
  expect(loading).toBeInTheDocument();
});