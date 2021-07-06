import React from 'react';
import { screen, render, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import DashboardPage from './index';

describe('Test dashboard page', () => {
  beforeEach(() => {
    render(<DashboardPage />);
  });

  const getTotalIncome = () =>
    Number(
      screen
        .getByLabelText('Total Recebido')
        .textContent.replace(',', '.')
        .replace(/[^\d]+/, ''),
    );

  it('should add a income', async () => {
    const beforeTotalIncome = getTotalIncome();
    const buttonCreate = screen.getByRole('button', {
      name: /nova transação/i,
    });

    userEvent.click(buttonCreate);

    const inputDate = screen.getByPlaceholderText(/data/i);
    userEvent.type(inputDate, '2020-06-01');

    const inputDescription = screen.getByPlaceholderText(/descrição/i);
    userEvent.type(inputDescription, 'Disney plus');

    const inputRadio = screen.getByText(/receita/i);
    userEvent.click(inputRadio);

    const inputValue = screen.getByPlaceholderText(/valor/i);
    userEvent.type(inputValue, '20.1');

    const modalButtonCreate = screen.getByRole('button', { name: 'Cadastrar' });
    userEvent.click(modalButtonCreate);

    await waitFor(() => {
      expect(screen.getByText(/disney plus/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByText(/transação cadastrada com sucesso/i),
      ).toBeInTheDocument();
    });

    const afterTotalIncome = getTotalIncome();

    expect(Math.floor(afterTotalIncome - beforeTotalIncome)).toBe(20);
  });

  it('should remove transaction', () => {
    const row = within(screen.getAllByRole('row')[1]);
    const deleteButton = row.getByRole('button', { name: /excluir/i });
    userEvent.click(deleteButton);

    expect(screen.queryByText(/netflix/i)).not.toBeInTheDocument();
    expect(
      screen.getByText(/Transação excluída com sucesso/i),
    ).toBeInTheDocument();
  });
});
