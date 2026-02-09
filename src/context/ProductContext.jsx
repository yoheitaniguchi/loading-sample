import { createContext, useContext, useState } from 'react';
import { mockProducts } from '../data/mockData';

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
    const [products, setProducts] = useState(mockProducts);
    const [selectedIds, setSelectedIds] = useState([]);

    /**
     * 商品の選択状態を切り替える
     * @param {number} id - 商品ID
     */
    const toggleSelection = (id) => {
        setSelectedIds(prev => {
            if (prev.includes(id)) {
                return prev.filter(item => item !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    /**
     * 選択された商品の「更新日」を現在時刻に更新する
     */
    const updateSelectedProducts = () => {
        const now = new Date();
        const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        console.log("Updating products with IDs:", selectedIds);

        setProducts(prevProducts => prevProducts.map(product => {
            if (selectedIds.includes(product.id)) {
                return { ...product, updateDate: formattedDate };
            }
            return product;
        }));

        // 選択解除（任意だが、使い勝手のため残すか解除するか。今回は残す）
    };

    return (
        <ProductContext.Provider value={{ products, selectedIds, toggleSelection, updateSelectedProducts }}>
            {children}
        </ProductContext.Provider>
    );
}

export function useProducts() {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProducts must be used within a ProductProvider');
    }
    return context;
}
