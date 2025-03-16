import React, { useEffect, useState } from "react";
import {
  BeakerIcon,
  EyeDropperIcon,
  HeartIcon,
} from "@heroicons/react/24/solid";
import { getDataProductsZeroGraph } from "../../../services/chart";

const defaultIcons = [BeakerIcon, EyeDropperIcon, HeartIcon];

const GraficoProductsStockZero = () => {
  const [products, setProducts] = useState([]);
  // Llamar al método para obtener los datos
  const fetchData = async () => {
    try {
      const { data } = await getDataProductsZeroGraph();
      const { name, quantity } = data;
      const updatedProducts = name.map((productName, index) => ({
        id: index + 1,
        name: productName,
        icon: defaultIcons[index % defaultIcons.length],
        stock: quantity[index],
      }));
      setProducts(updatedProducts);
    } catch {
      toast.warning("Error al cargar los datos de los productos sin stock");
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div
      className="border border-gray-200 rounded-lg shadow-sm max-h-[400px] overflow-y-auto 
                        [&::-webkit-scrollbar]:w-2
                      [&::-webkit-scrollbar-track]:bg-gray-100
                      [&::-webkit-scrollbar-thumb]:bg-gray-300
                      "
    >
      <h1 className="text-cyan-600 font-bold mt-2 ml-6">Productos Sin Stock</h1>
      {products.map((product) => (
        <button
          key={product.id}
          type="button"
          className="relative flex items-center justify-between w-full px-6 py-3 text-sm font-medium border-b border-gray-200 hover:bg-gray-100 transition-all duration-200"
        >
          <div className="flex items-center space-x-3">
            <product.icon className="w-5 h-5 text-rose-500" />
          </div>
          <h2 className="text-gray-700">{product.name}</h2>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-600">
            {product.stock}
          </span>
        </button>
      ))}
    </div>
  );
};

export default GraficoProductsStockZero;
