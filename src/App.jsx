import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import SalePage from "./pages/Sale/index";
import UsersPage from "./pages/Users";
import ProductsPage from "./pages/Products";
import PageLogin from "./pages/auth/PageLogin";
import CategoriesPage from "./pages/Categories";
import SaleHistoryPage from "./pages/Sale/History";
import PageRecover from "./pages/auth/PageRecover";
import PrivateRoute from "./pages/auth/PrivateRoute";
import ProfilePage from "./pages/profile/ProfilePage";
import GoodsReceivedPage from "./pages/GoodsReceived";
import PageDashboard from "./pages/Dashboards/PageDashboard";
import PageNotFound from "./pages/ResponseServer/PageNotFound";
import ReceivedHistory from "./pages/GoodsReceived/History";
import ReportSalesPage from "./pages/Report/ReportSalesPage";
import ReportEntriesPage from "./pages/Report/ReportEntriesPage";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <PageLogin />,
    },
    {
      path: "/recover",
      element: <PageRecover />,
    },
    {
      element: <PrivateRoute />,
      children: [
        { path: "*", element: <PageNotFound /> },
        {
          path: "/profile",
          element: (
            <MainLayout>
              <ProfilePage />
            </MainLayout>
          ),
        },
        {
          path: "/dashboard",
          element: (
            <MainLayout>
              <PageDashboard />
            </MainLayout>
          ),
        },
        {
          path: "/received-history",
          element: (
            <MainLayout>
              <ReceivedHistory />
            </MainLayout>
          ),
        },
        {
          path: "/categories",
          element: (
            <MainLayout>
              <CategoriesPage />
            </MainLayout>
          ),
        },
        {
          path: "/products",
          element: (
            <MainLayout>
              <ProductsPage />
            </MainLayout>
          ),
        },
        {
          path: "/users",
          element: (
            <MainLayout>
              <UsersPage />
            </MainLayout>
          ),
        },
        {
          path: "/ventas",
          element: (
            <MainLayout>
              <SalePage />
            </MainLayout>
          ),
        },
        {
          path: "/sale-history",
          element: (
            <MainLayout>
              <SaleHistoryPage />
            </MainLayout>
          ),
        },
        {
          path: "/entradas",
          element: (
            <MainLayout>
              <GoodsReceivedPage />
            </MainLayout>
          ),
        },
        {
          path: "/report-sales",
          element: (
            <MainLayout>
              <ReportSalesPage />
            </MainLayout>
          ),
        },
        {
          path: "/report-entries",
          element: (
            <MainLayout>
              <ReportEntriesPage />
            </MainLayout>
          ),
        },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
    },
  }
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
