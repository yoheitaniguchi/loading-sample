import { LoadingProvider } from './context/LoadingContext';
import { ProductProvider } from './context/ProductContext';
import AppLayout from './components/Layout/AppLayout';
import LoadingOverlay from './components/UI/LoadingOverlay';
import './App.css'; // Add a CSS file just in case, though modules are preferred.

function App() {
    return (
        <LoadingProvider>
            <ProductProvider>
                {/* LoadingOverlay is placed at the root level, controlled by context */}
                <LoadingOverlay />

                {/* Main Application Layout */}
                <AppLayout />
            </ProductProvider>
        </LoadingProvider>
    );
}

export default App;
