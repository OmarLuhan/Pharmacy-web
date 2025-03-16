import { Toaster } from "sonner";
import GraficoProductsStock from "./components/GraficoProductsStock";
import GraficoProductsStockZero from "./components/GraficoProductsStockZero";
import GraficoVentas from "./components/GraficoVentas";
import GraficoDistribucionVentas from "./components/GraficoDistribucionVentas";
import GraficoIngresos from "./components/GraficoIngresos";

const PageDashboard = () => {
  return (
    <main>
      <Toaster richColors position="top-right" />
      <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-100">
        <div className="md:col-span-2 flex flex-col">
          <div className="shadow-lg">
            <GraficoIngresos />
          </div>

          <div className="columns-1 md:columns-2 mt-6 gap-4 flex- shadow-xl p-2">
            <GraficoProductsStock />
            <GraficoProductsStockZero />
          </div>
        </div>

        <div className="space-y-4 flex flex-col shadow-xl">
          <GraficoVentas />
          <GraficoDistribucionVentas />
        </div>
      </div>
    </main>
  );
};

export default PageDashboard;
