import { render, screen, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import SearchFilter from '../../components/Features/SearchFilter';
import { LoadingProvider } from '../../context/LoadingContext';
import userEvent from '@testing-library/user-event';

// LoadingOverlay is outside SearchFilter, so we can't see it directly here unless we render App.
// However, we can check if the focus restoration logic works.
// Or we can mock LoadingContext to just verify `startLoading` is called with correct args?
// But the focus restoration logic is INSIDE LoadingContext.
// So we should render LoadingProvider.

describe('SearchFilter Focus Logic', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        // Spy on alert
        vi.spyOn(window, 'alert').mockImplementation(() => { });
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    const renderWithContext = (ui) => {
        return render(
            <LoadingProvider>
                {ui}
            </LoadingProvider>
        );
    };

    it('Item 1: Restores focus to itself after loading', async () => {
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
        renderWithContext(<SearchFilter />);

        const input1 = screen.getByPlaceholderText('条件 1 を入力');

        // 1. Focus on Item 1
        input1.focus();

        // Expect loading to start (we can't easily check internal state, but we can check side effects or wait)
        // The requirement is "Focus Item 1 -> Loading 3s -> Focus Item 1"

        // Fast-forward 3 seconds
        act(() => {
            vi.advanceTimersByTime(3000);
        });

        // Verify focus is back on input1
        expect(document.activeElement).toBe(input1);
    });

    it('Item 6: Shows alert and moves focus to Item 5 after loading', async () => {
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
        renderWithContext(<SearchFilter />);

        const input6 = screen.getByPlaceholderText('条件 6 を入力');
        const input5 = screen.getByPlaceholderText('条件 5 を入力');

        // 1. Focus on Item 6
        input6.focus();

        // Fast-forward 3 seconds (Loading duration)
        // The logic inside SearchFilter for Item 6: startLoading(3000, false) -> setTimeout(3100) -> alert -> focus Item 5
        act(() => {
            vi.advanceTimersByTime(3000); // Loading finishes
        });

        // Verify focus is NOT on input6 (it shouldn't be restored yet, or ever)
        // Actually, since restoreFocus=false, Context won't restore it.

        // Advance slightly more to trigger the setTimeout(3100)
        act(() => {
            vi.advanceTimersByTime(200);
        });

        // Verify Alert was called
        expect(window.alert).toHaveBeenCalledWith('エラーが発生しました');

        // Verify Focus moved to Item 5
        expect(document.activeElement).toBe(input5);
    });
});
