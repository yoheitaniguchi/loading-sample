import React from 'react';
import { useProducts } from '../../context/ProductContext';
import styles from './ProductList.module.css';

const ProductList = () => {
    // コンテキストから商品データと選択状態を取得
    const { products, selectedIds, toggleSelection } = useProducts();

    return (
        <div className={styles.container}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th className={styles.thCheckbox}>
                            {/* 全選択は今回は未実装 */}
                            <input type="checkbox" disabled />
                        </th>
                        <th className={styles.th}>品目コード</th>
                        <th className={styles.th}>品目名</th>
                        <th className={styles.th}>カテゴリ</th>
                        <th className={styles.th}>価格</th>
                        <th className={styles.th}>在庫数</th>
                        <th className={styles.th}>最終更新日</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => {
                        const isSelected = selectedIds.includes(product.id);
                        return (
                            <tr
                                key={product.id}
                                className={`${styles.tr} ${isSelected ? styles.selectedRow : ''}`}
                                onClick={() => toggleSelection(product.id)}
                            >
                                <td className={styles.tdCheckbox}>
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => toggleSelection(product.id)}
                                        onClick={(e) => e.stopPropagation()} // 行クリックと重複しないように
                                    />
                                </td>
                                <td className={styles.td}>{product.itemCode}</td>
                                <td className={`${styles.td} ${styles.productName}`}>{product.itemName}</td>
                                <td className={styles.td}>{product.category}</td>
                                <td className={`${styles.td} ${styles.price}`}>¥{product.price.toLocaleString()}</td>
                                <td className={`${styles.td} ${styles.stock}`}>{product.stock}</td>
                                <td className={styles.td}>{product.updateDate}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default ProductList;
