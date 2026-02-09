import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import SearchFilter from '../Features/SearchFilter';
import ProductList from '../Features/ProductList';
import CommandBar from '../Features/CommandBar';
import styles from './AppLayout.module.css';

const AppLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className={styles.container}>
            {/* Header / Mobile Menu Trigger */}
            <header className={styles.header}>
                <button
                    className={styles.menuButton}
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    aria-label="メニュー切り替え"
                >
                    {isSidebarOpen ? <X /> : <Menu />}
                </button>
                <h1 className={styles.title}>商品管理システム</h1>
            </header>

            <div className={styles.mainWrapper}>
                {/* Sidebar */}
                <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
                    <nav>
                        <ul className={styles.navList}>
                            <li className={styles.navItemActive}>商品マスタ</li>
                            <li>受注管理</li>
                            <li>在庫照会</li>
                            <li>システム設定</li>
                        </ul>
                    </nav>
                </aside>

                {/* Main Content Area */}
                <main className={styles.content}>
                    {/* Top: Search Filter */}
                    <section className={styles.searchSection}>
                        <SearchFilter />
                    </section>

                    {/* Middle: Product List */}
                    <section className={styles.listSection}>
                        <ProductList />
                    </section>

                    {/* Bottom: Command Bar */}
                    <section className={styles.commandSection}>
                        <CommandBar />
                    </section>
                </main>
            </div>
        </div>
    );
};

export default AppLayout;
