import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AppLayout from '../../components/Layout/AppLayout';

// Mock child components to isolate Layout logic
vi.mock('../Features/SearchFilter', () => ({ default: () => <div data-testid="search-filter" /> }));
vi.mock('../Features/ProductList', () => ({ default: () => <div data-testid="product-list" /> }));
vi.mock('../Features/CommandBar', () => ({ default: () => <div data-testid="command-bar" /> }));

describe('AppLayout Sidebar Logic', () => {
    it('Sidebar toggles visibility when burger menu is clicked', () => {
        render(<AppLayout />);

        // Sidebar should be initially open (based on our latest change: useState(true))
        // We check via class presence or style. 
        // The component logic: className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}
        // Since CSS modules hash classes, we can't easily check for "open" string class name unless we mock styles or use a regex/role.
        // However, we can check the `aside` element.
        const sidebar = screen.getByRole('complementary'); // aside defaults to complementary
        // Or we can find by text "商品マスタ"

        // Since we are using CSS modules, the class name will be something like "_sidebar_xyz _open_xyz".
        // We can assume that if it's open, it should have the open class.
        // But testing implementation details (class names) is brittle. 
        // Better to test style if possible, but JSDOM doesn't fully compute CSS modules styles without help.
        // Let's rely on the button state or finding specific text visibility if we were functional testing.
        // For unit testing the TOGGLE:

        const menuButton = screen.getByLabelText('メニュー切り替え');

        // Initial state: Open (default true)
        const initialClasses = sidebar.className;

        // Click to Close
        fireEvent.click(menuButton);
        const closedClasses = sidebar.className;

        // Expect classes to change (Open -> Closed)
        expect(closedClasses).not.toBe(initialClasses);

        // Click to Open
        fireEvent.click(menuButton);
        const reopenedClasses = sidebar.className;

        // Expect classes to be back to initial (Open)
        expect(reopenedClasses).toBe(initialClasses);

        // Click to Close again
        fireEvent.click(menuButton);
        expect(sidebar.className).toBe(closedClasses);
    });
});
